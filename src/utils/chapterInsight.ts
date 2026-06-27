import type { BranchedQuestion } from "@/data/questions";
import { calculateScores } from "@/lib/scoring";
import { CHAPTERS } from "@/data/chapters";
import { archetypeData } from "@/lib/archetypes";
import { INSIGHT_MAP } from "@/utils/microRewardEngine";

// ─────────────────────────────────────────────────────────────────────────────
// SAFETY THRESHOLDS — tune here. All other code reads from these constants.
// ─────────────────────────────────────────────────────────────────────────────

/** Minimum answered items for a dimension to be eligible to be "named" in Ch2-5. */
export const MIN_ITEMS_PER_DIM = 3;

/** Per-question contributions live on a 0-10 scale (same as MC option scores).
 *  Top dim must beat runner-up by this margin to be named. ~10% of 10. */
export const MIN_MARGIN = 1.0;

/** Minimum answered Ch1 items before we hint at an archetype. */
export const MIN_CH1_ANSWERS = 6;

/** Archetype scores are 0-100. Top archetype must beat the second by this
 *  margin to be hinted. ~10-15% of 100. */
export const MIN_ARCH_MARGIN = 10;

// ─────────────────────────────────────────────────────────────────────────────

export interface ChapterInsight {
  emoji: string;
  headline: string;
  sublabel: string;
  /** Short teaser for what's unlocked next. */
  nextTeaser?: string;
  /** True when a real personalised signal was named; false for the neutral fallback. */
  gated?: boolean;
  /** The dimension or archetype that was named (for analytics). Undefined for fallbacks. */
  named?: string;
}

const FALLBACK = (nextTeaser?: string): ChapterInsight => ({
  emoji: "✨",
  headline: "Your pattern is taking shape",
  sublabel: "Keep going — the picture sharpens with every answer.",
  nextTeaser,
  gated: false,
});

/** Per-question, per-dimension 0-10 contribution, or null if the question
 *  doesn't touch this dim or wasn't answered usefully. */
function questionContribution(q: BranchedQuestion, answer: any, dim: string): number | null {
  if (answer === undefined || answer === null) return null;

  if (q.type === "mc" && q.options) {
    const selected = q.options.find(o => o.label === answer);
    if (!selected) return null;
    const v = (selected.scores as Record<string, number>)[dim];
    return typeof v === "number" ? v : null;
  }

  if (q.type === "slider") {
    const left = (q.leftScores || {}) as Record<string, number>;
    const right = (q.rightScores || {}) as Record<string, number>;
    if (left[dim] === undefined && right[dim] === undefined) return null;
    const val = (answer as number) / 10; // 0..1
    const l = left[dim] ?? 0;
    const r = right[dim] ?? 0;
    return l + (r - l) * val;
  }

  if (q.type === "ranking" && q.items) {
    const ranking = answer as string[];
    const multipliers = [1.5, 1.0, 0.5, 0.25];
    let weightedSum = 0;
    let weightTotal = 0;
    ranking.forEach((text, idx) => {
      const item = q.items!.find(i => i.text === text);
      if (!item) return;
      const v = (item.scores as Record<string, number>)[dim];
      if (typeof v !== "number") return;
      const m = multipliers[idx] ?? 0.25;
      weightedSum += v * m;
      weightTotal += m;
    });
    if (weightTotal === 0) return null;
    return weightedSum / weightTotal; // 0-10 scale
  }

  return null;
}

/** Rank dimensions for a chapter by the raw mean of answered items.
 *  Returns entries sorted by score desc, then alphabetically for deterministic tie-break. */
function rankChapterDimensions(
  chapterQuestions: BranchedQuestion[],
  answers: Record<number, any>
): Array<{ dim: string; mean: number; count: number }> {
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const q of chapterQuestions) {
    const ans = answers[q.id];
    if (ans === undefined) continue;
    for (const dim of Object.keys(INSIGHT_MAP)) {
      const v = questionContribution(q, ans, dim);
      if (v === null) continue;
      sums[dim] = (sums[dim] || 0) + v;
      counts[dim] = (counts[dim] || 0) + 1;
    }
  }

  return Object.keys(counts)
    .filter(d => counts[d] > 0) // no divide-by-zero
    .map(dim => ({ dim, mean: sums[dim] / counts[dim], count: counts[dim] }))
    .sort((a, b) => (b.mean - a.mean) || a.dim.localeCompare(b.dim));
}

/** Short, neutral phrasing per dimension for chapter-local reveals (Ch2-5). */
const CHAPTER_PHRASE: Record<string, string> = {
  leadership:         "you take initiative",
  precision:          "you favour accuracy",
  empathy:            "you tune into people",
  adaptability:       "you adjust to change",
  collaboration:      "you work with others",
  conscientiousness:  "you follow through",
  problemSolving:     "you look for routes",
  attentionToDetail:  "you notice small things",
  learningSpeed:      "you pick things up quickly",
  patternRecognition: "you spot patterns",
  concentration:      "you focus deeply",
  extraversion:       "you bring social energy",
  openness:           "you stay curious",
  agreeableness:      "you seek harmony",
  emotionalStability: "you stay steady",
  autonomy:           "you work independently",
  readingOthers:      "you read between the lines",
  selfRegulation:     "you keep your composure",
  socialAwareness:    "you read the room",
  integrity:          "you act consistently",
  ruleFollowing:      "you respect standards",
  safetyConsciousness:"you think about safety",
  dependability:      "you show up reliably",
};

export function computeChapterInsight(
  completedChapterId: number,
  answers: Record<number, any>,
  pathQuestions: BranchedQuestion[],
  nextChapterUnlock?: string
): ChapterInsight | null {
  const nextTeaser = nextChapterUnlock ? `Next: ${nextChapterUnlock}` : undefined;

  try {
    // ── Chapter 1: gated archetype hint ──────────────────────────────────────
    if (completedChapterId === 1) {
      const answeredCount = Object.keys(answers).length;
      if (answeredCount < MIN_CH1_ANSWERS) return FALLBACK(nextTeaser);

      const result = calculateScores(answers);
      const aScores = result.archetypeScores; // 0-100
      const ranked = (Object.entries(aScores) as Array<[string, number]>)
        .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]));
      const [topKey, topScore] = ranked[0];
      const [, secondScore] = ranked[1];
      if (topScore - secondScore < MIN_ARCH_MARGIN) return FALLBACK(nextTeaser);

      const a = archetypeData[topKey as keyof typeof archetypeData];
      return {
        emoji: a.emoji,
        headline: `Early signal: ${a.name} is showing up`,
        sublabel: "This can change as you answer more.",
        nextTeaser,
        gated: true,
        named: topKey,
      };
    }

    // ── Chapters 2-5: gated raw-mean ranking on this chapter's answers ──────
    const chapter = CHAPTERS.find(c => c.id === completedChapterId);
    if (!chapter) return FALLBACK(nextTeaser);

    const chapterQuestions = pathQuestions.filter(
      q => q.id >= chapter.questionRange.start && q.id <= chapter.questionRange.end
    );
    const ranked = rankChapterDimensions(chapterQuestions, answers);
    const eligible = ranked.filter(r => r.count >= MIN_ITEMS_PER_DIM);
    if (eligible.length === 0) return FALLBACK(nextTeaser);

    const top = eligible[0];
    const runnerUp = eligible[1];
    if (runnerUp && (top.mean - runnerUp.mean) < MIN_MARGIN) return FALLBACK(nextTeaser);

    const map = INSIGHT_MAP[top.dim];
    if (!map) return FALLBACK(nextTeaser);
    const phrase = CHAPTER_PHRASE[top.dim] || top.dim;
    return {
      emoji: map.emoji,
      headline: `In this chapter, a pattern showing up: ${phrase}.`,
      sublabel: "Provisional — based on this chapter's answers only.",
      nextTeaser,
      gated: true,
      named: top.dim,
    };
  } catch {
    return FALLBACK(nextTeaser);
  }
}
