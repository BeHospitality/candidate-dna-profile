import { type DimensionScores, type Question, questions } from "@/data/questions";
import type { BranchedQuestion } from "@/data/questions";

export type Archetype = "lion" | "whale" | "falcon";

export interface AssessmentResult {
  scores: DimensionScores;
  primaryArchetype: Archetype;
  secondaryArchetype: Archetype | null;
  archetypeScores: { lion: number; whale: number; falcon: number };
}

export function calculateScores(answers: Record<number, any>): AssessmentResult {
  const raw: DimensionScores = { autonomy: 0, collaboration: 0, precision: 0, leadership: 0, adaptability: 0 };
  let totalQuestions = 0;

  questions.forEach((q: Question) => {
    const answer = answers[q.id];
    if (answer === undefined) return;
    totalQuestions++;

    if (q.type === "mc" && q.options) {
      const selected = q.options.find((o) => o.label === answer);
      if (selected) {
        Object.entries(selected.scores).forEach(([k, v]) => {
          raw[k as keyof DimensionScores] += v;
        });
      }
    } else if (q.type === "slider" && q.leftScores && q.rightScores) {
      const val = (answer as number) / 10; // 0-1 range
      Object.keys(raw).forEach((k) => {
        const key = k as keyof DimensionScores;
        raw[key] += q.leftScores![key] * (1 - val) + q.rightScores![key] * val;
      });
    } else if (q.type === "ranking" && q.items) {
      const ranking = answer as string[];
      ranking.forEach((text: string, idx: number) => {
        const item = q.items!.find((i) => i.text === text);
        if (item) {
          const multiplier = [1.5, 1.0, 0.5][idx] || 0.5;
          Object.entries(item.scores).forEach(([k, v]) => {
            raw[k as keyof DimensionScores] += v * multiplier;
          });
        }
      });
    }
  });

  // Normalize to 0-100
  const maxPossible = totalQuestions * 10;
  const scores: DimensionScores = {
    autonomy: Math.round(Math.min(100, (raw.autonomy / maxPossible) * 100)),
    collaboration: Math.round(Math.min(100, (raw.collaboration / maxPossible) * 100)),
    precision: Math.round(Math.min(100, (raw.precision / maxPossible) * 100)),
    leadership: Math.round(Math.min(100, (raw.leadership / maxPossible) * 100)),
    adaptability: Math.round(Math.min(100, (raw.adaptability / maxPossible) * 100)),
  };

  const archetypeScores = {
    lion: scores.autonomy * 0.35 + scores.leadership * 0.4 + scores.adaptability * 0.15 + scores.precision * 0.1,
    whale: scores.collaboration * 0.4 + scores.adaptability * 0.3 + scores.leadership * 0.15 + scores.precision * 0.15,
    falcon: scores.precision * 0.4 + scores.autonomy * 0.2 + scores.collaboration * 0.15 + scores.adaptability * 0.15 + scores.leadership * 0.1,
  };

  const sorted = Object.entries(archetypeScores).sort((a, b) => b[1] - a[1]);
  const primaryArchetype = sorted[0][0] as Archetype;
  const secondaryArchetype = sorted[1][1] > sorted[2][1] * 1.1 ? (sorted[1][0] as Archetype) : null;

  return { scores, primaryArchetype, secondaryArchetype, archetypeScores };
}

// ==============================
// COMPREHENSIVE SCORING (additive)
// ==============================

export interface ComprehensiveScores {
  // Layer 1: Archetype Foundation (from existing scoring)
  autonomy: number;
  collaboration: number;
  precision: number;
  leadership: number;
  adaptability: number;

  // Layer 2: Cognitive Aptitude
  problemSolving: number;
  attentionToDetail: number;
  learningSpeed: number;
  patternRecognition: number;
  concentration: number;

  // Layer 3: Personality - Big 5
  extraversion: number;
  conscientiousness: number;
  openness: number;
  agreeableness: number;
  emotionalStability: number;

  // Layer 4: Emotional Intelligence
  readingOthers: number;
  empathy: number;
  selfRegulation: number;
  socialAwareness: number;

  // Layer 5: Reliability & Risk
  integrity: number;
  ruleFollowing: number;
  safetyConsciousness: number;
  dependability: number;
}

const ALL_DIMENSIONS: (keyof ComprehensiveScores)[] = [
  'autonomy', 'collaboration', 'precision', 'leadership', 'adaptability',
  'problemSolving', 'attentionToDetail', 'learningSpeed', 'patternRecognition', 'concentration',
  'extraversion', 'conscientiousness', 'openness', 'agreeableness', 'emotionalStability',
  'readingOthers', 'empathy', 'selfRegulation', 'socialAwareness',
  'integrity', 'ruleFollowing', 'safetyConsciousness', 'dependability',
];

const LAYER1_DIMS = new Set(['autonomy', 'collaboration', 'precision', 'leadership', 'adaptability']);

export function calculateComprehensiveScores(
  answers: Record<number, any>,
  pathQuestions: BranchedQuestion[]
): ComprehensiveScores {
  // Initialize raw score accumulators and question counts per dimension
  const rawScores: Record<string, number> = {};
  const questionCounts: Record<string, number> = {};
  ALL_DIMENSIONS.forEach(d => { rawScores[d] = 0; questionCounts[d] = 0; });

  // Get Layer 1 scores from existing calculator (keeps archetype scoring identical)
  const archetypeResult = calculateScores(answers);

  // Process ALL questions (including archetype ones for non-layer-1 dimensions they may contribute to)
  pathQuestions.forEach((q) => {
    const answer = answers[q.id];
    if (answer === undefined || answer === null) return;

    if (q.type === "mc" && q.options) {
      // MC: answer is the selected option label (A/B/C/D)
      const selected = q.options.find(o => o.label === answer);
      if (selected) {
        Object.entries(selected.scores).forEach(([dim, score]) => {
          if (!LAYER1_DIMS.has(dim) && rawScores[dim] !== undefined) {
            rawScores[dim] += score as number;
            questionCounts[dim]++;
          }
        });
      }
    } else if (q.type === "slider") {
      const val = (answer as number) / 10; // 0 to 1
      const left = q.leftScores || {};
      const right = q.rightScores || {};
      const allKeys = new Set([...Object.keys(left), ...Object.keys(right)]);
      allKeys.forEach(dim => {
        if (!LAYER1_DIMS.has(dim) && rawScores[dim] !== undefined) {
          const leftVal = (left as any)[dim] || 0;
          const rightVal = (right as any)[dim] || 0;
          const interpolated = leftVal + (rightVal - leftVal) * val;
          rawScores[dim] += interpolated;
          questionCounts[dim]++;
        }
      });
    } else if (q.type === "ranking" && q.items) {
      const ranking = answer as string[];
      const multipliers = [1.5, 1.0, 0.5, 0.25];
      ranking.forEach((text, idx) => {
        const item = q.items!.find(i => i.text === text);
        if (item) {
          const mult = multipliers[idx] || 0.25;
          Object.entries(item.scores).forEach(([dim, baseScore]) => {
            if (!LAYER1_DIMS.has(dim) && rawScores[dim] !== undefined) {
              rawScores[dim] += (baseScore as number) * mult * 10; // scale ranking scores
              questionCounts[dim]++;
            }
          });
        }
      });
    }
  });

  // Normalize: Layer 1 from archetype calculator, others averaged and scaled to 0-100
  const scores: Record<string, number> = {};
  ALL_DIMENSIONS.forEach(d => {
    if (LAYER1_DIMS.has(d)) {
      scores[d] = archetypeResult.scores[d as keyof DimensionScores];
    } else {
      const count = questionCounts[d] || 0;
      if (count === 0) {
        scores[d] = 0;
      } else {
        const avg = rawScores[d] / count;
        scores[d] = Math.min(100, Math.max(0, Math.round(avg * 10)));
      }
    }
  });

  return scores as unknown as ComprehensiveScores;
}
