import { useEffect, useRef } from "react";
import { storage } from "@/lib/storage";
import type { ExperiencePath } from "@/data/questions";
import PreAssessmentCapture from "./PreAssessmentCapture";

interface ParticipantDetailsProps {
  experiencePath: ExperiencePath;
  onContinue: (participantId: string) => void;
}

/**
 * Routes between:
 * 1. Silent pass-through (Hub magic-link or returning visitor with email already stored)
 * 2. Pre-assessment capture screen (B2C portal flow — name + email)
 */
const ParticipantDetails = ({ experiencePath, onContinue }: ParticipantDetailsProps) => {
  const fired = useRef(false);

  const hasToken = !!localStorage.getItem("beconnect-token");
  const hasEmail = !!localStorage.getItem("beconnect-email");

  // Silent path: Hub token OR returning visitor with stored email
  useEffect(() => {
    if (fired.current) return;
    if (!hasToken && !hasEmail) return; // needs capture screen
    fired.current = true;

    const participantId = "local-" + Date.now();
    storage.setParticipantId(participantId);
    storage.setEntryMode({
      mode: "public",
      candidateEmail: localStorage.getItem("beconnect-email") || "",
      candidateName: localStorage.getItem("beconnect-firstname") || "",
    });

    onContinue(participantId);
  }, [onContinue, hasToken, hasEmail]);

  // If silent path applies, render nothing
  if (hasToken || hasEmail) return null;

  // B2C capture screen
  return (
    <PreAssessmentCapture
      onContinue={(participantId) => {
        storage.setParticipantId(participantId);
        storage.setEntryMode({
          mode: "public",
          candidateEmail: localStorage.getItem("beconnect-email") || "",
          candidateName: localStorage.getItem("beconnect-firstname") || "",
        });
        onContinue(participantId);
      }}
    />
  );
};

export default ParticipantDetails;
