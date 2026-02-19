/**
 * Geography Matching Algorithm
 * Evaluates how well a candidate's profile fits different global regions.
 */

import type { ComprehensiveScores } from "@/lib/scoring";

export interface GeographyMatch {
  region: string;
  flag: string;
  fit: "excellent" | "good" | "moderate" | "challenging";
  fitScore: number;
  reason: string;
}

interface RegionProfile {
  name: string;
  flag: string;
  weights: Record<string, { ideal: number; importance: number }>;
}

const REGION_PROFILES: RegionProfile[] = [
  {
    name: "Ireland & UK", flag: "🇮🇪",
    weights: {
      collaboration: { ideal: 75, importance: 0.20 }, emotionalStability: { ideal: 70, importance: 0.15 },
      agreeableness: { ideal: 70, importance: 0.15 }, dependability: { ideal: 75, importance: 0.15 },
      conscientiousness: { ideal: 70, importance: 0.10 }, empathy: { ideal: 65, importance: 0.10 },
      openness: { ideal: 60, importance: 0.08 }, adaptability: { ideal: 60, importance: 0.07 },
    },
  },
  {
    name: "USA East Coast", flag: "🇺🇸",
    weights: {
      adaptability: { ideal: 85, importance: 0.20 }, emotionalStability: { ideal: 80, importance: 0.15 },
      concentration: { ideal: 80, importance: 0.15 }, extraversion: { ideal: 75, importance: 0.12 },
      problemSolving: { ideal: 80, importance: 0.10 }, leadership: { ideal: 70, importance: 0.10 },
      dependability: { ideal: 75, importance: 0.10 }, conscientiousness: { ideal: 70, importance: 0.08 },
    },
  },
  {
    name: "USA West Coast", flag: "🌴",
    weights: {
      openness: { ideal: 85, importance: 0.20 }, autonomy: { ideal: 80, importance: 0.18 },
      adaptability: { ideal: 75, importance: 0.15 }, extraversion: { ideal: 70, importance: 0.12 },
      collaboration: { ideal: 65, importance: 0.10 }, emotionalStability: { ideal: 70, importance: 0.10 },
      problemSolving: { ideal: 75, importance: 0.08 }, learningSpeed: { ideal: 75, importance: 0.07 },
    },
  },
  {
    name: "UAE & Gulf States", flag: "🇦🇪",
    weights: {
      precision: { ideal: 90, importance: 0.18 }, selfRegulation: { ideal: 85, importance: 0.15 },
      socialAwareness: { ideal: 85, importance: 0.15 }, ruleFollowing: { ideal: 80, importance: 0.12 },
      conscientiousness: { ideal: 85, importance: 0.10 }, integrity: { ideal: 85, importance: 0.10 },
      readingOthers: { ideal: 80, importance: 0.08 }, adaptability: { ideal: 75, importance: 0.07 },
      emotionalStability: { ideal: 80, importance: 0.05 },
    },
  },
  {
    name: "Asia-Pacific", flag: "🌏",
    weights: {
      socialAwareness: { ideal: 90, importance: 0.20 }, ruleFollowing: { ideal: 85, importance: 0.15 },
      collaboration: { ideal: 80, importance: 0.15 }, selfRegulation: { ideal: 80, importance: 0.12 },
      precision: { ideal: 80, importance: 0.10 }, agreeableness: { ideal: 75, importance: 0.10 },
      conscientiousness: { ideal: 80, importance: 0.08 }, readingOthers: { ideal: 75, importance: 0.05 },
      adaptability: { ideal: 70, importance: 0.05 },
    },
  },
];

function formatDimName(key: string): string {
  const names: Record<string, string> = {
    autonomy: "independence", collaboration: "teamwork", precision: "attention to detail",
    leadership: "leadership", adaptability: "adaptability", problemSolving: "problem solving",
    attentionToDetail: "detail orientation", learningSpeed: "learning agility",
    patternRecognition: "pattern recognition", concentration: "focus",
    extraversion: "social energy", conscientiousness: "organisation",
    openness: "openness to experience", agreeableness: "cooperation",
    emotionalStability: "emotional resilience", readingOthers: "reading people",
    empathy: "empathy", selfRegulation: "emotional control",
    socialAwareness: "cultural awareness", integrity: "integrity",
    ruleFollowing: "rule adherence", safetyConsciousness: "safety awareness",
    dependability: "reliability",
  };
  return names[key] || key;
}

export function calculateGeographyMatches(scores: ComprehensiveScores): GeographyMatch[] {
  return REGION_PROFILES.map((region) => {
    let fitScore = 0;

    Object.entries(region.weights).forEach(([dim, { ideal, importance }]) => {
      const candidateScore = (scores as any)[dim] || 0;
      const proximity = 100 - Math.abs(candidateScore - ideal);
      fitScore += proximity * importance;
    });

    fitScore = Math.min(100, Math.max(0, Math.round(fitScore)));

    let fit: GeographyMatch["fit"];
    if (fitScore >= 75) fit = "excellent";
    else if (fitScore >= 60) fit = "good";
    else if (fitScore >= 45) fit = "moderate";
    else fit = "challenging";

    const dimAnalysis = Object.entries(region.weights)
      .map(([dim, { ideal }]) => ({
        dim,
        gap: Math.abs(((scores as any)[dim] || 0) - ideal),
      }))
      .sort((a, b) => a.gap - b.gap);

    const bestFit = dimAnalysis[0];
    let reason: string;

    if (fit === "excellent") {
      reason = `Your profile aligns strongly with ${region.name}'s work culture — particularly your ${formatDimName(bestFit.dim)} score.`;
    } else if (fit === "good") {
      reason = `Good cultural fit for ${region.name}. Your strengths align well, with some areas to adapt.`;
    } else if (fit === "moderate") {
      const weakest = dimAnalysis[dimAnalysis.length - 1];
      reason = `Workable fit, but ${region.name}'s emphasis on ${formatDimName(weakest.dim)} may require adjustment.`;
    } else {
      const weakest = dimAnalysis[dimAnalysis.length - 1];
      reason = `${region.name}'s work culture may be challenging — particularly the expectation around ${formatDimName(weakest.dim)}.`;
    }

    return { region: region.name, flag: region.flag, fit, fitScore, reason };
  }).sort((a, b) => b.fitScore - a.fitScore);
}
