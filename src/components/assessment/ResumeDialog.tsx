import { motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedProgress {
  experiencePath: string;
  currentQuestion: number;
  answers: Record<number, any>;
  startedAt: string;
  lastSavedAt: string;
  totalQuestions: number;
}

interface ResumeDialogProps {
  progress: SavedProgress;
  onResume: () => void;
  onStartOver: () => void;
}

const pathLabels: Record<string, string> = {
  entry: "Starting Out",
  experienced: "Experienced",
  executive: "Executive",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const ResumeDialog = ({ progress, onResume, onStartOver }: ResumeDialogProps) => {
  const percentage = Math.round(
    (progress.currentQuestion / progress.totalQuestions) * 100
  );
  const remaining = progress.totalQuestions - progress.currentQuestion;
  const remainingMinutes = Math.max(1, Math.ceil((remaining * 10) / 60));

  return (
    <div className="min-h-screen bg-navy-radial flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-foreground mb-1 text-center">
            Welcome back! 👋
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            You have saved progress
          </p>

          {/* Progress indicator */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">
                {progress.currentQuestion} of {progress.totalQuestions} questions
              </span>
              <span className="font-semibold text-primary">{percentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-6 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Path</span>
              <span className="text-foreground font-medium">
                {pathLabels[progress.experiencePath] || progress.experiencePath}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Last saved</span>
              <span className="text-foreground font-medium">
                {timeAgo(progress.lastSavedAt)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Remaining</span>
              <span className="text-foreground font-medium">
                ~{remainingMinutes} minutes
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={onResume}
              size="lg"
              className="w-full rounded-xl font-bold text-lg py-6"
            >
              Resume from Q{progress.currentQuestion + 1}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={onStartOver}
              variant="outline"
              size="lg"
              className="w-full rounded-xl"
            >
              <RotateCcw className="mr-2 w-4 h-4" />
              Start Over
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeDialog;
export type { SavedProgress };
