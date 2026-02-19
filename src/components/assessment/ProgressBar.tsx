import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
  layerLabel?: string;
  timeEstimate?: string;
  encouragement?: string;
}

const ProgressBar = ({ current, total, layerLabel, timeEstimate, encouragement }: ProgressBarProps) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Question {current} of {total}
          {timeEstimate && <span className="ml-1">· {timeEstimate}</span>}
        </span>
        <span className="text-sm font-semibold text-primary">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="flex items-center justify-between mt-1.5">
        {layerLabel && (
          <span className="text-xs text-muted-foreground italic">{layerLabel}</span>
        )}
        {encouragement && (
          <span className="text-xs text-muted-foreground">{encouragement}</span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
