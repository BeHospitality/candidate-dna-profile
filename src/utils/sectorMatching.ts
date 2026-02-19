/**
 * Sector Matching Algorithm
 * Matches a candidate's comprehensive scores against 6 hospitality sector profiles.
 */

import type { ComprehensiveScores } from "@/lib/scoring";

export interface SectorMatch {
  sector: string;
  description: string;
  fitScore: number;
  stars: number;
  topStrengths: string[];
  growthAreas: string[];
}

interface SectorProfile {
  name: string;
  description: string;
  weights: Record<string, number>;
  strengthLabels: Record<string, string>;
  growthLabels: Record<string, string>;
}

const SECTOR_PROFILES: SectorProfile[] = [
  {
    name: "Luxury Hotels & Resorts",
    description: "5-star properties where detail and guest experience are paramount",
    weights: {
      precision: 0.15, attentionToDetail: 0.15, empathy: 0.12, readingOthers: 0.10,
      conscientiousness: 0.10, emotionalStability: 0.08, selfRegulation: 0.08,
      socialAwareness: 0.07, collaboration: 0.05, integrity: 0.05, dependability: 0.05,
    },
    strengthLabels: {
      precision: "Exceptional eye for detail", attentionToDetail: "Meticulous standards",
      empathy: "Intuitive guest care", readingOthers: "Reads guest needs before they ask",
      conscientiousness: "Consistent high standards", selfRegulation: "Grace under pressure",
      socialAwareness: "Cultural sensitivity",
    },
    growthLabels: {
      precision: "Detail orientation needs development", attentionToDetail: "May miss finer details",
      empathy: "Guest empathy could deepen", selfRegulation: "Emotional control under pressure",
    },
  },
  {
    name: "Quick-Service Restaurants (QSR)",
    description: "Fast-paced, high-volume environments where speed and consistency matter",
    weights: {
      adaptability: 0.18, concentration: 0.15, emotionalStability: 0.12, dependability: 0.12,
      learningSpeed: 0.10, collaboration: 0.08, ruleFollowing: 0.08, safetyConsciousness: 0.07,
      conscientiousness: 0.05, extraversion: 0.05,
    },
    strengthLabels: {
      adaptability: "Thrives in fast-changing environments", concentration: "Stays focused during rush",
      emotionalStability: "Handles pressure well", dependability: "Reliable under volume",
      learningSpeed: "Picks up systems quickly", ruleFollowing: "Follows procedures consistently",
    },
    growthLabels: {
      adaptability: "May struggle with rapid pace changes", concentration: "Focus under pressure needs work",
      emotionalStability: "Stress management could improve",
    },
  },
  {
    name: "Private Members' Clubs",
    description: "Exclusive environments where relationship-building and discretion are key",
    weights: {
      empathy: 0.15, socialAwareness: 0.15, readingOthers: 0.12, selfRegulation: 0.10,
      integrity: 0.10, collaboration: 0.08, conscientiousness: 0.08, emotionalStability: 0.07,
      precision: 0.05, dependability: 0.05, extraversion: 0.05,
    },
    strengthLabels: {
      empathy: "Deep understanding of member needs", socialAwareness: "Navigates social dynamics expertly",
      readingOthers: "Anticipates preferences", selfRegulation: "Unflappable discretion",
      integrity: "Trusted with sensitive information",
    },
    growthLabels: {
      socialAwareness: "Social navigation skills need development",
      empathy: "Member relationship depth could grow", integrity: "Trust-building may take time",
    },
  },
  {
    name: "Cruise Lines",
    description: "Unique environment with confined living, diverse guests, and extended rotations",
    weights: {
      adaptability: 0.18, collaboration: 0.15, emotionalStability: 0.12, extraversion: 0.10,
      openness: 0.10, selfRegulation: 0.08, dependability: 0.07, socialAwareness: 0.07,
      agreeableness: 0.05, safetyConsciousness: 0.05, concentration: 0.03,
    },
    strengthLabels: {
      adaptability: "Thrives in dynamic, changing environments",
      collaboration: "Excellent team player in close quarters",
      emotionalStability: "Handles isolation and long rotations",
      extraversion: "Energised by diverse guest interactions",
      openness: "Embraces multicultural environments",
    },
    growthLabels: {
      adaptability: "Extended rotations may be challenging",
      emotionalStability: "Confined living requires resilience",
      collaboration: "Close-quarters teamwork needs development",
    },
  },
  {
    name: "Airlines & Aviation",
    description: "Safety-critical, protocol-driven environment with global exposure",
    weights: {
      safetyConsciousness: 0.18, ruleFollowing: 0.15, precision: 0.12, selfRegulation: 0.10,
      emotionalStability: 0.10, attentionToDetail: 0.08, dependability: 0.07,
      socialAwareness: 0.07, adaptability: 0.05, extraversion: 0.05, integrity: 0.03,
    },
    strengthLabels: {
      safetyConsciousness: "Safety-first mindset", ruleFollowing: "Excellent protocol adherence",
      precision: "Detail-oriented execution", selfRegulation: "Calm in high-stakes situations",
      emotionalStability: "Composed under pressure",
    },
    growthLabels: {
      safetyConsciousness: "Safety awareness needs strengthening",
      ruleFollowing: "Protocol adherence could improve", precision: "Attention to safety details",
    },
  },
  {
    name: "Events & Conferences",
    description: "Project-based, deadline-driven with high collaboration and creativity",
    weights: {
      collaboration: 0.15, adaptability: 0.15, problemSolving: 0.12, openness: 0.10,
      extraversion: 0.10, concentration: 0.08, leadership: 0.07, conscientiousness: 0.07,
      attentionToDetail: 0.06, emotionalStability: 0.05, dependability: 0.05,
    },
    strengthLabels: {
      collaboration: "Excellent team coordinator", adaptability: "Handles last-minute changes gracefully",
      problemSolving: "Creative problem solver", openness: "Innovative approach to events",
      extraversion: "Natural networker and host",
    },
    growthLabels: {
      collaboration: "Team coordination skills need development",
      adaptability: "May struggle with constant change", problemSolving: "Creative problem-solving could grow",
    },
  },
];

export function calculateSectorMatches(scores: ComprehensiveScores): SectorMatch[] {
  return SECTOR_PROFILES.map((sector) => {
    let fitScore = 0;
    const contributions: { dim: string; contribution: number }[] = [];

    Object.entries(sector.weights).forEach(([dim, weight]) => {
      const score = (scores as any)[dim] || 0;
      const contribution = score * weight;
      fitScore += contribution;
      contributions.push({ dim, contribution });
    });

    fitScore = Math.min(100, Math.max(0, Math.round(fitScore)));

    let stars: number;
    if (fitScore >= 85) stars = 5;
    else if (fitScore >= 70) stars = 4;
    else if (fitScore >= 55) stars = 3;
    else if (fitScore >= 40) stars = 2;
    else stars = 1;

    contributions.sort((a, b) => b.contribution - a.contribution);
    const topStrengths = contributions
      .slice(0, 3)
      .filter((c) => (scores as any)[c.dim] >= 60)
      .map((c) => sector.strengthLabels[c.dim] || c.dim)
      .filter(Boolean);

    const growthAreas = contributions
      .filter((c) => (scores as any)[c.dim] < 50 && sector.weights[c.dim] >= 0.08)
      .slice(0, 2)
      .map((c) => sector.growthLabels[c.dim] || c.dim)
      .filter(Boolean);

    return { sector: sector.name, description: sector.description, fitScore, stars, topStrengths, growthAreas };
  }).sort((a, b) => b.fitScore - a.fitScore);
}
