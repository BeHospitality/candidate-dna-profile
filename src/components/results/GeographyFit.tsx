import { motion } from "framer-motion";
import type { GeographyMatch } from "@/utils/geographyMatching";

interface GeographyFitProps {
  geographyMatches: GeographyMatch[];
}

const FIT_BADGE: Record<string, { label: string; className: string }> = {
  excellent: { label: "EXCELLENT", className: "bg-success/15 text-success border-success/30" },
  good: { label: "GOOD", className: "bg-primary/15 text-primary border-primary/30" },
  moderate: { label: "MODERATE", className: "bg-accent/15 text-accent border-accent/30" },
  challenging: { label: "CHALLENGING", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

const FIT_BAR: Record<string, string> = {
  excellent: "bg-success",
  good: "bg-primary",
  moderate: "bg-accent",
  challenging: "bg-destructive",
};

const GeographyFit = ({ geographyMatches }: GeographyFitProps) => (
  <div className="glass-card p-6 rounded-2xl">
    <h3 className="font-bold text-lg text-foreground mb-1 flex items-center gap-2">
      🌍 Geography Fit
    </h3>
    <p className="text-xs text-muted-foreground mb-4">Where in the world you'd thrive</p>
    <div className="space-y-4">
      {geographyMatches.map((g, i) => {
        const badge = FIT_BADGE[g.fit] || FIT_BADGE.moderate;
        return (
          <motion.div
            key={g.region}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span>{g.flag}</span>
                {g.region}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.className}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1.5 leading-relaxed">{g.reason}</p>
            <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${g.fitScore}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${FIT_BAR[g.fit] || "bg-muted-foreground"}`}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{g.fitScore}%</p>
          </motion.div>
        );
      })}
    </div>
  </div>
);

export default GeographyFit;
