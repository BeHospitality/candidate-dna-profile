import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import type { SectorMatch } from "@/utils/sectorMatching";

interface SectorMatchesProps {
  sectorMatches: SectorMatch[];
}

function starBg(stars: number): string {
  if (stars >= 5) return "border-success/30 bg-success/5";
  if (stars >= 4) return "border-primary/30 bg-primary/5";
  if (stars >= 3) return "border-border";
  return "border-border/50 bg-muted/20";
}

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < count ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const SectorCard = ({ match, rank }: { match: SectorMatch; rank: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: rank * 0.08 }}
    className={`border rounded-xl p-4 ${starBg(match.stars)}`}
  >
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-muted-foreground bg-muted/50 rounded-full w-5 h-5 flex items-center justify-center">
          {rank + 1}
        </span>
        <span className="font-semibold text-sm text-foreground">{match.sector}</span>
      </div>
      <Stars count={match.stars} />
    </div>
    <p className="text-xs text-primary font-medium mb-2">{match.fitScore}% match</p>
    {match.topStrengths.length > 0 && (
      <div className="space-y-1">
        {match.topStrengths.map((s) => (
          <p key={s} className="text-xs text-muted-foreground flex items-start gap-1.5">
            <span className="text-success mt-0.5">✓</span>
            {s}
          </p>
        ))}
      </div>
    )}
    {match.growthAreas.length > 0 && (
      <div className="space-y-1 mt-1">
        {match.growthAreas.map((g) => (
          <p key={g} className="text-xs text-muted-foreground flex items-start gap-1.5">
            <span className="text-accent mt-0.5">△</span>
            {g}
          </p>
        ))}
      </div>
    )}
  </motion.div>
);

const SectorMatches = ({ sectorMatches }: SectorMatchesProps) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? sectorMatches : sectorMatches.slice(0, 3);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="font-bold text-lg text-foreground mb-1 flex items-center gap-2">
        🏢 Sector Matches
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Where your DNA fits best</p>
      <div className="space-y-3">
        {visible.map((m, i) => (
          <SectorCard key={m.sector} match={m} rank={i} />
        ))}
      </div>
      {sectorMatches.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 w-full text-center text-xs text-primary font-medium flex items-center justify-center gap-1 hover:underline"
        >
          {showAll ? "Show top 3" : `Show all ${sectorMatches.length} sectors`}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
};

export default SectorMatches;
