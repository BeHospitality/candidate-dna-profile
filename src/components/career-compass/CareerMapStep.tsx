import { useRef } from "react";
import { motion } from "framer-motion";
import { Star, ArrowRight, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNarrativeForScore } from "@/data/dimensionNarratives";
import { exportDNACard } from "@/utils/dnaCardExport";
import DNACard from "@/components/results/DNACard";
import type { SectorMatch } from "@/utils/sectorMatching";
import type { DepartmentFit } from "@/utils/departmentMatching";
import type { ComprehensiveScores } from "@/lib/scoring";

const DIMENSION_LABELS: Record<string, string> = {
  autonomy: "Autonomy", collaboration: "Collaboration", precision: "Precision",
  leadership: "Leadership", adaptability: "Adaptability", problemSolving: "Problem Solving",
  attentionToDetail: "Attention to Detail", learningSpeed: "Learning Speed",
  patternRecognition: "Pattern Recognition", concentration: "Concentration",
  extraversion: "Extraversion", conscientiousness: "Conscientiousness",
  openness: "Openness", agreeableness: "Agreeableness", emotionalStability: "Emotional Stability",
  readingOthers: "Reading Others", empathy: "Empathy", selfRegulation: "Self-Regulation",
  socialAwareness: "Social Awareness", integrity: "Integrity", ruleFollowing: "Rule Following",
  safetyConsciousness: "Safety", dependability: "Dependability",
};

const EQ_DIMS = ["readingOthers", "empathy", "selfRegulation", "socialAwareness"] as const;

interface CareerMapStepProps {
  archetypeName: string;
  archetypeEmoji: string;
  archetypeTagline: string;
  signatureName: string;
  userName?: string;
  sectorMatches: SectorMatch[];
  departmentMatches: DepartmentFit[];
  comprehensiveScores: ComprehensiveScores;
  bestSector: string;
  bestGeography: string;
  bestDepartment: string;
  onComplete: () => void;
  onBackToResults: () => void;
}

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < count ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
    ))}
  </div>
);

const CareerMapStep = ({
  archetypeName,
  archetypeEmoji,
  archetypeTagline,
  signatureName,
  userName,
  sectorMatches,
  departmentMatches,
  comprehensiveScores,
  bestSector,
  bestGeography,
  bestDepartment,
  onComplete,
  onBackToResults,
}: CareerMapStepProps) => {
  const linkedinCardRef = useRef<HTMLDivElement>(null);
  const instagramCardRef = useRef<HTMLDivElement>(null);

  const topSectors = sectorMatches.slice(0, 3);
  const topDepts = departmentMatches.slice(0, 3);

  // EQ Superpower: highest Layer 4 dimension
  const eqScores = EQ_DIMS.map((d) => ({
    key: d,
    score: comprehensiveScores[d] ?? 0,
  })).sort((a, b) => b.score - a.score);
  const eqTop = eqScores[0];
  const eqNarrative = getNarrativeForScore(eqTop.key, eqTop.score);

  // Top 5 dimensions for DNA card
  const topDimensions = Object.entries(comprehensiveScores as unknown as Record<string, number>)
    .filter(([key]) => DIMENSION_LABELS[key])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([key, score]) => {
      const narrative = getNarrativeForScore(key, score);
      return { label: narrative?.label || DIMENSION_LABELS[key] || key, score };
    });

  const handleDownloadCard = (format: "linkedin" | "instagram") => {
    const ref = format === "linkedin" ? linkedinCardRef : instagramCardRef;
    if (ref.current) {
      exportDNACard(ref.current, format, `be-connect-dna-${format}.png`);
    }
  };

  return (
    <motion.div
      key="career-map"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h2 className="text-2xl font-bold text-foreground mb-1">Your Career Map</h2>
      <p className="text-sm text-muted-foreground mb-8">
        {archetypeEmoji} {archetypeName} profiles thrive here.
      </p>

      {/* SECTION A — Top Career Paths */}
      <div className="glass-card p-5 rounded-2xl mb-6">
        <h3 className="font-bold text-base text-foreground mb-4">🏢 Your Top Career Paths</h3>
        <div className="space-y-3">
          {topSectors.map((s, i) => (
            <motion.div
              key={s.sector}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-semibold text-sm text-foreground">{s.sector}</span>
                <Stars count={s.stars} />
              </div>
              <p className="text-xs text-primary font-medium mb-1">{s.fitScore}% match</p>
              {s.topStrengths[0] && (
                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-success mt-0.5">✓</span>
                  {s.topStrengths[0]}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION B — Best Departments */}
      <div className="glass-card p-5 rounded-2xl mb-6">
        <h3 className="font-bold text-base text-foreground mb-4">🏛️ Departments Built for You</h3>
        <div className="space-y-3">
          {topDepts.map((d, i) => (
            <motion.div
              key={d.department}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-xl p-4"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="font-semibold text-sm text-foreground">
                  {d.emoji} {d.department}
                </span>
                <Stars count={d.stars} />
              </div>
              {d.topReasons[0] && (
                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-success mt-0.5">✓</span>
                  {d.topReasons[0]}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* SECTION C — EQ Superpower */}
      <div className="glass-card p-5 rounded-2xl mb-6 border border-primary/30 bg-primary/5">
        <h3 className="font-bold text-base text-foreground mb-3">⚡ Your EQ Superpower</h3>
        {eqNarrative && (
          <div>
            <p className="text-lg font-bold text-primary mb-1">{eqNarrative.label}</p>
            <p className="text-sm text-foreground italic">{eqNarrative.headline}</p>
          </div>
        )}
      </div>

      {/* SECTION D — DNA Card */}
      <div className="glass-card p-5 rounded-2xl mb-6">
        <h3 className="font-bold text-base text-foreground mb-1">🧬 Your DNA Card is Ready</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Download and share your professional profile.
        </p>

        {/* Hidden off-screen cards for export */}
        <div className="absolute -left-[9999px] pointer-events-none">
          <DNACard
            ref={linkedinCardRef}
            format="linkedin"
            archetypeEmoji={archetypeEmoji}
            archetypeName={archetypeName}
            archetypeTagline={archetypeTagline}
            signatureName={signatureName}
            userName={userName}
            topDimensions={topDimensions}
            bestSector={bestSector}
            bestGeography={bestGeography}
            topDepartment={bestDepartment}
          />
          <DNACard
            ref={instagramCardRef}
            format="instagram"
            archetypeEmoji={archetypeEmoji}
            archetypeName={archetypeName}
            archetypeTagline={archetypeTagline}
            signatureName={signatureName}
            userName={userName}
            topDimensions={topDimensions}
            bestSector={bestSector}
            bestGeography={bestGeography}
            topDepartment={bestDepartment}
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl text-xs"
            onClick={() => handleDownloadCard("linkedin")}
          >
            <Download className="w-4 h-4 mr-1" />
            LinkedIn (1200×630)
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-xl text-xs"
            onClick={() => handleDownloadCard("instagram")}
          >
            <Download className="w-4 h-4 mr-1" />
            Instagram (1080×1080)
          </Button>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onBackToResults}
          className="rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Full Results
        </Button>
        <Button
          onClick={onComplete}
          size="lg"
          className="flex-1 rounded-xl font-bold"
        >
          Complete My Profile
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CareerMapStep;
