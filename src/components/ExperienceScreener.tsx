import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExperiencePath } from "@/data/questions";

interface PathOption {
  id: ExperiencePath;
  emoji: string;
  name: string;
  subtitle: string;
  time: string;
  questionCount: number;
  confirmCopy: string;
  focus: string;
}

const pathOptions: PathOption[] = [
  {
    id: "entry",
    emoji: "🌱",
    name: "STARTING OUT",
    subtitle: "Less than 2 years in hospitality (or brand new!)",
    time: "~10 minutes",
    questionCount: 60,
    confirmCopy: "for those starting their hospitality career.",
    focus: "Learning style, growth potential & cultural fit",
  },
  {
    id: "experienced",
    emoji: "💼",
    name: "EXPERIENCED",
    subtitle: "3–10 years in hospitality",
    time: "~18 minutes",
    questionCount: 95,
    confirmCopy: "for experienced hospitality professionals.",
    focus: "Comprehensive career profile across 23 dimensions",
  },
  {
    id: "executive",
    emoji: "👑",
    name: "EXECUTIVE",
    subtitle: "10+ years, management & leadership roles",
    time: "~12 minutes",
    questionCount: 75,
    confirmCopy: "for hospitality leaders.",
    focus: "Leadership style, vision & strategic thinking",
  },
];

interface ExperienceScreenerProps {
  onSelect: (path: ExperiencePath) => void;
}

const ExperienceScreener = ({ onSelect }: ExperienceScreenerProps) => {
  const [selected, setSelected] = useState<ExperiencePath | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectedOption = pathOptions.find((p) => p.id === selected);

  const handleConfirm = () => {
    if (selected) {
      setConfirmed(true);
      setTimeout(() => onSelect(selected), 600);
    }
  };

  return (
    <div className="min-h-screen bg-navy-radial flex flex-col items-center justify-center px-4 py-8">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-2">
              Before we begin, tell us about your
            </h2>
            <p className="text-center text-primary font-semibold text-lg mb-8">
              hospitality journey...
            </p>

            <div className="flex flex-col gap-4">
              {pathOptions.map((path, idx) => (
                <motion.button
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
                  onClick={() => setSelected(path.id)}
                  className="w-full text-left p-6 rounded-xl border-2 border-border bg-card hover:border-primary/50 hover:bg-card/80 transition-all duration-200 group"
                  style={{ minHeight: "80px" }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{path.emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                        {path.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {path.subtitle}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {path.time}
                        </span>
                        <span>·</span>
                        <span>{path.questionCount} questions</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: confirmed ? 0 : 1, scale: confirmed ? 0.9 : 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md mx-auto text-center"
          >
            <div className="glass-card p-8 rounded-2xl">
              <div className="text-5xl mb-4">{selectedOption?.emoji}</div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Perfect! We've tailored your assessment
              </h2>
              <p className="text-primary font-medium mb-6">
                {selectedOption?.confirmCopy}
              </p>

              <div className="space-y-3 text-left mb-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{selectedOption?.time}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <BarChart3 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{selectedOption?.questionCount} questions</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Target className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{selectedOption?.focus}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-6">
                Your progress saves automatically. You can resume anytime.
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  onClick={handleConfirm}
                  className="w-full rounded-xl font-bold text-lg py-6"
                >
                  Begin Assessment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <button
                  onClick={() => setSelected(null)}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Go back
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceScreener;
