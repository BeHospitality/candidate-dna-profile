import { motion } from "framer-motion";
import type { ComprehensiveScores } from "@/lib/scoring";

interface DNASnapshotProps {
  comprehensiveScores: ComprehensiveScores;
}

interface SnapshotCard {
  label: string;
  emoji: string;
  dimensions: { key: keyof ComprehensiveScores; label: string }[];
}

const CARDS: SnapshotCard[] = [
  {
    label: "Cognitive", emoji: "🧠",
    dimensions: [
      { key: "problemSolving", label: "Problem Solving" },
      { key: "attentionToDetail", label: "Attention to Detail" },
      { key: "learningSpeed", label: "Learning Speed" },
      { key: "patternRecognition", label: "Pattern Recognition" },
      { key: "concentration", label: "Concentration" },
    ],
  },
  {
    label: "EQ", emoji: "💡",
    dimensions: [
      { key: "readingOthers", label: "Reading Others" },
      { key: "empathy", label: "Empathy" },
      { key: "selfRegulation", label: "Self-Regulation" },
      { key: "socialAwareness", label: "Social Awareness" },
    ],
  },
  {
    label: "Work Style", emoji: "🎭",
    dimensions: [
      { key: "extraversion", label: "Extraversion" },
      { key: "conscientiousness", label: "Conscientiousness" },
      { key: "openness", label: "Openness" },
      { key: "agreeableness", label: "Agreeableness" },
      { key: "emotionalStability", label: "Stability" },
    ],
  },
  {
    label: "Values", emoji: "🛡️",
    dimensions: [
      { key: "integrity", label: "Integrity" },
      { key: "ruleFollowing", label: "Rule-Following" },
      { key: "safetyConsciousness", label: "Safety" },
      { key: "dependability", label: "Dependability" },
    ],
  },
];

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-accent";
  return "text-muted-foreground";
}

const DNASnapshot = ({ comprehensiveScores }: DNASnapshotProps) => {
  const visibleCards = CARDS.filter(card =>
    card.dimensions.some(d => comprehensiveScores[d.key] > 0)
  );

  if (visibleCards.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {visibleCards.map((card, i) => {
        const activeDims = card.dimensions.filter(d => comprehensiveScores[d.key] > 0);
        const avg = activeDims.length > 0
          ? Math.round(activeDims.reduce((sum, d) => sum + comprehensiveScores[d.key], 0) / activeDims.length)
          : 0;
        const topDim = activeDims.reduce((best, d) =>
          comprehensiveScores[d.key] > comprehensiveScores[best.key] ? d : best
        , activeDims[0]);

        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 rounded-xl border border-border/30"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{card.emoji}</span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</span>
            </div>
            <div className={`text-3xl font-extrabold ${getScoreColor(avg)} mb-1`}>{avg}</div>
            {topDim && (
              <p className="text-[11px] text-muted-foreground leading-tight">
                Top: <span className="text-foreground font-medium">{topDim.label}</span>
              </p>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default DNASnapshot;
