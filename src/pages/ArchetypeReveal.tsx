import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Linkedin, Twitter, ArrowRight, Download, FileText, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { calculateScores, calculateComprehensiveScores, type AssessmentResult, type ComprehensiveScores } from "@/lib/scoring";
import { getQuestionsForPath, type ExperiencePath } from "@/data/questions";
import { calculateSectorMatches, type SectorMatch } from "@/utils/sectorMatching";
import { calculateGeographyMatches, type GeographyMatch } from "@/utils/geographyMatching";
import { calculateDepartmentMatches, type DepartmentFit } from "@/utils/departmentMatching";
import { archetypeData } from "@/lib/archetypes";
import { getSignatureCombination } from "@/utils/signatureMatch";
import { getNarrativeForScore } from "@/data/dimensionNarratives";
import { exportDNACard } from "@/utils/dnaCardExport";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import { persistAssessment, markMagicLinkUsed } from "@/lib/persistence";
import { generateProfilePDF } from "@/utils/generateProfilePDF";
import { supabase } from "@/integrations/supabase/client";
import ScrollRevealSection from "@/components/results/ScrollRevealSection";
import DimensionBreakdown from "@/components/results/DimensionBreakdown";
import SectorMatches from "@/components/results/SectorMatches";
import GeographyFit from "@/components/results/GeographyFit";
import DepartmentRanking from "@/components/results/DepartmentRanking";
import DNASnapshot from "@/components/results/DNASnapshot";
import CareerCompassSummary from "@/components/results/CareerCompassSummary";
import SignatureCard from "@/components/results/SignatureCard";
import DNACard from "@/components/results/DNACard";
import BrandHeader from "@/components/BrandHeader";
import DynamicFooter from "@/components/DynamicFooter";

/** Fire-and-forget: send DNA results email to the participant */
async function sendDnaResultsEmail(
  assessmentId: string,
  result: AssessmentResult,
  comprehensive: ComprehensiveScores,
  experiencePath: string
) {
  try {
    // Get participant info from localStorage (RLS blocks SELECT on dna_participants)
    const entryInfo = storage.getEntryMode();
    const email = entryInfo.candidateEmail;
    const firstName = entryInfo.candidateName?.split(' ')[0] || '';
    const lastName = entryInfo.candidateName?.split(' ').slice(1).join(' ') || '';

    if (!email) return;

    const archetype = archetypeData[result.primaryArchetype];

    const eqDims = [
      { key: "readingOthers" as const, label: "Reading Others" },
      { key: "empathy" as const, label: "Empathy" },
      { key: "selfRegulation" as const, label: "Self-Regulation" },
      { key: "socialAwareness" as const, label: "Social Awareness" },
    ];
    const topEq = eqDims.reduce((best, d) =>
      comprehensive[d.key] > comprehensive[best.key] ? d : best
    , eqDims[0]);

    const resultsUrl = `${window.location.origin}/results/${assessmentId}`;

    await supabase.functions.invoke("send-dna-results", {
      body: {
        firstName,
        lastName,
        email,
        archetype: archetype.name,
        archetypeDescription: archetype.tagline,
        topCareerPaths: archetype.careerPaths.slice(0, 3),
        eqSuperpower: topEq.label,
        resultsUrl,
      },
    });
  } catch (err) {
    console.error("DNA results email failed:", err);
  }
}

// Dimension label map for display
const DIMENSION_LABELS: Record<string, string> = {
  autonomy: "Autonomy", collaboration: "Collaboration", precision: "Precision",
  leadership: "Leadership", adaptability: "Adaptability", problemSolving: "Problem Solving",
  attentionToDetail: "Attention to Detail", learningSpeed: "Learning Speed",
  patternRecognition: "Pattern Recognition", concentration: "Concentration",
  extraversion: "Extraversion", conscientiousness: "Conscientiousness",
  openness: "Openness", agreeableness: "Agreeableness", emotionalStability: "Emotional Stability",
  readingOthers: "Reading Others", empathy: "Empathy", selfRegulation: "Self-Regulation",
  socialAwareness: "Social Awareness", integrity: "Integrity", ruleFollowing: "Rule-Following",
  safetyConsciousness: "Safety", dependability: "Dependability",
};

const ArchetypeReveal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phase, setPhase] = useState<"loading" | "flip" | "revealed">("loading");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showRadar, setShowRadar] = useState(false);
  const [hubStatus, setHubStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [comprehensiveScores, setComprehensiveScores] = useState<ComprehensiveScores | null>(null);
  const [sectorMatches, setSectorMatches] = useState<SectorMatch[]>([]);
  const [geographyMatches, setGeographyMatches] = useState<GeographyMatch[]>([]);
  const [departmentMatches, setDepartmentMatches] = useState<DepartmentFit[]>([]);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [cardFormat, setCardFormat] = useState<"linkedin" | "instagram">("linkedin");

  const linkedinCardRef = useRef<HTMLDivElement>(null);
  const instagramCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const answers = storage.getAnswers();
    if (Object.keys(answers).length === 0) {
      navigate("/");
      return;
    }
    const res = calculateScores(answers);
    setResult(res);
    storage.setResults(res);

    const path = storage.getExperiencePath() || 'experienced';
    const pathQuestions = getQuestionsForPath(path as ExperiencePath);
    const comprehensive = calculateComprehensiveScores(answers, pathQuestions);
    setComprehensiveScores(comprehensive);

    const sMat = calculateSectorMatches(comprehensive);
    const gMat = calculateGeographyMatches(comprehensive);
    const dMat = calculateDepartmentMatches(comprehensive);
    setSectorMatches(sMat);
    setGeographyMatches(gMat);
    setDepartmentMatches(dMat);

    storage.setMatchingResults({ sectorMatches: sMat, geographyMatches: gMat, departmentMatches: dMat, comprehensiveScores: comprehensive });

    const entryInfo = storage.getEntryMode();
    const isHubMode = entryInfo.mode === 'candidate' || entryInfo.mode === 'team';
    if (isHubMode) setHubStatus("sending");

    persistAssessment({
      result: res,
      answers,
      entryInfo,
      comprehensiveScores: comprehensive,
      experiencePath: path,
      sectorMatches,
      geographyMatches,
      departmentMatches,
    }).then((assessmentId) => {
      if (assessmentId) {
        storage.setAssessmentId(assessmentId);
        if (entryInfo.mode === "candidate" && entryInfo.token) {
          markMagicLinkUsed(entryInfo.token, assessmentId);
        }
        if (isHubMode) {
          const pending = localStorage.getItem("dna_hub_pending");
          setHubStatus(pending ? "failed" : "sent");
        }
        sendDnaResultsEmail(assessmentId, res, comprehensive, path);
      }
    });

    const t1 = setTimeout(() => setPhase("flip"), 2000);
    const t2 = setTimeout(() => setPhase("revealed"), 3000);
    const t3 = setTimeout(() => setShowRadar(true), 3500);
    const t4 = setTimeout(() => setShowScrollHint(true), 4500);
    const t5 = setTimeout(() => setShowScrollHint(false), 7500);

    const onScroll = () => setShowScrollHint(false);
    window.addEventListener("scroll", onScroll, { once: true });

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); window.removeEventListener("scroll", onScroll); };
  }, [navigate]);

  if (!result) return null;

  const archetype = archetypeData[result.primaryArchetype];
  const entryInfo = storage.getEntryMode();

  // Signature combination
  const signatureCombination = comprehensiveScores
    ? getSignatureCombination(comprehensiveScores as unknown as Record<string, number>)
    : null;

  // Top 5 dimensions for DNA card
  const topDimensions = comprehensiveScores
    ? Object.entries(comprehensiveScores as unknown as Record<string, number>)
        .filter(([key]) => DIMENSION_LABELS[key])
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([key, score]) => {
          const narrative = getNarrativeForScore(key, score);
          return { label: narrative?.label || DIMENSION_LABELS[key] || key, score };
        })
    : [];

  const radarData = [
    { dimension: "Autonomy", score: result.scores.autonomy },
    { dimension: "Collaboration", score: result.scores.collaboration },
    { dimension: "Precision", score: result.scores.precision },
    { dimension: "Leadership", score: result.scores.leadership },
    { dimension: "Adaptability", score: result.scores.adaptability },
  ];

  const shareText = `I'm a ${archetype.name} ${archetype.emoji} — ${archetype.tagline}! Discover your work DNA`;

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    toast({ title: "Link copied!", description: "Share it with your network." });
  };

  const handleContinue = () => navigate("/career-compass");

  const handleDownloadPDF = () => {
    const path = storage.getExperiencePath() || 'experienced';
    const scores = comprehensiveScores || result.scores;
    generateProfilePDF({
      archetype: { name: archetype.name, emoji: archetype.emoji, title: archetype.tagline, traits: archetype.traits, strengths: archetype.strengths, workStyle: archetype.workStyle },
      comprehensiveScores: scores as unknown as Record<string, number>,
      sectorMatches,
      geographyMatches,
      departmentMatches,
      experiencePath: path,
      completedAt: new Date().toISOString(),
    });
  };

  const assessmentId = storage.getAssessmentId();
  const shareableUrl = assessmentId ? `${window.location.origin}/results/${assessmentId}` : null;

  const copyShareLink = () => {
    if (shareableUrl) {
      navigator.clipboard.writeText(shareableUrl);
      toast({ title: "Link copied!", description: "Share your DNA profile with anyone." });
    }
  };

  const handleDownloadCard = (format: "linkedin" | "instagram") => {
    const ref = format === "linkedin" ? linkedinCardRef : instagramCardRef;
    if (ref.current) {
      exportDNACard(
        ref.current,
        format,
        `be-connect-dna-${format}.png`
      );
    }
  };

  const bestSector = sectorMatches[0]?.sector || "Hospitality";
  const bestGeography = geographyMatches[0]?.region || "Global";
  const bestDepartment = departmentMatches[0]?.department || "Operations";

  return (
    <div className="min-h-screen bg-navy-radial flex flex-col">
      <BrandHeader />

      {/* Off-screen DNA Cards for export */}
      <div style={{ position: "absolute", left: -9999, top: 0 }}>
        <DNACard
          ref={linkedinCardRef}
          archetypeEmoji={archetype.emoji}
          archetypeName={archetype.name}
          archetypeTagline={archetype.tagline}
          signatureName={signatureCombination?.name || "The Rising Force"}
          topDimensions={topDimensions}
          bestSector={bestSector}
          bestGeography={bestGeography}
          topDepartment={bestDepartment}
          format="linkedin"
        />
        <DNACard
          ref={instagramCardRef}
          archetypeEmoji={archetype.emoji}
          archetypeName={archetype.name}
          archetypeTagline={archetype.tagline}
          signatureName={signatureCombination?.name || "The Rising Force"}
          topDimensions={topDimensions}
          bestSector={bestSector}
          bestGeography={bestGeography}
          topDepartment={bestDepartment}
          format="instagram"
        />
      </div>

      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center px-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="text-6xl mb-6"
            >
              🧬
            </motion.div>
            <p className="text-xl font-semibold text-foreground">
              Analyzing your Work DNA...
            </p>
          </motion.div>
        )}

        {(phase === "flip" || phase === "revealed") && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center px-4 py-8"
          >
            {/* Master Card */}
            <div className="w-full max-w-sm mx-auto mb-8" style={{ perspective: "1200px" }}>
              <motion.div
                initial={{ rotateY: 180 }}
                animate={{ rotateY: phase === "revealed" ? 0 : 180 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative"
              >
                <div
                  className="relative rounded-2xl overflow-hidden border-2 border-primary/50 gold-glow p-8 text-center"
                  style={{ backfaceVisibility: "hidden", background: "linear-gradient(160deg, hsl(213 80% 14%), hsl(213 100% 10%))" }}
                >
                  <div className="card-shine absolute inset-0 rounded-2xl pointer-events-none" />
                  <div className="relative z-10">
                    <div className="text-7xl mb-4">{archetype.emoji}</div>
                    <p className="text-sm font-medium text-primary tracking-widest uppercase mb-2">
                      You are a
                    </p>
                    <h1 className="text-4xl font-extrabold text-foreground mb-2">
                      {archetype.name}
                    </h1>
                    <p className="text-lg text-primary font-semibold mb-6">
                      {archetype.tagline}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {archetype.traits.map((t) => (
                        <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Radar Chart */}
            {showRadar && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm mx-auto glass-card p-4 rounded-2xl mb-8"
              >
                <h3 className="text-center font-semibold text-foreground mb-2">
                  Your Dimension Scores
                </h3>
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

            {/* Full Breakdown */}
            {phase === "revealed" && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-lg mx-auto space-y-6"
              >
                {/* Hero Actions */}
                <div className="flex gap-3">
                  <Button onClick={handleDownloadPDF} variant="outline" className="flex-1 rounded-xl" size="sm">
                    <Download className="mr-2 w-4 h-4" />Download PDF
                  </Button>
                  <Button variant="outline" className="flex-1 rounded-xl" size="sm" onClick={shareableUrl ? copyShareLink : copyLink}>
                    <Share2 className="mr-2 w-4 h-4" />Share Result
                  </Button>
                </div>

                {/* DNA Snapshot */}
                {comprehensiveScores && (
                  <ScrollRevealSection>
                    <DNASnapshot comprehensiveScores={comprehensiveScores} />
                  </ScrollRevealSection>
                )}

                {/* Signature Card (Phase 7) */}
                {signatureCombination && (
                  <ScrollRevealSection>
                    <SignatureCard combination={signatureCombination} />
                  </ScrollRevealSection>
                )}

                {/* DNA Card Section (Phase 9) */}
                <ScrollRevealSection>
                  <div className="glass-card p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      🎴 Your DNA Card
                    </h3>

                    {/* Preview card inline */}
                    <div className="flex justify-center">
                      <div
                        className="max-w-[480px] w-full rounded-xl overflow-hidden"
                        style={{ boxShadow: "0 0 24px rgba(245,158,11,0.15)" }}
                      >
                        <DNACard
                          archetypeEmoji={archetype.emoji}
                          archetypeName={archetype.name}
                          archetypeTagline={archetype.tagline}
                          signatureName={signatureCombination?.name || "The Rising Force"}
                          topDimensions={topDimensions}
                          bestSector={bestSector}
                          bestGeography={bestGeography}
                          topDepartment={bestDepartment}
                          format="linkedin"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCard("linkedin")}
                        className="rounded-lg border-primary/40 text-primary hover:bg-primary/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        LinkedIn
                        <span className="text-[10px] ml-1 text-muted-foreground">1200×630</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCard("instagram")}
                        className="rounded-lg border-primary/40 text-primary hover:bg-primary/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Instagram
                        <span className="text-[10px] ml-1 text-muted-foreground">1080×1080</span>
                      </Button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                      Share your DNA and tag @beconnectie
                    </p>

                    {(entryInfo.mode === "candidate" || entryInfo.mode === "team") && (
                      <p className="text-center text-xs text-muted-foreground">
                        Share your profile with your network →
                      </p>
                    )}
                  </div>
                </ScrollRevealSection>

                {/* Career Compass */}
                {(sectorMatches.length > 0 || departmentMatches.length > 0 || geographyMatches.length > 0) && (
                  <ScrollRevealSection>
                    <CareerCompassSummary
                      sectorMatches={sectorMatches}
                      departmentMatches={departmentMatches}
                      geographyMatches={geographyMatches}
                    />
                  </ScrollRevealSection>
                )}

                {/* Scroll hint */}
                <AnimatePresence>
                  {showScrollHint && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-xs text-muted-foreground py-2">
                      Scroll for your full DNA profile ↓
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Archetype Details */}
                <ScrollRevealSection>
                  <div className="glass-card p-6 rounded-2xl space-y-4">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      {archetype.emoji} About Your Archetype
                    </h3>
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
                </ScrollRevealSection>

                {/* DNA Dimension Breakdown */}
                {comprehensiveScores && (
                  <ScrollRevealSection>
                    <DimensionBreakdown comprehensiveScores={comprehensiveScores} />
                  </ScrollRevealSection>
                )}

                {sectorMatches.length > 0 && (
                  <ScrollRevealSection>
                    <SectorMatches sectorMatches={sectorMatches} />
                  </ScrollRevealSection>
                )}

                {departmentMatches.length > 0 && (
                  <ScrollRevealSection>
                    <DepartmentRanking departmentMatches={departmentMatches} />
                  </ScrollRevealSection>
                )}

                {geographyMatches.length > 0 && (
                  <ScrollRevealSection>
                    <GeographyFit geographyMatches={geographyMatches} />
                  </ScrollRevealSection>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Share section */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />Share Your Results
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl || window.location.origin)}&summary=${encodeURIComponent(shareText)}`, "_blank")} className="rounded-lg">
                      <Linkedin className="w-4 h-4 mr-2" />LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareableUrl || window.location.origin)}`, "_blank")} className="rounded-lg">
                      <Twitter className="w-4 h-4 mr-2" />Twitter
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareableUrl ? copyShareLink : copyLink} className="rounded-lg">
                      <Copy className="w-4 h-4 mr-2" />Copy Link
                    </Button>
                    {shareableUrl && (
                      <Button variant="outline" size="sm" onClick={copyShareLink} className="rounded-lg">
                        <LinkIcon className="w-4 h-4 mr-2" />Share Profile
                      </Button>
                    )}
                  </div>
                  <div className="mt-4">
                    <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="w-full rounded-lg">
                      <Download className="w-4 h-4 mr-2" />Download PDF
                    </Button>
                  </div>
                </div>

                {/* Hub sync indicator */}
                {(entryInfo.mode === "candidate" || entryInfo.mode === "team") && (
                  <div className="text-center text-sm text-muted-foreground">
                    {hubStatus === "sending" && "⏳ Syncing results with your hiring team..."}
                    {hubStatus === "sent" && "✓ Results shared with your hiring team"}
                    {hubStatus === "failed" && "⏳ Syncing results with your hiring team..."}
                  </div>
                )}

                {/* Entry-mode CTAs */}
                {entryInfo.mode === "candidate" && (
                  <div className="glass-card p-6 rounded-2xl text-center space-y-3">
                    <p className="text-sm text-foreground font-medium">Your DNA profile has been sent to your property.</p>
                    <Button onClick={handleDownloadPDF} variant="outline" className="rounded-xl" size="sm">
                      <Download className="mr-2 w-4 h-4" />Download PDF
                    </Button>
                  </div>
                )}

                {entryInfo.mode === "team" && (
                  <div className="glass-card p-6 rounded-2xl text-center space-y-3">
                    <p className="text-sm text-foreground font-medium">Your DNA profile has been shared with your team.</p>
                    <Button onClick={handleDownloadPDF} variant="outline" className="rounded-xl" size="sm">
                      <Download className="mr-2 w-4 h-4" />Download PDF
                    </Button>
                  </div>
                )}

                {entryInfo.mode === "public" && (
                  <>
                    <div className="text-center">
                      <a href="https://ecosystem.be.ie" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                        Join the Network →
                      </a>
                    </div>

                    <div className="pt-4 pb-4 space-y-5">
                      <div className="glass-card p-6 rounded-2xl text-center space-y-4">
                        <p className="text-lg font-bold text-foreground">You've unlocked your archetype — but there's more.</p>
                        <p className="text-sm text-muted-foreground font-medium">Continue now to discover:</p>
                        <ul className="text-sm text-muted-foreground text-left inline-block space-y-2">
                          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Your top 3 career paths (with match %)</li>
                          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Which departments suit you best</li>
                          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>Your EQ superpower</li>
                          <li className="flex items-start gap-2"><span className="text-primary mt-0.5">✓</span>A downloadable DNA profile you can share</li>
                        </ul>
                      </div>

                      <Button onClick={handleContinue} size="lg" className="w-full rounded-xl font-bold text-lg py-6">
                        Continue Now<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>

                      <Button variant="outline" size="lg" className="w-full rounded-xl" onClick={() => { toast({ title: "Progress saved!", description: "You can return anytime to continue." }); }}>
                        Save & Finish Later<ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <DynamicFooter />
    </div>
  );
};

export default ArchetypeReveal;
