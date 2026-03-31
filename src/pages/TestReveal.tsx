import { useState } from "react";
import { motion } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from "recharts";
import { archetypeData } from "@/lib/archetypes";
import type { Archetype } from "@/lib/scoring";
import DNASnapshot from "@/components/results/DNASnapshot";
import SignatureCard from "@/components/results/SignatureCard";
import SectorMatches from "@/components/results/SectorMatches";
import DepartmentRanking from "@/components/results/DepartmentRanking";
import BrandHeader from "@/components/BrandHeader";
import type { ComprehensiveScores } from "@/lib/scoring";
import type { SectorMatch } from "@/utils/sectorMatching";
import type { DepartmentFit } from "@/utils/departmentMatching";

const WHALE_SCORES: ComprehensiveScores = {
  autonomy: 45, collaboration: 92, precision: 55, leadership: 60, adaptability: 78,
  problemSolving: 65, attentionToDetail: 50, learningSpeed: 70, patternRecognition: 60, concentration: 55,
  extraversion: 85, conscientiousness: 70, openness: 75, agreeableness: 90, emotionalStability: 80,
  readingOthers: 88, empathy: 92, selfRegulation: 75, socialAwareness: 85,
  integrity: 80, ruleFollowing: 65, safetyConsciousness: 70, dependability: 85,
};

const FALCON_SCORES: ComprehensiveScores = {
  autonomy: 60, collaboration: 50, precision: 94, leadership: 55, adaptability: 48,
  problemSolving: 88, attentionToDetail: 95, learningSpeed: 72, patternRecognition: 85, concentration: 90,
  extraversion: 40, conscientiousness: 92, openness: 55, agreeableness: 60, emotionalStability: 78,
  readingOthers: 62, empathy: 55, selfRegulation: 85, socialAwareness: 58,
  integrity: 90, ruleFollowing: 88, safetyConsciousness: 92, dependability: 94,
};

const WHALE_SECTORS: SectorMatch[] = [
  { sector: "Luxury Hotels & Resorts", description: "Premium hospitality", fitScore: 94, stars: 5, topStrengths: ["Exceptional team collaboration", "Guest empathy"], growthAreas: [] },
  { sector: "Event Management", description: "Live experiences", fitScore: 88, stars: 4, topStrengths: ["People-first coordination", "Adaptive planning"], growthAreas: [] },
  { sector: "Corporate Hospitality", description: "Business services", fitScore: 82, stars: 4, topStrengths: ["Relationship building", "Emotional intelligence"], growthAreas: ["Technical precision"] },
];

const FALCON_SECTORS: SectorMatch[] = [
  { sector: "Fine Dining", description: "Culinary excellence", fitScore: 96, stars: 5, topStrengths: ["Meticulous attention to detail", "Quality consistency"], growthAreas: [] },
  { sector: "Revenue Management", description: "Financial optimization", fitScore: 91, stars: 5, topStrengths: ["Data-driven precision", "Pattern recognition"], growthAreas: [] },
  { sector: "Corporate Hospitality", description: "Business services", fitScore: 85, stars: 4, topStrengths: ["Process optimization", "Reliability"], growthAreas: ["Flexibility under ambiguity"] },
];

const WHALE_DEPTS: DepartmentFit[] = [
  { department: "Guest Relations", emoji: "🤝", fitScore: 95, stars: 5, rank: 1, topReasons: ["Empathy-driven service", "Conflict resolution"] },
  { department: "People & Culture", emoji: "👥", fitScore: 90, stars: 5, rank: 2, topReasons: ["Team development", "Inclusive leadership"] },
  { department: "Food & Beverage", emoji: "🍽️", fitScore: 84, stars: 4, rank: 3, topReasons: ["Collaborative service delivery"] },
];

const FALCON_DEPTS: DepartmentFit[] = [
  { department: "Finance & Revenue", emoji: "📊", fitScore: 96, stars: 5, rank: 1, topReasons: ["Analytical precision", "Data mastery"] },
  { department: "Quality Assurance", emoji: "✅", fitScore: 93, stars: 5, rank: 2, topReasons: ["Standards enforcement", "Process improvement"] },
  { department: "Events & Catering", emoji: "🎪", fitScore: 86, stars: 4, rank: 3, topReasons: ["Logistical precision", "Detail management"] },
];

const WHALE_SIGNATURE = {
  id: "empathic_conductor",
  name: "The Empathic Conductor",
  tagline: "You orchestrate harmony through human connection",
  description: "Your natural empathy and collaborative instinct make you the person teams gravitate toward. You read rooms, bridge gaps, and create environments where everyone can do their best work.",
  teams_need_you: "you sense what others miss and bring people together before friction becomes conflict.",
  high_dims: ["collaboration", "empathy", "socialAwareness"],
  low_dims: [],
};

const FALCON_SIGNATURE = {
  name: "The Master Craftsperson",
  tagline: "You set the standard others aspire to",
  description: "Your relentless attention to detail and systematic thinking produce work of exceptional quality. You build processes that last and standards that elevate entire teams.",
  teams_need_you: "you catch what others overlook and build systems that prevent problems before they start.",
  primary: "falcon" as Archetype,
  secondary: "lion" as Archetype,
  high_dims: ["precision", "attentionToDetail", "conscientiousness"],
  low_dims: [],
};

function RevealColumn({ type }: { type: "whale" | "falcon" }) {
  const archetype = archetypeData[type];
  const scores = type === "whale" ? WHALE_SCORES : FALCON_SCORES;
  const sectors = type === "whale" ? WHALE_SECTORS : FALCON_SECTORS;
  const depts = type === "whale" ? WHALE_DEPTS : FALCON_DEPTS;
  const signature = type === "whale" ? WHALE_SIGNATURE : FALCON_SIGNATURE;

  const radarData = [
    { dimension: "Autonomy", score: scores.autonomy },
    { dimension: "Collaboration", score: scores.collaboration },
    { dimension: "Precision", score: scores.precision },
    { dimension: "Leadership", score: scores.leadership },
    { dimension: "Adaptability", score: scores.adaptability },
  ];

  const color = type === "whale" ? "hsl(200 80% 50%)" : "hsl(160 84% 39%)";

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Master Card */}
      <div
        className="relative rounded-2xl overflow-hidden border-2 border-primary/50 gold-glow p-8 text-center"
        style={{ background: "linear-gradient(160deg, hsl(213 80% 14%), hsl(213 100% 10%))" }}
      >
        <div className="card-shine absolute inset-0 rounded-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="text-7xl mb-4">{archetype.emoji}</div>
          <p className="text-sm font-medium text-primary tracking-widest uppercase mb-2">You are a</p>
          <h1 className="text-4xl font-extrabold text-foreground mb-2">{archetype.name}</h1>
          <p className="text-lg font-semibold mb-6" style={{ color }}>{archetype.tagline}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {archetype.traits.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Radar */}
      <div className="glass-card p-4 rounded-2xl">
        <h3 className="text-center font-semibold text-foreground mb-2">Dimension Scores</h3>
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
            <PolarGrid stroke="hsl(213 40% 28%)" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: "hsl(220 20% 65%)", fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Score" dataKey="score" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* DNA Snapshot */}
      <DNASnapshot comprehensiveScores={scores} />

      {/* Signature */}
      <SignatureCard combination={signature} />

      {/* Strengths */}
      <div className="glass-card p-6 rounded-2xl space-y-4">
        <h3 className="font-bold text-lg text-foreground">{archetype.emoji} About {archetype.name}</h3>
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">💪 Strengths</h4>
          <ul className="space-y-1">
            {archetype.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">🏢 Work Style</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{archetype.workStyle}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">🌟 Thrives When</h4>
          <ul className="space-y-1">
            {archetype.thrivesWhen.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-success mt-0.5">✓</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">⚡ Trade-offs</h4>
          <ul className="space-y-1">
            {archetype.challenges.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5">↔</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">🎯 Career Paths</h4>
          <div className="flex flex-wrap gap-2">
            {archetype.careerPaths.map((p) => (
              <span key={p} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Sectors */}
      <SectorMatches sectorMatches={sectors} />

      {/* Departments */}
      <DepartmentRanking departmentMatches={depts} />
    </div>
  );
}

const TestReveal = () => {
  const [view, setView] = useState<"both" | "whale" | "falcon">("both");

  return (
    <div className="min-h-screen bg-navy-radial flex flex-col">
      <BrandHeader />
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">⚠️ TEST PAGE — REMOVE BEFORE LAUNCH</p>
          <h1 className="text-2xl font-bold text-foreground mb-4">Archetype Reveal Preview</h1>
          <div className="flex justify-center gap-2">
            {(["both", "whale", "falcon"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  view === v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {v === "both" ? "Side by Side" : v === "whale" ? "🐋 Whale" : "🦅 Falcon"}
              </button>
            ))}
          </div>
        </div>

        {view === "both" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div>
              <h2 className="text-center text-lg font-bold text-foreground mb-4">🐋 Whale — The Collaborative Anchor</h2>
              <RevealColumn type="whale" />
            </div>
            <div>
              <h2 className="text-center text-lg font-bold text-foreground mb-4">🦅 Falcon — The Precision Specialist</h2>
              <RevealColumn type="falcon" />
            </div>
          </div>
        ) : (
          <RevealColumn type={view} />
        )}
      </div>
    </div>
  );
};

export default TestReveal;
