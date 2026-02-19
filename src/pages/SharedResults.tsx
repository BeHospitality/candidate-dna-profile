import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { archetypeData } from "@/lib/archetypes";
import type { Archetype } from "@/lib/scoring";
import type { ComprehensiveScores } from "@/lib/scoring";
import type { SectorMatch } from "@/utils/sectorMatching";
import type { GeographyMatch } from "@/utils/geographyMatching";
import type { DepartmentFit } from "@/utils/departmentMatching";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from "recharts";
import ScrollRevealSection from "@/components/results/ScrollRevealSection";
import DimensionBreakdown from "@/components/results/DimensionBreakdown";
import SectorMatches from "@/components/results/SectorMatches";
import GeographyFit from "@/components/results/GeographyFit";
import DepartmentRanking from "@/components/results/DepartmentRanking";
import { generateProfilePDF } from "@/utils/generateProfilePDF";

const SharedResults = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [dimensionScores, setDimensionScores] = useState<Record<string, number> | null>(null);
  const [comprehensiveScores, setComprehensiveScores] = useState<ComprehensiveScores | null>(null);
  const [sectorMatches, setSectorMatches] = useState<SectorMatch[]>([]);
  const [geographyMatches, setGeographyMatches] = useState<GeographyMatch[]>([]);
  const [departmentMatches, setDepartmentMatches] = useState<DepartmentFit[]>([]);
  const [completedAt, setCompletedAt] = useState<string>("");

  useEffect(() => {
    if (!assessmentId) { setError("No assessment ID provided."); setLoading(false); return; }

    const fetchData = async () => {
      const { data, error: dbError } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", assessmentId)
        .single();

      if (dbError || !data) {
        setError("Could not find this assessment. It may have been removed or the link is invalid.");
        setLoading(false);
        return;
      }

      setArchetype(data.archetype as Archetype);
      setDimensionScores(data.dimension_scores as Record<string, number>);
      setComprehensiveScores((data.comprehensive_scores as unknown as ComprehensiveScores) || null);
      setSectorMatches((data.sector_matches as unknown as SectorMatch[]) || []);
      setGeographyMatches((data.geography_matches as unknown as GeographyMatch[]) || []);
      setDepartmentMatches((data.department_matches as unknown as DepartmentFit[]) || []);
      setCompletedAt(data.completed_at);

      // Update page title for link previews
      document.title = `DNA Profile: ${(archetypeData[data.archetype as Archetype]?.name) || data.archetype} — Be Connect`;

      setLoading(false);
    };

    fetchData();
  }, [assessmentId]);

  const handleDownloadPDF = () => {
    if (!archetype || !comprehensiveScores) return;
    const arch = archetypeData[archetype];
    generateProfilePDF({
      archetype: { name: arch.name, emoji: arch.emoji, title: arch.tagline, traits: arch.traits, strengths: arch.strengths, workStyle: arch.workStyle },
      comprehensiveScores: comprehensiveScores as unknown as Record<string, number>,
      sectorMatches,
      geographyMatches,
      departmentMatches,
      experiencePath: "unknown",
      completedAt,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-radial flex flex-col items-center justify-center px-4 gap-4">
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-48 h-6" />
        <Skeleton className="w-full max-w-sm h-64 rounded-2xl" />
      </div>
    );
  }

  if (error || !archetype) {
    return (
      <div className="min-h-screen bg-navy-radial flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Assessment Not Found</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => navigate("/")} size="lg" className="rounded-xl">
          Take Your Own Assessment
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    );
  }

  const arch = archetypeData[archetype];
  const radarData = dimensionScores ? [
    { dimension: "Autonomy", score: dimensionScores.autonomy || 0 },
    { dimension: "Collaboration", score: dimensionScores.collaboration || 0 },
    { dimension: "Precision", score: dimensionScores.precision || 0 },
    { dimension: "Leadership", score: dimensionScores.leadership || 0 },
    { dimension: "Adaptability", score: dimensionScores.adaptability || 0 },
  ] : [];

  return (
    <div className="min-h-screen bg-navy-radial">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center px-4 py-8"
      >
        {/* Archetype Card */}
        <div className="w-full max-w-sm mx-auto mb-8">
          <div
            className="relative rounded-2xl overflow-hidden border-2 border-primary/50 gold-glow p-8 text-center"
            style={{ background: "linear-gradient(160deg, hsl(213 80% 14%), hsl(213 100% 10%))" }}
          >
            <div className="card-shine absolute inset-0 rounded-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="text-7xl mb-4">{arch.emoji}</div>
              <p className="text-sm font-medium text-primary tracking-widest uppercase mb-2">DNA Profile</p>
              <h1 className="text-4xl font-extrabold text-foreground mb-2">{arch.name}</h1>
              <p className="text-lg text-primary font-semibold mb-6">{arch.tagline}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {arch.traits.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Radar */}
        {radarData.length > 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm mx-auto glass-card p-4 rounded-2xl mb-8">
            <h3 className="text-center font-semibold text-foreground mb-2">Dimension Scores</h3>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                <PolarGrid stroke="hsl(213 40% 28%)" />
                <PolarAngleAxis dataKey="dimension" tick={{ fill: "hsl(220 20% 65%)", fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50%)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        <div className="w-full max-w-lg mx-auto space-y-6">
          {/* Download */}
          <Button onClick={handleDownloadPDF} variant="outline" className="w-full rounded-xl" size="lg">
            <Download className="mr-2 w-4 h-4" />
            Download DNA Profile
          </Button>

          {comprehensiveScores && (
            <ScrollRevealSection>
              <DimensionBreakdown comprehensiveScores={comprehensiveScores} />
            </ScrollRevealSection>
          )}

          {sectorMatches.length > 0 ? (
            <ScrollRevealSection><SectorMatches sectorMatches={sectorMatches} /></ScrollRevealSection>
          ) : (
            <div className="glass-card p-6 rounded-2xl text-center text-sm text-muted-foreground">
              Sector matches are not available for this assessment.
            </div>
          )}

          {departmentMatches.length > 0 ? (
            <ScrollRevealSection><DepartmentRanking departmentMatches={departmentMatches} /></ScrollRevealSection>
          ) : (
            <div className="glass-card p-6 rounded-2xl text-center text-sm text-muted-foreground">
              Department alignment data is not available for this assessment.
            </div>
          )}

          {geographyMatches.length > 0 ? (
            <ScrollRevealSection><GeographyFit geographyMatches={geographyMatches} /></ScrollRevealSection>
          ) : (
            <div className="glass-card p-6 rounded-2xl text-center text-sm text-muted-foreground">
              Geography fit data is not available for this assessment.
            </div>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* CTA */}
          <div className="pt-4 pb-12 text-center space-y-4">
            <p className="text-muted-foreground text-sm">Want to discover your own Work DNA?</p>
            <Button onClick={() => navigate("/")} size="lg" className="w-full rounded-xl font-bold text-lg py-6">
              Take Your Own Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SharedResults;
