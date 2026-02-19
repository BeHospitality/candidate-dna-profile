import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ComprehensiveScores } from "@/lib/scoring";
import { useIsMobile } from "@/hooks/use-mobile";

interface DimensionBreakdownProps {
  comprehensiveScores: ComprehensiveScores;
}

interface LayerConfig {
  label: string;
  emoji: string;
  dimensions: { key: keyof ComprehensiveScores; label: string }[];
}

const LAYERS: LayerConfig[] = [
  {
    label: "Cognitive Strengths", emoji: "🧠",
    dimensions: [
      { key: "problemSolving", label: "Problem Solving" },
      { key: "attentionToDetail", label: "Attention to Detail" },
      { key: "learningSpeed", label: "Learning Speed" },
      { key: "patternRecognition", label: "Pattern Recognition" },
      { key: "concentration", label: "Concentration" },
    ],
  },
  {
    label: "Personality (Big 5)", emoji: "🎭",
    dimensions: [
      { key: "extraversion", label: "Extraversion" },
      { key: "conscientiousness", label: "Conscientiousness" },
      { key: "openness", label: "Openness" },
      { key: "agreeableness", label: "Agreeableness" },
      { key: "emotionalStability", label: "Emotional Stability" },
    ],
  },
  {
    label: "Emotional Intelligence", emoji: "💡",
    dimensions: [
      { key: "readingOthers", label: "Reading Others" },
      { key: "empathy", label: "Empathy" },
      { key: "selfRegulation", label: "Self-Regulation" },
      { key: "socialAwareness", label: "Social Awareness" },
    ],
  },
  {
    label: "Reliability & Standards", emoji: "🛡️",
    dimensions: [
      { key: "integrity", label: "Integrity" },
      { key: "ruleFollowing", label: "Rule-Following" },
      { key: "safetyConsciousness", label: "Safety Consciousness" },
      { key: "dependability", label: "Dependability" },
    ],
  },
];

function getBarColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-primary";
  if (score >= 40) return "bg-accent";
  return "bg-muted-foreground/40";
}

function getBarGlow(score: number): string {
  if (score >= 80) return "shadow-[0_0_8px_hsl(160_84%_39%/0.4)]";
  if (score >= 60) return "shadow-[0_0_8px_hsl(38_92%_50%/0.3)]";
  return "";
}

const DimensionBar = ({ label, score }: { label: string; score: number }) => (
  <div className="flex items-center gap-3">
    <span className="text-xs text-muted-foreground w-[130px] shrink-0 truncate">{label}</span>
    <div className="flex-1 h-2.5 rounded-full bg-muted/50 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full ${getBarColor(score)} ${getBarGlow(score)}`}
      />
    </div>
    <span className="text-xs font-semibold text-foreground w-8 text-right">{score}</span>
  </div>
);

const LayerGroup = ({ layer, scores, defaultOpen }: { layer: LayerConfig; scores: ComprehensiveScores; defaultOpen: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border/30 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 px-1 text-left hover:bg-muted/20 transition-colors rounded-lg"
      >
        <span className="font-semibold text-sm text-foreground flex items-center gap-2">
          <span>{layer.emoji}</span>
          {layer.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pb-4 px-1">
              {layer.dimensions.map((d) => (
                <DimensionBar key={d.key} label={d.label} score={scores[d.key]} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DimensionBreakdown = ({ comprehensiveScores }: DimensionBreakdownProps) => {
  const isMobile = useIsMobile();

  const visibleLayers = LAYERS.filter((layer) =>
    layer.dimensions.some((d) => comprehensiveScores[d.key] > 0)
  );

  if (visibleLayers.length === 0) return null;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="font-bold text-lg text-foreground mb-1 flex items-center gap-2">
        🧬 Your DNA Profile
      </h3>
      <p className="text-xs text-muted-foreground mb-4">
        {visibleLayers.reduce((n, l) => n + l.dimensions.filter(d => comprehensiveScores[d.key] > 0).length, 0)} dimensions across {visibleLayers.length} layers
      </p>
      <div>
        {visibleLayers.map((layer) => (
          <LayerGroup
            key={layer.label}
            layer={layer}
            scores={comprehensiveScores}
            defaultOpen={!isMobile}
          />
        ))}
      </div>
    </div>
  );
};

export default DimensionBreakdown;
