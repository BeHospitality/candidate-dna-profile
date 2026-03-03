import { motion } from "framer-motion";
import type { Chapter } from "@/data/chapters";

interface ProgressBarProps {
  /** Current question position within the chapter (1-based) */
  chapterQuestionCurrent: number;
  /** Total questions in the current chapter for this path */
  chapterQuestionTotal: number;
  /** Current chapter data */
  chapter: Chapter;
  /** All chapters for the user's path */
  allChapters: Chapter[];
  /** Index of current chapter within allChapters (0-based) */
  currentChapterIndex: number;
  /** Time estimate */
  timeEstimate?: string;
}

const ProgressBar = ({
  chapterQuestionCurrent,
  chapterQuestionTotal,
  chapter,
  allChapters,
  currentChapterIndex,
  timeEstimate,
}: ProgressBarProps) => {
  const percentage = (chapterQuestionCurrent / chapterQuestionTotal) * 100;

  return (
    <div className="w-full px-4 py-3 sticky top-[52px] z-30 bg-background/90 backdrop-blur-sm border-b border-border/50">
      {/* Top row: chapter name + time */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground truncate mr-2">
          <span className="mr-1.5">{chapter.emoji}</span>
          <span className="hidden sm:inline">Chapter {chapter.id}: </span>
          {chapter.name}
        </span>
        {timeEstimate && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {timeEstimate}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-card overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(38 92% 60%))",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Below bar: question count */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-xs text-muted-foreground">
          Question {chapterQuestionCurrent} of {chapterQuestionTotal}
        </span>

        {/* Chapter dots */}
        <div className="flex items-center gap-1.5">
          {allChapters.map((ch, idx) => {
            const isCompleted = idx < currentChapterIndex;
            const isCurrent = idx === currentChapterIndex;
            return (
              <div key={ch.id} className="flex flex-col items-center">
                <div
                  className={`rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "w-2 h-2 bg-primary"
                      : isCurrent
                      ? "w-2.5 h-2.5 bg-primary animate-pulse-gold"
                      : "w-2 h-2 border border-muted-foreground/30 bg-transparent"
                  }`}
                />
                {/* Chapter number label on desktop */}
                <span className="hidden sm:block text-[9px] text-muted-foreground mt-0.5">
                  {ch.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
