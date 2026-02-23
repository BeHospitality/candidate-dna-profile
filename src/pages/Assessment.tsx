import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuestionsForPath, getLayerLabel, type ExperiencePath, type BranchedQuestion } from "@/data/questions";
import { storage } from "@/lib/storage";
import { calculateScores, calculateComprehensiveScores } from "@/lib/scoring";
import { MILESTONES, getEncouragement } from "@/lib/milestones";
import ProgressBar from "@/components/assessment/ProgressBar";
import MultipleChoice from "@/components/assessment/MultipleChoice";
import SliderQuestion from "@/components/assessment/SliderQuestion";
import RankingQuestion from "@/components/assessment/RankingQuestion";
import MilestoneReveal from "@/components/assessment/MilestoneReveal";
import ExperienceScreener from "@/components/ExperienceScreener";
import ResumeDialog, { type SavedProgress } from "@/components/assessment/ResumeDialog";
import ParticipantDetails from "@/components/ParticipantDetails";

const SAVE_KEY = "dna_assessment_progress";
const MILESTONES_SHOWN_KEY = "dna_milestones_shown";

const Assessment = () => {
  const navigate = useNavigate();
  const [experiencePath, setExperiencePath] = useState<ExperiencePath | null>(
    () => storage.getExperiencePath()
  );
  const [detailsComplete, setDetailsComplete] = useState<boolean>(
    () => !!storage.getParticipantId()
  );
  const [pathQuestions, setPathQuestions] = useState<BranchedQuestion[]>([]);
  const [resumeData, setResumeData] = useState<SavedProgress | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [initialIdx, setInitialIdx] = useState(0);
  const [initialAnswers, setInitialAnswers] = useState<Record<number, any> | null>(null);

  // Check for saved progress on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const progress: SavedProgress = JSON.parse(raw);
        const lastSaved = new Date(progress.lastSavedAt);
        const daysSince = (Date.now() - lastSaved.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince < 7 && progress.currentQuestion > 0) {
          setResumeData(progress);
          setShowResume(true);
        } else {
          localStorage.removeItem(SAVE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SAVE_KEY);
    }
  }, []);

  // Load questions when path is set
  useEffect(() => {
    if (experiencePath) {
      const qs = getQuestionsForPath(experiencePath);
      setPathQuestions(qs);
    }
  }, [experiencePath]);

  const handlePathSelect = (path: ExperiencePath) => {
    storage.setExperiencePath(path);
    setExperiencePath(path);
  };

  const handleResume = () => {
    if (!resumeData) return;
    // Restore state
    storage.setExperiencePath(resumeData.experiencePath as ExperiencePath);
    storage.setAnswers(resumeData.answers);
    setExperiencePath(resumeData.experiencePath as ExperiencePath);
    setInitialIdx(resumeData.currentQuestion);
    setInitialAnswers(resumeData.answers);
    setShowResume(false);
  };

  const handleStartOver = () => {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem(MILESTONES_SHOWN_KEY);
    storage.clear();
    setResumeData(null);
    setShowResume(false);
    setExperiencePath(null);
    setDetailsComplete(false);
    setInitialIdx(0);
    setInitialAnswers(null);
  };

  // Show resume dialog
  if (showResume && resumeData) {
    return (
      <ResumeDialog
        progress={resumeData}
        onResume={handleResume}
        onStartOver={handleStartOver}
      />
    );
  }

  // Show screener if no path selected
  if (!experiencePath) {
    return <ExperienceScreener onSelect={handlePathSelect} />;
  }

  // Show details capture if not yet completed
  if (!detailsComplete) {
    return (
      <ParticipantDetails
        experiencePath={experiencePath}
        onContinue={(participantId) => {
          storage.setParticipantId(participantId);
          setDetailsComplete(true);
        }}
      />
    );
  }

  if (pathQuestions.length === 0) return null;

  return (
    <AssessmentInner
      key={experiencePath}
      pathQuestions={pathQuestions}
      experiencePath={experiencePath}
      navigate={navigate}
      initialIdx={initialIdx}
      initialAnswers={initialAnswers}
    />
  );
};

// Separated into inner component to use hooks properly
const AssessmentInner = ({
  pathQuestions,
  experiencePath,
  navigate,
  initialIdx,
  initialAnswers,
}: {
  pathQuestions: BranchedQuestion[];
  experiencePath: ExperiencePath;
  navigate: ReturnType<typeof useNavigate>;
  initialIdx: number;
  initialAnswers: Record<number, any> | null;
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const [answers, setAnswers] = useState<Record<number, any>>(
    initialAnswers || storage.getAnswers()
  );
  const [direction, setDirection] = useState(1);
  const [activeMilestone, setActiveMilestone] = useState<{
    title: string;
    emoji: string;
    headline: string;
    detail: string;
  } | null>(null);

  const question = pathQuestions[currentIdx];
  const answer = question ? answers[question.id] : undefined;
  const totalQuestions = pathQuestions.length;
  const remainingQuestions = totalQuestions - currentIdx;
  const remainingMinutes = Math.max(1, Math.ceil((remainingQuestions * 10) / 60));
  const layerLabel = question ? getLayerLabel(question.layer) : "";
  const encouragement = getEncouragement(currentIdx + 1, totalQuestions);

  // Track shown milestones
  const shownMilestones = useMemo<Set<number>>(() => {
    try {
      const raw = localStorage.getItem(MILESTONES_SHOWN_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  }, []);

  const markMilestoneShown = (afterQuestion: number) => {
    shownMilestones.add(afterQuestion);
    localStorage.setItem(MILESTONES_SHOWN_KEY, JSON.stringify([...shownMilestones]));
  };

  // Auto-save on every answer change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const saveState: any = {
        experiencePath,
        currentQuestion: currentIdx,
        answers,
        startedAt: new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
        totalQuestions,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveState));
    }
  }, [answers, currentIdx, experiencePath, totalQuestions]);

  // Auto-initialize slider answers with default value
  useEffect(() => {
    if (question && question.type === "slider" && answers[question.id] === undefined) {
      const updated = { ...answers, [question.id]: 5 };
      setAnswers(updated);
      storage.setAnswers(updated);
    }
  }, [question?.id, question?.type]);

  const isAnswered = () => {
    if (!question) return false;
    if (answer === undefined) return false;
    if (question.type === "ranking") return (answer as string[]).length === (question.items?.length || 0);
    return true;
  };

  const setAnswer = useCallback(
    (value: any) => {
      if (!question) return;
      const updated = { ...answers, [question.id]: value };
      setAnswers(updated);
      storage.setAnswers(updated);
    },
    [answers, question?.id]
  );

  const checkMilestone = (questionIdx: number): boolean => {
    // The question ID at the current index
    const questionNumber = questionIdx + 1; // 1-based
    const milestone = MILESTONES.find(
      (m) => m.afterQuestion === questionNumber && !shownMilestones.has(m.afterQuestion)
    );

    if (!milestone) return false;

    // Calculate partial scores for milestone content
    const partialScores = calculateComprehensiveScores(answers, pathQuestions);
    const archetypeResult = calculateScores(answers);
    const archetype = archetypeResult.primaryArchetype;

    const emoji =
      milestone.afterQuestion === 12
        ? ({ lion: "🦁", whale: "🐋", falcon: "🦅" }[archetype] || "🧬")
        : milestone.emoji;

    const { headline, detail } = milestone.content(partialScores, archetype);
    setActiveMilestone({ title: milestone.title, emoji, headline, detail });
    markMilestoneShown(milestone.afterQuestion);
    return true;
  };

  const next = () => {
    if (currentIdx < totalQuestions - 1) {
      // Check for milestone before proceeding
      if (!activeMilestone && checkMilestone(currentIdx)) {
        return; // Milestone will show instead
      }
      setDirection(1);
      setCurrentIdx((i) => i + 1);
    } else {
      // Assessment complete — clear saved progress
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(MILESTONES_SHOWN_KEY);
      storage.setAnswers(answers);
      navigate("/reveal");
    }
  };

  const handleMilestoneContinue = () => {
    setActiveMilestone(null);
    setDirection(1);
    setCurrentIdx((i) => i + 1);
  };

  const prev = () => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx((i) => i - 1);
    }
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  if (!question) return null;

  // Show milestone if active
  if (activeMilestone) {
    return (
      <div className="min-h-screen bg-navy-radial flex flex-col items-center justify-center px-4">
        <MilestoneReveal
          title={activeMilestone.title}
          emoji={activeMilestone.emoji}
          headline={activeMilestone.headline}
          detail={activeMilestone.detail}
          remainingQuestions={remainingQuestions}
          onContinue={handleMilestoneContinue}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-radial flex flex-col">
      <ProgressBar
        current={currentIdx + 1}
        total={totalQuestions}
        layerLabel={layerLabel}
        timeEstimate={`~${remainingMinutes} min remaining`}
        encouragement={encouragement}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full max-w-lg mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-foreground">
              {question.text}
            </h2>

            {question.type === "mc" && question.options && (
              <MultipleChoice
                options={question.options as any}
                selected={answer as string | null}
                onSelect={setAnswer}
              />
            )}

            {question.type === "slider" && (
              <SliderQuestion
                leftLabel={question.leftLabel!}
                rightLabel={question.rightLabel!}
                value={answer !== undefined ? (answer as number) : 5}
                onChange={setAnswer}
              />
            )}

            {question.type === "ranking" && question.items && (
              <RankingQuestion
                items={question.items as any}
                ranking={(answer as string[]) || []}
                onRank={setAnswer}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-10 w-full max-w-lg mx-auto">
          {currentIdx > 0 && (
            <Button variant="outline" onClick={prev} size="lg" className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div className="flex-1" />
          <Button
            onClick={next}
            size="lg"
            disabled={!isAnswered()}
            className="rounded-xl font-bold px-8"
          >
            {currentIdx === totalQuestions - 1 ? "See Results" : "Next"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
