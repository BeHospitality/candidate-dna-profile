import { type DimensionScores, type Question, questions } from "@/data/questions";

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
