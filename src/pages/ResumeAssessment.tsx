import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchResumeToken, markResumeTokenUsed } from "@/lib/resumeTokens";
import { storage } from "@/lib/storage";
import type { ExperiencePath } from "@/data/questions";

const SAVE_KEY = "dna_assessment_progress";

const ResumeAssessment = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "invalid" | "redirecting">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    fetchResumeToken(token).then((data) => {
      if (!data) {
        setStatus("invalid");
        return;
      }

      // Mark token as used
      markResumeTokenUsed(token);

      // If phase1 results exist, restore them and go to reveal
      if (data.phase1Results) {
        storage.setExperiencePath(data.experiencePath as ExperiencePath);
        storage.setAnswers(data.answers);
        storage.setResults(data.phase1Results);
        if (data.assessmentId) storage.setAssessmentId(data.assessmentId);
        if (data.participantId) storage.setParticipantId(data.participantId);
        setStatus("redirecting");
        navigate("/reveal", { replace: true });
        return;
      }

      // Otherwise, restore mid-assessment progress into localStorage
      const saveState = {
        experiencePath: data.experiencePath,
        currentQuestion: data.currentQuestion,
        answers: data.answers,
        startedAt: new Date().toISOString(),
        lastSavedAt: new Date().toISOString(),
        totalQuestions: data.totalQuestions,
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveState));
      storage.setExperiencePath(data.experiencePath as ExperiencePath);
      storage.setAnswers(data.answers);
      if (data.participantId) storage.setParticipantId(data.participantId);

      setStatus("redirecting");
      navigate("/assessment", { replace: true });
    });
  }, [token, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-navy-radial flex flex-col items-center justify-center px-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-foreground font-semibold">Restoring your progress…</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="min-h-screen bg-navy-radial flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-6">⏳</div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Link Expired or Invalid</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            This resume link has expired, already been used, or is invalid. You can start a fresh assessment below.
          </p>
          <Button onClick={() => navigate("/")} className="rounded-xl font-bold">
            Start New Assessment
          </Button>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default ResumeAssessment;
