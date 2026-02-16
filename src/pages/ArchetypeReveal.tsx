import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Linkedin, Twitter, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { calculateScores, type AssessmentResult } from "@/lib/scoring";
import { archetypeData } from "@/lib/archetypes";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const ArchetypeReveal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phase, setPhase] = useState<"loading" | "flip" | "revealed">("loading");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showRadar, setShowRadar] = useState(false);

  useEffect(() => {
    const answers = storage.getAnswers();
    if (Object.keys(answers).length === 0) {
      navigate("/");
      return;
    }
    const res = calculateScores(answers);
    setResult(res);
    storage.setResults(res);

    const t1 = setTimeout(() => setPhase("flip"), 2000);
    const t2 = setTimeout(() => setPhase("revealed"), 3000);
    const t3 = setTimeout(() => setShowRadar(true), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [navigate]);

  if (!result) return null;

  const archetype = archetypeData[result.primaryArchetype];
  const entryInfo = storage.getEntryMode();

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

  return (
    <div className="min-h-screen bg-navy-radial">
      <AnimatePresence mode="wait">
        {/* Loading phase */}
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

        {/* Flip / Revealed */}
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
                {/* Front */}
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
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/30"
                        >
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
                    <PolarAngleAxis
                      dataKey="dimension"
                      tick={{ fill: "hsl(220 20% 65%)", fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="hsl(38 92% 50%)"
                      fill="hsl(38 92% 50%)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
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
                {/* Strengths */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-lg text-foreground mb-3">💪 Strengths</h3>
                  <ul className="space-y-2">
                    {archetype.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Work Style */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-lg text-foreground mb-3">🏢 Work Style</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {archetype.workStyle}
                  </p>
                </div>

                {/* Thrives When */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-lg text-foreground mb-3">🌟 Thrives When</h3>
                  <ul className="space-y-2">
                    {archetype.thrivesWhen.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-success mt-0.5">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-lg text-foreground mb-3">⚡ Challenges</h3>
                  <ul className="space-y-2">
                    {archetype.challenges.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-destructive mt-0.5">!</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Career Paths */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-lg text-foreground mb-3">🎯 Career Paths</h3>
                  <div className="flex flex-wrap gap-2">
                    {archetype.careerPaths.map((p) => (
                      <span
                        key={p}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share Section */}
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-primary" />
                    Share Your Results
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(shareText)}`,
                          "_blank"
                        )
                      }
                      className="rounded-lg"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`,
                          "_blank"
                        )
                      }
                      className="rounded-lg"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyLink} className="rounded-lg">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </div>

                {/* CTA based on mode */}
                <div className="pt-4 pb-12 space-y-4">
                  {entryInfo.mode === "public" && (
                    <>
                      <Button
                        onClick={handleContinue}
                        size="lg"
                        className="w-full rounded-xl font-bold text-lg py-6"
                      >
                        Continue to Career Mapping
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full rounded-xl"
                      >
                        <Download className="mr-2 w-4 h-4" />
                        Download Be Connect App
                      </Button>
                    </>
                  )}

                  {entryInfo.mode === "candidate" && (
                    <>
                      <p className="text-center text-muted-foreground">
                        Great! Let's map your career goals next.
                      </p>
                      <Button
                        onClick={handleContinue}
                        size="lg"
                        className="w-full rounded-xl font-bold text-lg py-6"
                      >
                        Continue to Career Goals
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </>
                  )}

                  {entryInfo.mode === "team" && (
                    <>
                      <div className="glass-card p-6 rounded-2xl text-center">
                        <p className="text-success font-semibold text-lg mb-2">
                          ✓ Your archetype has been recorded
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Thanks for completing the assessment!
                        </p>
                      </div>
                      <Button
                        onClick={handleContinue}
                        variant="outline"
                        size="lg"
                        className="w-full rounded-xl"
                      >
                        Continue to career goals (optional)
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchetypeReveal;
