import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface SliderQuestionProps {
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}

const SliderQuestion = ({ leftLabel, rightLabel, value, onChange }: SliderQuestionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto space-y-8"
    >
      <div className="glass-card p-8 rounded-2xl">
        <Slider
          min={0}
          max={10}
          step={1}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          className="w-full"
        />
        <div className="flex justify-between mt-4">
          <span className="text-sm font-semibold text-primary">{leftLabel}</span>
          <span className="text-sm font-semibold text-primary">{rightLabel}</span>
        </div>
        <div className="text-center mt-4">
          <span className="text-4xl font-bold text-foreground">{value}</span>
          <span className="text-muted-foreground text-sm ml-1">/ 10</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SliderQuestion;
