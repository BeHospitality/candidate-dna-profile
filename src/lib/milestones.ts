import type { ComprehensiveScores } from "@/lib/scoring";

export interface Milestone {
  afterQuestion: number;
  title: string;
  emoji: string;
  content: (scores: Partial<ComprehensiveScores>, archetype?: string) => {
    headline: string;
    detail: string;
  };
}

const archetypeNames: Record<string, string> = {
  lion: "Lion",
  whale: "Whale",
  falcon: "Falcon",
};

const archetypeEmojis: Record<string, string> = {
  lion: "🦁",
  whale: "🐋",
  falcon: "🦅",
};

export const MILESTONES: Milestone[] = [
  {
    afterQuestion: 12,
    title: "Archetype Discovered!",
    emoji: "🧬",
    content: (_scores, archetype) => {
      const name = archetype ? archetypeNames[archetype] || archetype : "Unknown";
      return {
        headline: `You're a ${name}!`,
        detail:
          name === "Lion"
            ? "The Autonomous Leader — decisive, independent, visionary."
            : name === "Whale"
            ? "The Collaborative Anchor — empathetic, supportive, adaptive."
            : "The Precision Specialist — detail-oriented, systematic, expert.",
      };
    },
  },
  {
    afterQuestion: 27,
    title: "Cognitive Profile Unlocked!",
    emoji: "🧠",
    content: (scores) => {
      const cognitive = [
        { name: "Problem Solving", score: scores.problemSolving || 0 },
        { name: "Attention to Detail", score: scores.attentionToDetail || 0 },
        { name: "Learning Speed", score: scores.learningSpeed || 0 },
        { name: "Pattern Recognition", score: scores.patternRecognition || 0 },
        { name: "Concentration", score: scores.concentration || 0 },
      ].sort((a, b) => b.score - a.score);

      return {
        headline: `Top strengths: ${cognitive[0].name} & ${cognitive[1].name}`,
        detail: `Your cognitive profile is taking shape. ${cognitive[0].name} is your standout ability.`,
      };
    },
  },
  {
    afterQuestion: 47,
    title: "Personality Profile Complete!",
    emoji: "🎭",
    content: (scores) => {
      const big5 = [
        { name: "Extraversion", score: scores.extraversion || 0 },
        { name: "Conscientiousness", score: scores.conscientiousness || 0 },
        { name: "Openness", score: scores.openness || 0 },
        { name: "Agreeableness", score: scores.agreeableness || 0 },
        { name: "Emotional Stability", score: scores.emotionalStability || 0 },
      ].sort((a, b) => b.score - a.score);

      return {
        headline: `High ${big5[0].name}, High ${big5[1].name}`,
        detail: "Your personality profile reveals what makes you tick in a team environment.",
      };
    },
  },
  {
    afterQuestion: 62,
    title: "EQ Profile Unlocked!",
    emoji: "💡",
    content: (scores) => {
      const eq = [
        { name: "Reading Others", score: scores.readingOthers || 0 },
        { name: "Empathy", score: scores.empathy || 0 },
        { name: "Self-Regulation", score: scores.selfRegulation || 0 },
        { name: "Social Awareness", score: scores.socialAwareness || 0 },
      ].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

      return {
        headline: `Your EQ superpower: ${eq[0].name}`,
        detail: "Emotional intelligence is what separates good hospitality from great hospitality.",
      };
    },
  },
  {
    afterQuestion: 77,
    title: "Reliability Score Calculated!",
    emoji: "🛡️",
    content: (scores) => {
      const avg = Math.round(
        ((scores.integrity || 0) +
          (scores.ruleFollowing || 0) +
          (scores.safetyConsciousness || 0) +
          (scores.dependability || 0)) /
          4
      );

      return {
        headline:
          avg >= 75
            ? "Highly Reliable Professional"
            : avg >= 50
            ? "Solid Foundation"
            : "Room to Grow",
        detail: "Your reliability profile helps properties understand your professional standards.",
      };
    },
  },
];

export function getEncouragement(current: number, total: number): string {
  const percent = Math.round((current / total) * 100);
  if (percent < 15) return "Great start — let's discover your DNA 🧬";
  if (percent < 30) return "You're building momentum 💪";
  if (percent < 45) return "Nearly halfway — your profile is taking shape";
  if (percent < 60) return "Over halfway! The insights get richer from here";
  if (percent < 75) return "Fantastic progress — you're in the home stretch";
  if (percent < 90) return "Almost there — just a few more questions ⭐";
  return "Final questions — your full DNA profile awaits! 🎉";
}
