import { useEffect, useRef } from "react";
import { storage } from "@/lib/storage";
import type { ExperiencePath } from "@/data/questions";

interface ParticipantDetailsProps {
  experiencePath: ExperiencePath;
  onContinue: (participantId: string) => void;
}

/**
 * Silent pre-assessment setup.
 * Generates a local participant ID and provisional entry mode,
 * then immediately advances to the assessment — no form, no UI.
 */
const ParticipantDetails = ({ experiencePath, onContinue }: ParticipantDetailsProps) => {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const participantId = "local-" + Date.now();
    storage.setParticipantId(participantId);
    storage.setEntryMode({
      mode: "public",
      candidateEmail: "",
      candidateName: "",
    });

    onContinue(participantId);
  }, [onContinue]);

  // Render nothing — transition is instant
  return null;
};

export default ParticipantDetails;
