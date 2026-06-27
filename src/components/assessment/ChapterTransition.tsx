import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Chapter } from "@/data/chapters";
import type { ChapterInsight } from "@/utils/chapterInsight";

interface ChapterTransitionProps {
  chapter: Chapter;
  /** Number of questions in this chapter for the user's path */
  questionCount: number;
  /** Whether a previous chapter was completed (false for Ch1 intro) */
  previousChapterCompleted: boolean;
  /** The chapter number that was just completed (for display) */
  completedChapterNumber?: number;
  /** Personalised reveal derived from the just-completed chapter's answers */
  personalInsight?: ChapterInsight | null;
  onStart: () => void;
  onSaveAndExit?: () => void;
}

const ChapterTransition = ({
  chapter,
  questionCount,
  previousChapterCompleted,
  completedChapterNumber,
  personalInsight,
  onStart,
  onSaveAndExit,
}: ChapterTransitionProps) => {
  const isFirstChapter = !previousChapterCompleted;

  return (
    <div className="min-h-screen bg-navy-radial flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md text-center space-y-6"
      >
        {/* Completion badge */}
        {previousChapterCompleted && completedChapterNumber && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-success"
          >
            ✓ Chapter {completedChapterNumber} Complete
          </motion.p>
        )}

        {/* Personalised reveal from just-completed chapter */}
        {previousChapterCompleted && personalInsight && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
            className="mx-auto max-w-sm rounded-2xl border border-primary/30 bg-card/70 backdrop-blur px-5 py-4 space-y-1.5"
          >
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
              Insight Unlocked
            </p>
            <div className="text-4xl">{personalInsight.emoji}</div>
            <p className="text-base sm:text-lg font-bold text-foreground">
              {personalInsight.headline}
            </p>
            <p className="text-sm text-muted-foreground">{personalInsight.sublabel}</p>
            {personalInsight.nextTeaser && (
              <p className="text-xs text-primary/80 pt-1">{personalInsight.nextTeaser}</p>
            )}
            <p className="text-[11px] text-muted-foreground/80 pt-2 leading-snug">
              There are no right answers. Answer honestly for the most accurate profile.
            </p>
            <p className="text-[11px] text-muted-foreground/70 leading-snug">
              This is about how you work, not whether you qualify. Eligibility depends on completing your profile and meeting the programme criteria.
            </p>
          </motion.div>
        )}

        {/* Emoji */}
        <div className="text-5xl sm:text-6xl">{chapter.emoji}</div>

        {/* Chapter number + name */}
        <div>
          <p className="text-sm font-semibold text-primary tracking-wide uppercase">
            Chapter {chapter.id}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
            {chapter.name}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto">
          {chapter.subtitle}
        </p>

        {/* Unlock badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 bg-card text-sm">
          <span>🔓</span>
          <span className="text-foreground font-medium">
            Unlocks: {chapter.unlockDescription}
          </span>
        </div>

        {/* Question count + time */}
        <p className="text-sm text-muted-foreground">
          {questionCount} questions · {chapter.timeEstimate}
        </p>

        {/* CTA */}
        <Button
          onClick={onStart}
          size="lg"
          className="rounded-xl font-bold px-10 animate-pulse-gold"
        >
          {isFirstChapter ? "Begin" : "Start Chapter"}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>

        {/* Save & come back later */}
        {previousChapterCompleted && onSaveAndExit && (
          <button
            onClick={onSaveAndExit}
            className="block mx-auto text-sm text-muted-foreground underline hover:text-foreground transition-colors"
          >
            Save & Come Back Later
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ChapterTransition;
