import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";

interface SliderQuestionProps {
  leftLabel: string;
  rightLabel: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

const SliderQuestion = ({ leftLabel, rightLabel, value, onChange }: SliderQuestionProps) => {
  const touched = value !== undefined;
  const displayValue = touched ? (value as number) : 5;

  const handleChange = (v: number) => {
    onChange(v);
  };

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
          value={[displayValue]}
          onValueChange={([v]) => handleChange(v)}
          onKeyDown={(e) => {
            // Treat arrow keys as interaction even if value doesn't change
            if (!touched && (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown")) {
              const delta = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : -1;
              const next = Math.max(0, Math.min(10, displayValue + delta));
              handleChange(next);
            }
          }}
          className={`w-full ${touched ? "" : "opacity-60"}`}
        />
        <div className="flex justify-between mt-4">
          <span className="text-sm font-semibold text-primary">{leftLabel}</span>
          <span className="text-sm font-semibold text-primary">{rightLabel}</span>
        </div>
        <div className="text-center mt-4">
          {touched ? (
            <>
              <span className="text-4xl font-bold text-foreground">{value}</span>
              <span className="text-muted-foreground text-sm ml-1">/ 10</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Drag the slider to answer
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SliderQuestion;
