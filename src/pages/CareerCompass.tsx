import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckCircle2, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { storage } from "@/lib/storage";
import { archetypeData } from "@/lib/archetypes";
import type { Archetype, AssessmentResult } from "@/lib/scoring";
import { persistCareerProfile } from "@/lib/persistence";

interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  whyMatters: string;
}

const CareerCompass = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [step, setStep] = useState<"welcome" | "milestones" | "motivators" | "complete">("welcome");
  const [milestones, setMilestones] = useState<Milestone[]>(
    storage.getMilestones().length > 0
      ? storage.getMilestones()
      : [{ id: crypto.randomUUID(), title: "", targetDate: "", whyMatters: "" }]
  );
  const [motivators, setMotivators] = useState<Record<string, string>>(storage.getMotivators());

  useEffect(() => {
    const res = storage.getResults();
    if (!res) {
      navigate("/");
      return;
    }
    setResult(res);
  }, [navigate]);

  if (!result) return null;

  const archetype = archetypeData[result.primaryArchetype];
  const entryInfo = storage.getEntryMode();

  const motivatorQuestions = [
    "What excites you most about your work?",
    "What would make you stay long-term at a company?",
    "What would make you consider leaving?",
  ];

  const addMilestone = () => {
    if (milestones.length >= 10) return;
    setMilestones([
      ...milestones,
      { id: crypto.randomUUID(), title: "", targetDate: "", whyMatters: "" },
    ]);
  };

  const removeMilestone = (id: string) => {
    if (milestones.length <= 1) return;
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleComplete = async () => {
    storage.setMilestones(milestones);
    storage.setMotivators(motivators);

    // Persist to database
    const assessmentId = storage.getAssessmentId();
    if (assessmentId) {
      await persistCareerProfile(assessmentId, milestones, motivators);
    }

    setStep("complete");
  };

  return (
    <div className="min-h-screen bg-navy-radial px-4 py-8">
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {/* Welcome */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-6">{archetype.emoji}</div>
              <h1 className="text-3xl font-extrabold text-foreground mb-4">
                Let's Map Your Career Journey
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                {archetype.welcomeMessage}
              </p>
              <div className="glass-card p-5 rounded-2xl mb-8 text-left">
                <p className="text-sm font-semibold text-primary mb-3">
                  As a {archetype.name}, consider:
                </p>
                {archetype.prompts.map((p) => (
                  <p key={p} className="text-sm text-muted-foreground mb-2 flex items-start gap-2">
                    <span className="text-primary">→</span>
                    {p}
                  </p>
                ))}
              </div>
              <Button
                size="lg"
                onClick={() => setStep("milestones")}
                className="rounded-xl font-bold px-8 py-6 text-lg"
              >
                Set Career Milestones
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {/* Milestones */}
          {step === "milestones" && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">Career Milestones</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Add 3-10 goals along your career timeline
              </p>

              <div className="relative space-y-4">
                {/* Timeline line */}
                <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-border" />

                {milestones.map((m, idx) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative pl-12"
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full bg-primary border-2 border-primary" />

                    <div className="glass-card p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-primary">
                          Milestone {idx + 1}
                        </span>
                        {milestones.length > 1 && (
                          <button
                            onClick={() => removeMilestone(m.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <Input
                        placeholder="e.g., Become Head Chef"
                        value={m.title}
                        onChange={(e) => updateMilestone(m.id, "title", e.target.value)}
                        className="bg-background/50 border-border"
                      />
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <Input
                          type="date"
                          value={m.targetDate}
                          onChange={(e) => updateMilestone(m.id, "targetDate", e.target.value)}
                          className="bg-background/50 border-border"
                        />
                      </div>
                      <Textarea
                        placeholder="Why does this matter to you?"
                        value={m.whyMatters}
                        onChange={(e) => updateMilestone(m.id, "whyMatters", e.target.value)}
                        rows={2}
                        className="bg-background/50 border-border resize-none"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {milestones.length < 10 && (
                <Button
                  variant="outline"
                  onClick={addMilestone}
                  className="w-full mt-4 rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              )}

              <Button
                onClick={() => {
                  storage.setMilestones(milestones);
                  setStep("motivators");
                }}
                size="lg"
                className="w-full mt-6 rounded-xl font-bold"
                disabled={!milestones.some((m) => m.title.trim())}
              >
                Next: Motivators
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {/* Motivators */}
          {step === "motivators" && (
            <motion.div
              key="motivators"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">What Drives You</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Help us understand your motivations
              </p>

              <div className="space-y-6">
                {motivatorQuestions.map((q, idx) => (
                  <motion.div
                    key={q}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-5 rounded-xl"
                  >
                    <label className="text-sm font-semibold text-foreground block mb-3">
                      {q}
                    </label>
                    <Textarea
                      value={motivators[q] || ""}
                      onChange={(e) => setMotivators({ ...motivators, [q]: e.target.value })}
                      rows={3}
                      placeholder="Share your thoughts..."
                      className="bg-background/50 border-border resize-none"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep("milestones")}
                  className="rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="flex-1 rounded-xl font-bold"
                >
                  Complete Profile
                  <CheckCircle2 className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Complete */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 text-success mb-6"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <h1 className="text-3xl font-extrabold text-foreground mb-4">
                Profile Complete!
              </h1>

              {entryInfo.mode === "public" && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Your {archetype.name} {archetype.emoji} profile is ready.
                  </p>
                  <Button size="lg" className="rounded-xl font-bold px-8">
                    Join Talent Network
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}

              {entryInfo.mode === "candidate" && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    The Be Connect team will be in touch about next steps.
                  </p>
                  <div className="glass-card p-6 rounded-2xl inline-block">
                    <p className="text-primary font-semibold">Thank you!</p>
                  </div>
                </div>
              )}

              {entryInfo.mode === "team" && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Your goals have been shared with leadership.
                  </p>
                  <div className="glass-card p-6 rounded-2xl inline-block">
                    <p className="text-primary font-semibold">Thanks for completing your career profile!</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CareerCompass;
