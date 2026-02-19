/**
 * Department Matching Algorithm
 * Ranks 8 hotel departments by fit score based on candidate's profile.
 */

import type { ComprehensiveScores } from "@/lib/scoring";

export interface DepartmentFit {
  department: string;
  emoji: string;
  fitScore: number;
  stars: number;
  rank: number;
  topReasons: string[];
}

interface DepartmentProfile {
  name: string;
  emoji: string;
  weights: Record<string, number>;
  reasonTemplates: Record<string, string>;
}

const DEPARTMENT_PROFILES: DepartmentProfile[] = [
  {
    name: "Guest Relations / Concierge", emoji: "🛎️",
    weights: {
      empathy: 0.18, readingOthers: 0.15, extraversion: 0.12, socialAwareness: 0.10,
      problemSolving: 0.10, selfRegulation: 0.08, openness: 0.07, collaboration: 0.07,
      conscientiousness: 0.05, adaptability: 0.05, emotionalStability: 0.03,
    },
    reasonTemplates: {
      empathy: "Natural ability to connect with guests", readingOthers: "Reads unspoken guest needs",
      extraversion: "Energised by guest interaction", socialAwareness: "Culturally sensitive service",
      problemSolving: "Creative solutions for guest requests",
    },
  },
  {
    name: "Front Office Management", emoji: "🏨",
    weights: {
      leadership: 0.18, conscientiousness: 0.15, precision: 0.12, emotionalStability: 0.10,
      problemSolving: 0.10, collaboration: 0.08, attentionToDetail: 0.07,
      dependability: 0.07, selfRegulation: 0.05, integrity: 0.05, concentration: 0.03,
    },
    reasonTemplates: {
      leadership: "Strong team leadership", conscientiousness: "Organised and systematic",
      precision: "High operational standards", emotionalStability: "Calm during check-in rushes",
      problemSolving: "Quick decision-making",
    },
  },
  {
    name: "Events & Banqueting", emoji: "🎉",
    weights: {
      collaboration: 0.18, adaptability: 0.15, attentionToDetail: 0.12, problemSolving: 0.10,
      concentration: 0.10, conscientiousness: 0.08, openness: 0.07,
      extraversion: 0.07, leadership: 0.05, emotionalStability: 0.05, dependability: 0.03,
    },
    reasonTemplates: {
      collaboration: "Excellent team coordinator", adaptability: "Handles event surprises gracefully",
      attentionToDetail: "Meticulous event execution", problemSolving: "Quick fixes under pressure",
      concentration: "Stays focused during complex setups",
    },
  },
  {
    name: "Food & Beverage Service", emoji: "🍽️",
    weights: {
      extraversion: 0.15, adaptability: 0.15, concentration: 0.12, emotionalStability: 0.10,
      collaboration: 0.10, selfRegulation: 0.08, dependability: 0.08,
      learningSpeed: 0.07, readingOthers: 0.05, empathy: 0.05, safetyConsciousness: 0.05,
    },
    reasonTemplates: {
      extraversion: "Natural front-of-house energy", adaptability: "Handles busy service with ease",
      concentration: "Manages multiple tables flawlessly", emotionalStability: "Stays composed during rush",
      collaboration: "Strong team player on the floor",
    },
  },
  {
    name: "Housekeeping", emoji: "🛏️",
    weights: {
      attentionToDetail: 0.20, conscientiousness: 0.18, dependability: 0.15,
      ruleFollowing: 0.10, safetyConsciousness: 0.10, autonomy: 0.08,
      concentration: 0.07, integrity: 0.05, adaptability: 0.04, collaboration: 0.03,
    },
    reasonTemplates: {
      attentionToDetail: "Eagle eye for cleanliness standards", conscientiousness: "Consistently thorough work",
      dependability: "Reliable and punctual", ruleFollowing: "Follows procedures exactly",
      autonomy: "Works well independently",
    },
  },
  {
    name: "Revenue Management", emoji: "📊",
    weights: {
      patternRecognition: 0.20, precision: 0.18, problemSolving: 0.15,
      attentionToDetail: 0.12, concentration: 0.10, autonomy: 0.08,
      conscientiousness: 0.07, learningSpeed: 0.05, openness: 0.03, adaptability: 0.02,
    },
    reasonTemplates: {
      patternRecognition: "Spots revenue trends naturally", precision: "Data-driven decision maker",
      problemSolving: "Analytical thinker", attentionToDetail: "Catches pricing anomalies",
      concentration: "Deep focus on complex data",
    },
  },
  {
    name: "Kitchen / Culinary", emoji: "👨‍🍳",
    weights: {
      precision: 0.18, concentration: 0.15, safetyConsciousness: 0.12,
      adaptability: 0.10, ruleFollowing: 0.10, emotionalStability: 0.08,
      learningSpeed: 0.07, dependability: 0.07, autonomy: 0.05,
      collaboration: 0.05, conscientiousness: 0.03,
    },
    reasonTemplates: {
      precision: "Exacting standards in execution", concentration: "Laser focus during service",
      safetyConsciousness: "Food safety priority", adaptability: "Handles kitchen pressure",
      ruleFollowing: "Respects brigade hierarchy",
    },
  },
  {
    name: "Spa & Wellness", emoji: "🧖",
    weights: {
      empathy: 0.20, readingOthers: 0.15, selfRegulation: 0.12,
      emotionalStability: 0.10, conscientiousness: 0.10, attentionToDetail: 0.08,
      agreeableness: 0.07, openness: 0.07, collaboration: 0.05,
      integrity: 0.03, dependability: 0.03,
    },
    reasonTemplates: {
      empathy: "Natural healer energy", readingOthers: "Reads client comfort levels",
      selfRegulation: "Creates calm, safe space", emotionalStability: "Steady, reassuring presence",
      conscientiousness: "Consistent service quality",
    },
  },
];

export function calculateDepartmentMatches(scores: ComprehensiveScores): DepartmentFit[] {
  const results = DEPARTMENT_PROFILES.map((dept) => {
    let fitScore = 0;
    const contributions: { dim: string; contribution: number; score: number }[] = [];

    Object.entries(dept.weights).forEach(([dim, weight]) => {
      const score = (scores as any)[dim] || 0;
      const contribution = score * weight;
      fitScore += contribution;
      contributions.push({ dim, contribution, score });
    });

    fitScore = Math.min(100, Math.max(0, Math.round(fitScore)));

    let stars: number;
    if (fitScore >= 85) stars = 5;
    else if (fitScore >= 70) stars = 4;
    else if (fitScore >= 55) stars = 3;
    else if (fitScore >= 40) stars = 2;
    else stars = 1;

    contributions.sort((a, b) => b.contribution - a.contribution);
    const topReasons = contributions
      .slice(0, 3)
      .filter((c) => c.score >= 50)
      .map((c) => dept.reasonTemplates[c.dim] || c.dim)
      .filter(Boolean);

    return { department: dept.name, emoji: dept.emoji, fitScore, stars, rank: 0, topReasons };
  }).sort((a, b) => b.fitScore - a.fitScore);

  results.forEach((r, i) => { r.rank = i + 1; });
  return results;
}
