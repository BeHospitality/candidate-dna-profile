import { useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConsentGate, { hasConsented } from "@/components/ConsentGate";
import { getQuestionsForPath, getLayerLabel, type ExperiencePath, type BranchedQuestion } from "@/data/questions";
import { getChaptersForPath, getChapterForQuestion, getQuestionInChapter, type Chapter } from "@/data/chapters";
import { storage } from "@/lib/storage";
import { calculateScores, calculateComprehensiveScores } from "@/lib/scoring";
import { MILESTONES } from "@/lib/milestones";
import ProgressBar from "@/components/assessment/ProgressBar";
import MultipleChoice from "@/components/assessment/MultipleChoice";
import SliderQuestion from "@/components/assessment/SliderQuestion";
import RankingQuestion from "@/components/assessment/RankingQuestion";
import MilestoneReveal from "@/components/assessment/MilestoneReveal";
import ChapterTransition from "@/components/assessment/ChapterTransition";
import MicroReward from "@/components/assessment/MicroReward";
import { getMicroReward, type MicroRewardContent } from "@/utils/microRewardEngine";
import ExperienceScreener from "@/components/ExperienceScreener";
import ResumeDialog, { type SavedProgress } from "@/components/assessment/ResumeDialog";
import SaveProgressDialog from "@/components/assessment/SaveProgressDialog";
import ParticipantDetails from "@/components/ParticipantDetails";
import BrandHeader from "@/components/BrandHeader";

const SAVE_KEY = "dna_assessment_progress";
const MILESTONES_SHOWN_KEY = "dna_milestones_shown";

// Chapter boundary question IDs — milestones at these are replaced by chapter transitions
const CHAPTER_BOUNDARY_QUESTIONS = new Set([12, 27, 47, 62, 77]);

const Assessment = () => {
  const navigate = useNavigate();
  const [consentGiven, setConsentGiven] = useState(() => hasConsented());
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
  const [isResuming, setIsResuming] = useState(false);

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
    storage.setExperiencePath(resumeData.experiencePath as ExperiencePath);
    storage.setAnswers(resumeData.answers);
    setExperiencePath(resumeData.experiencePath as ExperiencePath);
    setInitialIdx(resumeData.currentQuestion);
    setInitialAnswers(resumeData.answers);
    setIsResuming(true);
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
    setIsResuming(false);
  };

  if (showResume && resumeData) {
    return (
      <ResumeDialog
        progress={resumeData}
        onResume={handleResume}
        onStartOver={handleStartOver}
      />
    );
  }

  if (!experiencePath) {
    return <ExperienceScreener onSelect={handlePathSelect} />;
  }

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
      isResuming={isResuming}
    />
  );
};

const AssessmentInner = ({
  pathQuestions,
  experiencePath,
  navigate,
  initialIdx,
  initialAnswers,
  isResuming,
}: {
  pathQuestions: BranchedQuestion[];
  experiencePath: ExperiencePath;
  navigate: ReturnType<typeof useNavigate>;
  initialIdx: number;
  initialAnswers: Record<number, any> | null;
  isResuming: boolean;
}) => {
  const [currentIdx, setCurrentIdx] = useState(initialIdx);
  const [answers, setAnswers] = useState<Record<number, any>>(
    initialAnswers || storage.getAnswers()
  );
  const [direction, setDirection] = useState(1);
  const [activeMilestone, setActiveMilestone] = useState<{
    title: string; emoji: string; headline: string; detail: string;
  } | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showChapterTransition, setShowChapterTransition] = useState(!isResuming);
  const [pendingChapter, setPendingChapter] = useState<Chapter | null>(null);
  const [completedChapterNumber, setCompletedChapterNumber] = useState<number | undefined>(undefined);
  const [firedPositions] = useState<Set<number>>(() => {
    if (isResuming && initialIdx > 0) {
      const positions = [7, 17, 27, 37, 47, 57, 67].filter(p => p < initialIdx);
      return new Set(positions);
    }
    return new Set();
  });
  const [microReward, setMicroReward] = useState<MicroRewardContent | null>(null);

  const pathQuestionIds = useMemo(() => pathQuestions.map(q => q.id), [pathQuestions]);
  const pathChapters = useMemo(() => getChaptersForPath(experiencePath), [experiencePath]);

  const question = pathQuestions[currentIdx];
  const answer = question ? answers[question.id] : undefined;
  const totalQuestions = pathQuestions.length;

  // Current chapter info
  const currentChapter = question ? getChapterForQuestion(question.id) : undefined;
  const currentChapterIndex = currentChapter
    ? pathChapters.findIndex(ch => ch.id === currentChapter.id)
    : 0;
  const chapterProgress = currentChapter && question
    ? getQuestionInChapter(question.id, currentChapter, pathQuestionIds)
    : { current: 1, total: 1 };

  // Calculate time remaining in chapter
  const chapterRemainingQuestions = chapterProgress.total - chapterProgress.current + 1;
  const chapterTimeEstimate = `~${Math.max(1, Math.ceil((chapterRemainingQuestions * 10) / 60))} min`;

  // For the initial chapter transition, determine the first chapter
  const firstChapter = pathChapters[0];
  const firstChapterQuestionCount = firstChapter
    ? pathQuestionIds.filter(
        qId => qId >= firstChapter.questionRange.start && qId <= firstChapter.questionRange.end
      ).length
    : 0;

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

  // Auto-initialize slider answers
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
    const questionNumber = questionIdx + 1;
    const currentQ = pathQuestions[questionIdx];

    // Skip milestone reveals at chapter boundaries — chapter transitions handle these
    if (currentQ && CHAPTER_BOUNDARY_QUESTIONS.has(currentQ.id)) {
      return false;
    }

    const milestone = MILESTONES.find(
      (m) => m.afterQuestion === questionNumber && !shownMilestones.has(m.afterQuestion)
    );
    if (!milestone) return false;

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
      // Check for chapter boundary
      const currentQ = pathQuestions[currentIdx];
      const nextQ = pathQuestions[currentIdx + 1];
      const currentCh = currentQ ? getChapterForQuestion(currentQ.id) : undefined;
      const nextCh = nextQ ? getChapterForQuestion(nextQ.id) : undefined;

      if (currentCh && nextCh && currentCh.id !== nextCh.id) {
        // Chapter boundary — show transition
        const nextPathChapter = pathChapters.find(ch => ch.id === nextCh.id);
        if (nextPathChapter) {
          setCompletedChapterNumber(currentCh.id);
          setPendingChapter(nextPathChapter);
          setShowChapterTransition(true);
          setDirection(1);
          setCurrentIdx(i => i + 1);
          return;
        }
      }

      // Check for non-boundary milestone
      if (!activeMilestone && checkMilestone(currentIdx)) {
        return;
      }

      // Check for micro-reward
      const partialScores = calculateComprehensiveScores(answers, pathQuestions);
      const reward = getMicroReward(
        partialScores as unknown as Record<string, number>,
        currentIdx,
        firedPositions
      );
      if (reward) {
        firedPositions.add(currentIdx);
        setMicroReward(reward);
        return;
      }

      setDirection(1);
      setCurrentIdx(i => i + 1);
    } else {
      // Assessment complete
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem(MILESTONES_SHOWN_KEY);
      storage.setAnswers(answers);
      navigate("/reveal");
    }
  };

  const handleMicroRewardDismiss = () => {
    setMicroReward(null);
    setDirection(1);
    setCurrentIdx(i => i + 1);
  };

  const handleMilestoneContinue = () => {
    setActiveMilestone(null);
    setDirection(1);
    setCurrentIdx(i => i + 1);
  };

  const handleChapterStart = () => {
    setShowChapterTransition(false);
    setPendingChapter(null);
    setCompletedChapterNumber(undefined);
  };

  const prev = () => {
    if (currentIdx > 0) {
      setDirection(-1);
      setCurrentIdx(i => i - 1);
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
    const remainingQuestions = totalQuestions - currentIdx;
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

  // Show micro-reward overlay
  if (microReward) {
    return <MicroReward content={microReward} onDismiss={handleMicroRewardDismiss} />;
  }

  // Show chapter transition
  if (showChapterTransition) {
    const displayChapter = pendingChapter || firstChapter;
    if (displayChapter) {
      const chQCount = pathQuestionIds.filter(
        qId => qId >= displayChapter.questionRange.start && qId <= displayChapter.questionRange.end
      ).length;
      return (
        <>
          <BrandHeader />
          <ChapterTransition
            chapter={displayChapter}
            questionCount={chQCount}
            previousChapterCompleted={!!pendingChapter}
            completedChapterNumber={completedChapterNumber}
            onStart={handleChapterStart}
            onSaveAndExit={pendingChapter ? () => setShowSaveDialog(true) : undefined}
          />
          {showSaveDialog && (
            <SaveProgressDialog
              data={{
                experiencePath,
                currentQuestion: currentIdx,
                answers,
                totalQuestions,
                email: storage.getEntryMode().candidateEmail,
                participantId: storage.getParticipantId() || undefined,
              }}
              onClose={() => setShowSaveDialog(false)}
            />
          )}
        </>
      );
    }
  }

  return (
    <div className="min-h-screen bg-navy-radial flex flex-col">
      <BrandHeader />
      {currentChapter && (
        <ProgressBar
          chapterQuestionCurrent={chapterProgress.current}
          chapterQuestionTotal={chapterProgress.total}
          chapter={currentChapter}
          allChapters={pathChapters}
          currentChapterIndex={currentChapterIndex}
          timeEstimate={chapterTimeEstimate}
        />
      )}

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
            variant="ghost"
            size="sm"
            onClick={() => setShowSaveDialog(true)}
            className="text-muted-foreground hover:text-foreground rounded-xl"
          >
            <BookmarkPlus className="w-4 h-4 mr-1.5" />
            Save & Finish Later
          </Button>
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

        {showSaveDialog && (
          <SaveProgressDialog
            data={{
              experiencePath,
              currentQuestion: currentIdx,
              answers,
              totalQuestions,
              email: storage.getEntryMode().candidateEmail,
              participantId: storage.getParticipantId() || undefined,
            }}
            onClose={() => setShowSaveDialog(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Assessment;
