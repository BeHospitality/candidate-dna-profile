import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import type { DepartmentFit } from "@/utils/departmentMatching";

interface DepartmentRankingProps {
  departmentMatches: DepartmentFit[];
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

const DepartmentRanking = ({ departmentMatches }: DepartmentRankingProps) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? departmentMatches : departmentMatches.slice(0, 5);

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="font-bold text-lg text-foreground mb-1 flex items-center gap-2">
        🏨 Department Alignment
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Your top departments ranked</p>
      <div className="space-y-3">
        {visible.map((d, i) => (
          <motion.div
            key={d.department}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-start gap-3 p-3 rounded-xl border ${
              i < 2 ? "border-primary/30 bg-primary/5" : "border-border/30"
            }`}
          >
            <span className="text-xs font-bold text-muted-foreground bg-muted/50 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
              {d.rank}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <span>{d.emoji}</span>
                  <span className="truncate">{d.department}</span>
                </span>
                <Stars count={d.stars} />
              </div>
              <p className="text-xs text-primary font-medium">
                {d.fitScore}%
                {d.topReasons.length > 0 && (
                  <span className="text-muted-foreground font-normal"> — {d.topReasons.join(", ")}</span>
                )}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      {departmentMatches.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 w-full text-center text-xs text-primary font-medium flex items-center justify-center gap-1 hover:underline"
        >
          {showAll ? "Show top 5" : `Show all ${departmentMatches.length} departments`}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
};

export default DepartmentRanking;
