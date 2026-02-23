import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { SectorMatch } from "@/utils/sectorMatching";
import type { DepartmentFit } from "@/utils/departmentMatching";
import type { GeographyMatch } from "@/utils/geographyMatching";

interface CareerCompassSummaryProps {
  sectorMatches: SectorMatch[];
  departmentMatches: DepartmentFit[];
  geographyMatches: GeographyMatch[];
}

const CareerCompassSummary = ({ sectorMatches, departmentMatches, geographyMatches }: CareerCompassSummaryProps) => {
  const topSectors = sectorMatches.slice(0, 3);
  const topDept = departmentMatches[0];
  const topGeo = geographyMatches[0];

  if (topSectors.length === 0 && !topDept && !topGeo) return null;

  return (
    <div className="glass-card p-6 rounded-2xl">
      <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        🎯 Career Compass
      </h3>

      {/* Top Career Paths */}
      {topSectors.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">Top Career Paths</p>
          <div className="space-y-2">
            {topSectors.map((s, i) => (
              <motion.div
                key={s.sector}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Star className={`w-4 h-4 ${i === 0 ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
                  <span className="text-sm font-semibold text-foreground">{s.sector}</span>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {s.fitScore}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Department + Geography */}
      <div className="flex flex-col gap-2">
        {topDept && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Best Department</span>
            <span className="font-semibold text-foreground">{topDept.emoji} {topDept.department}</span>
          </div>
        )}
        {topGeo && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Geography Match</span>
            <span className="font-semibold text-foreground">{topGeo.flag} {topGeo.region}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerCompassSummary;
