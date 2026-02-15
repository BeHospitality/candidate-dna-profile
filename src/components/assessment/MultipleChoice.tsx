import { motion } from "framer-motion";
import type { MCOption } from "@/data/questions";

interface MultipleChoiceProps {
  options: MCOption[];
  selected: string | null;
  onSelect: (label: string) => void;
}

const MultipleChoice = ({ options, selected, onSelect }: MultipleChoiceProps) => {
  return (
    <div className="flex flex-col gap-3 w-full max-w-lg mx-auto">
      {options.map((option, idx) => (
        <motion.button
          key={option.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.3 }}
          onClick={() => onSelect(option.label)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
            selected === option.label
              ? "border-primary bg-primary/10 gold-border-glow"
              : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                selected === option.label
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {option.label}
            </span>
            <span className="font-medium text-foreground">{option.text}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default MultipleChoice;
