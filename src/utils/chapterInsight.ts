import { calculateScores, calculateComprehensiveScores } from "@/lib/scoring";
import type { BranchedQuestion } from "@/data/questions";
import { CHAPTERS } from "@/data/chapters";
import { archetypeData } from "@/lib/archetypes";
import { INSIGHT_MAP } from "@/utils/microRewardEngine";

export interface ChapterInsight {
  emoji: string;
  headline: string;
  sublabel: string;
  /** Short teaser for what's unlocked next. */
  nextTeaser?: string;
}

const FALLBACK: ChapterInsight = {
  emoji: "✨",
  headline: "Your pattern is taking shape",
  sublabel: "Keep going, the picture sharpens with every answer.",
};

/**
 * Build a personalised insight to show on the chapter-complete card.
 * Derived from the candidate's actual answers in that chapter.
 * - Chapter 1: emerging archetype from all answers so far.
 * - Chapters 2-5: top dimension scored from THIS chapter's questions only.
 * - Chapter 6 / final: handled by the full reveal page, return null.
 */
export function computeChapterInsight(
  completedChapterId: number,
  answers: Record<number, any>,
  pathQuestions: BranchedQuestion[],
  nextChapterUnlock?: string
): ChapterInsight | null {
  const nextTeaser = nextChapterUnlock ? `Next: ${nextChapterUnlock}` : undefined;

  try {
    // Chapter 1: emerging archetype
    if (completedChapterId === 1) {
      const answeredCount = Object.keys(answers).length;
      if (answeredCount < 3) return { ...FALLBACK, nextTeaser };
      const { primaryArchetype } = calculateScores(answers);
      const a = archetypeData[primaryArchetype];
      return {
        emoji: a.emoji,
        headline: `You're leaning ${a.name}`,
        sublabel: a.tagline,
        nextTeaser,
      };
    }

    // Chapters 2-5: strongest dimension from THIS chapter's answers
    const chapter = CHAPTERS.find(c => c.id === completedChapterId);
    if (!chapter) return { ...FALLBACK, nextTeaser };

    const chapterQuestions = pathQuestions.filter(
      q => q.id >= chapter.questionRange.start && q.id <= chapter.questionRange.end
    );
    const chapterAnswers: Record<number, any> = {};
    for (const q of chapterQuestions) {
      if (answers[q.id] !== undefined) chapterAnswers[q.id] = answers[q.id];
    }
    if (Object.keys(chapterAnswers).length === 0) {
      return { ...FALLBACK, nextTeaser };
    }

    const scores = calculateComprehensiveScores(chapterAnswers, chapterQuestions) as unknown as Record<string, number>;
    const ranked = Object.entries(scores)
      .filter(([dim, s]) => INSIGHT_MAP[dim] && s > 20)
      .sort(([, a], [, b]) => b - a);

    if (ranked.length === 0) return { ...FALLBACK, nextTeaser };
    const [topDim] = ranked[0];
    const map = INSIGHT_MAP[topDim];
    return {
      emoji: map.emoji,
      headline: map.insight,
      sublabel: map.sublabel,
      nextTeaser,
    };
  } catch {
    return { ...FALLBACK, nextTeaser };
  }
}
