import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MilestoneRevealProps {
  title: string;
  emoji: string;
  headline: string;
  detail: string;
  remainingQuestions: number;
  onContinue: () => void;
}

const MilestoneReveal = ({
  title,
  emoji,
  headline,
  detail,
  remainingQuestions,
  onContinue,
}: MilestoneRevealProps) => {
  const remainingMinutes = Math.max(1, Math.ceil((remainingQuestions * 10) / 60));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <div className="glass-card p-8 rounded-2xl text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          {emoji}
        </motion.div>

        <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg font-semibold text-foreground mb-2">{headline}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            {detail}
          </p>
        </motion.div>

        <Button
          onClick={onContinue}
          size="lg"
          className="w-full rounded-xl font-bold text-lg py-6 mb-3"
        >
          Continue Assessment
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        <p className="text-xs text-muted-foreground">
          {remainingQuestions} questions to go · ~{remainingMinutes} min remaining
        </p>
      </div>
    </motion.div>
  );
};

export default MilestoneReveal;
