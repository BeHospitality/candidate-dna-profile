import { useState } from "react";
import { Check } from "lucide-react";
import { storage } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { invokeSecureRpc } from "@/lib/secureRpc";
import { archetypeData } from "@/lib/archetypes";
import type { AssessmentResult } from "@/lib/scoring";
import ScrollRevealSection from "./ScrollRevealSection";

// NOTE: The legacy fireRevealEmailCaptured / fireHubRelay helpers were
// removed on 2026-06-03. Hub delivery is now done exclusively via the
// durable hub_outbox queue (enqueue_hub_outbox RPC, fired from
// ArchetypeReveal → hub-outbox-worker). The hub-relay and
// reveal-email-relay edge functions have been deleted.

interface SaveDNAPanelProps {
  result: AssessmentResult;
  comprehensiveScores: Record<string, number>;
  sectorMatches: any[];
  geographyMatches: any[];
  departmentMatches: any[];
}

const SaveDNAPanel = ({
  result,
  comprehensiveScores,
  sectorMatches,
  geographyMatches,
  departmentMatches,
}: SaveDNAPanelProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = firstName.trim().length > 0 && isValidEmail;

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    // Single canonicalisation point per A6, extract once, use everywhere.
    const normalisedEmail = String(email).toLowerCase().trim();

    // Persist first name
    localStorage.setItem("beconnect-candidate-name", firstName.trim());

    try {
      // 1. Update entry mode with real email
      const currentEntry = storage.getEntryMode();
      storage.setEntryMode({
        ...currentEntry,
        candidateEmail: normalisedEmail,
        candidateName: "",
      });

      // 2. Send results email
      const assessmentId = storage.getAssessmentId();
      if (assessmentId) {
        const archetype = archetypeData[result.primaryArchetype];
        const resultsUrl = `${window.location.origin}/results/${assessmentId}`;

        supabase.functions.invoke("send-dna-results", {
          body: {
            firstName: localStorage.getItem("beconnect-firstname") || "",
            lastName: localStorage.getItem("beconnect-lastname") || "",
            email: normalisedEmail,
            archetype: archetype.name,
            archetypeDescription: archetype.tagline,
            topCareerPaths: archetype.careerPaths.slice(0, 3),
            eqSuperpower: "Empathy",
            resultsUrl,
            whatsapp: whatsapp.trim() || undefined,
            candidatePath: localStorage.getItem("beconnect-path") || "growing",
          },
        }).catch((err) => console.error("Results email failed:", err));

        // 3. Update participant record if it exists (via security-definer RPC)
        const participantId = storage.getParticipantId();
        if (participantId && !participantId.startsWith("local-")) {
          invokeSecureRpc("update_dna_participant", {
              p_id: participantId,
              p_email: normalisedEmail,
              p_phone: whatsapp.trim() || null,
            })
            .then(({ error }) => {
              if (error) console.error("Participant update failed:", error);
            });
        }
      }

      // Persist first name to the canonical localStorage key
      localStorage.setItem("beconnect-firstname", firstName.trim());

      // Hub delivery (including the post-save email-captured signal) is now
      // routed exclusively through the durable hub_outbox queue fired at
      // reveal time in ArchetypeReveal (fireHubRelayReveal → enqueue_hub_outbox).
      // The two open relays (hub-relay, reveal-email-relay) were inbound-locked
      // on 2026-06-03 and no longer accept browser calls.


      setSubmitted(true);
    } catch (err) {
      console.error("Save DNA panel error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <ScrollRevealSection>
        <div className="rounded-2xl p-8 text-center space-y-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "rgba(0,140,114,0.15)" }}>
            <Check className="w-6 h-6" style={{ color: "#008C72" }} />
          </div>
          <p className="text-white" style={{ fontFamily: "DM Sans, sans-serif", fontSize: 16 }}>
            Your DNA profile is on its way.
          </p>
          <a
            href="https://career.be.ie"
            className="inline-block transition-opacity hover:opacity-80"
            style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, color: "#008C72" }}
          >
            Next step, build your career map →
          </a>
        </div>
      </ScrollRevealSection>
    );
  }

  return (
    <ScrollRevealSection>
      <div className="rounded-2xl p-8 space-y-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <h3 className="text-white mb-2" style={{ fontFamily: "Playfair Display, serif", fontSize: 22 }}>
            Save your DNA card
          </h3>
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15, color: "#cbd5e1" }}>
            Get your full archetype profile and let us find where you belong.
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full outline-none placeholder:text-white/30 transition-colors duration-200"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 15,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              padding: "12px 16px",
              color: "white",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none placeholder:text-white/30 transition-colors duration-200"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 15,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              padding: "12px 16px",
              color: "white",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />
          <div>
            <input
              type="tel"
              placeholder="+353 or international"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full outline-none placeholder:text-white/30 transition-colors duration-200"
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 15,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8,
                padding: "12px 16px",
                color: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#64748b", marginTop: 4 }}>
              Optional
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="w-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            background: canSubmit ? "#f59e0b" : "rgba(245,158,11,0.4)",
            color: "#0f1729",
            borderRadius: 8,
            padding: 14,
            border: "none",
            cursor: canSubmit ? "pointer" : "default",
          }}
          onMouseEnter={(e) => { if (canSubmit) (e.target as HTMLElement).style.background = "#e58e00"; }}
          onMouseLeave={(e) => { if (canSubmit) (e.target as HTMLElement).style.background = "#f59e0b"; }}
        >
          {submitting ? "Sending..." : "Send me my DNA profile →"}
        </button>

        <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#64748b", textAlign: "center" }}>
          No spam. Unsubscribe any time.{" "}
          <a
            href="https://be.ie/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/60"
          >
            Read our Privacy Policy
          </a>
        </p>
      </div>
    </ScrollRevealSection>
  );
};

export default SaveDNAPanel;
