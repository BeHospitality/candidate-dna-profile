import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuestionsForPath, getLayerLabel, type ExperiencePath, type BranchedQuestion } from "@/data/questions";
import { storage } from "@/lib/storage";
import ProgressBar from "@/components/assessment/ProgressBar";
import MultipleChoice from "@/components/assessment/MultipleChoice";
import SliderQuestion from "@/components/assessment/SliderQuestion";
import RankingQuestion from "@/components/assessment/RankingQuestion";
import ExperienceScreener from "@/components/ExperienceScreener";

const Assessment = () => {
  const navigate = useNavigate();
  const [experiencePath, setExperiencePath] = useState<ExperiencePath | null>(
    () => storage.getExperiencePath()
  );
  const [pathQuestions, setPathQuestions] = useState<BranchedQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>(storage.getAnswers());
  const [direction, setDirection] = useState(1);

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

  // Show screener if no path selected
  if (!experiencePath) {
    return <ExperienceScreener onSelect={handlePathSelect} />;
  }

  if (pathQuestions.length === 0) return null;

  const question = pathQuestions[currentIdx];
  if (!question) return null;

  const answer = answers[question.id];
  const totalQuestions = pathQuestions.length;
  const remainingMinutes = Math.max(1, Math.ceil(((totalQuestions - currentIdx) * 10) / 60));
  const layerLabel = getLayerLabel(question.layer);

  return (
    <AssessmentInner
      key={experiencePath}
      pathQuestions={pathQuestions}
      navigate={navigate}
    />
  );
};

// Separated into inner component to use hooks properly
const AssessmentInner = ({
  pathQuestions,
  navigate,
}: {
  pathQuestions: BranchedQuestion[];
  navigate: ReturnType<typeof useNavigate>;
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>(storage.getAnswers());
  const [direction, setDirection] = useState(1);

  const question = pathQuestions[currentIdx];
  const answer = answers[question.id];
  const totalQuestions = pathQuestions.length;
  const remainingMinutes = Math.max(1, Math.ceil(((totalQuestions - currentIdx) * 10) / 60));
  const layerLabel = getLayerLabel(question.layer);

  // Auto-initialize slider answers with default value
  useEffect(() => {
    if (question.type === "slider" && answers[question.id] === undefined) {
      const updated = { ...answers, [question.id]: 5 };
      setAnswers(updated);
      storage.setAnswers(updated);
    }
  }, [question.id, question.type]);

  const isAnswered = () => {
    if (answer === undefined) return false;
    if (question.type === "ranking") return (answer as string[]).length === (question.items?.length || 0);
    return true;
  };

  const setAnswer = useCallback(
    (value: any) => {
      const updated = { ...answers, [question.id]: value };
      setAnswers(updated);
      storage.setAnswers(updated);
    },
    [answers, question.id]
  );

  const next = () => {
    if (currentIdx < totalQuestions - 1) {
      setDirection(1);
      setCurrentIdx((i) => i + 1);
    } else {
      storage.setAnswers(answers);
      navigate("/reveal");
    }
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

  return (
    <div className="min-h-screen bg-navy-radial flex flex-col">
      <ProgressBar
        current={currentIdx + 1}
        total={totalQuestions}
        layerLabel={layerLabel}
        timeEstimate={`~${remainingMinutes} min remaining`}
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
