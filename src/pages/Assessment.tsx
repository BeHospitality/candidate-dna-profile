import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { questions } from "@/data/questions";
import { storage } from "@/lib/storage";
import ProgressBar from "@/components/assessment/ProgressBar";
import MultipleChoice from "@/components/assessment/MultipleChoice";
import SliderQuestion from "@/components/assessment/SliderQuestion";
import RankingQuestion from "@/components/assessment/RankingQuestion";

const Assessment = () => {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>(storage.getAnswers());
  const [direction, setDirection] = useState(1);

  const question = questions[currentIdx];
  const answer = answers[question.id];

  const isAnswered = () => {
    if (answer === undefined) return false;
    if (question.type === "ranking") return (answer as string[]).length === question.items!.length;
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
    if (currentIdx < questions.length - 1) {
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
      <ProgressBar current={currentIdx + 1} total={questions.length} />

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
                options={question.options}
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
                items={question.items}
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
            {currentIdx === questions.length - 1 ? "See Results" : "Next"}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
