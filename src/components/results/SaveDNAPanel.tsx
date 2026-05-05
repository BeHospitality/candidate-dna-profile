import { useState } from "react";
import { Check } from "lucide-react";
import { storage } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";
import { archetypeData } from "@/lib/archetypes";
import type { AssessmentResult } from "@/lib/scoring";

function getOrCreateSessionId(): string {
  let sid = localStorage.getItem("beconnect-session-id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("beconnect-session-id", sid);
  }
  return sid;
}

/**
 * Fire-and-forget invocation of the reveal-email-relay edge function on
 * THIS project. The edge function reads DNA_REVEAL_WEBHOOK_SECRET at
 * invocation time and forwards the payload to the Hub's
 * dna-reveal-email-captured endpoint with the x-be-connect-secret
 * header attached.
 *
 * The shared secret is read server-side (in the edge function), never
 * shipped to the browser. If the secret is unset, the relay logs an
 * error and skips the forward — we don't send bare requests to a Hub
 * that's expecting auth.
 *
 * Never blocks the UI; logs every attempt.
 */
function fireRevealEmailCaptured(args: {
  assessmentId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  archetype: string;
  path: string;
}) {
  const capturedAt = new Date().toISOString();
  const logMeta = {
    timestamp: capturedAt,
    assessment_id: args.assessmentId,
    email: args.email,
  };

  const payload = {
    assessment_id: args.assessmentId,
    email: args.email,
    first_name: args.firstName,
    last_name: args.lastName,
    archetype: args.archetype,
    path: args.path,
    captured_at: capturedAt,
  };

  console.log("[reveal-email-captured] attempt", logMeta);
  // Invoke the relay edge function on THIS project. The relay holds the
  // shared secret and adds the x-be-connect-secret header before
  // forwarding to the Hub. Fire-and-forget — never gates the UI.
  supabase.functions
    .invoke("reveal-email-relay", { body: payload })
    .then(({ data, error }) => {
      if (error) {
        console.warn("[reveal-email-captured] relay invoke failed", {
          ...logMeta,
          error: error.message ?? String(error),
        });
        return;
      }
      const skipped = (data as any)?.skipped === true;
      const reason = (data as any)?.reason;
      const hubStatus = (data as any)?.hubStatus;
      if (skipped) {
        console.error("[reveal-email-captured] relay skipped forward", {
          ...logMeta,
          reason: reason ?? "unknown",
        });
      } else if (typeof hubStatus === "number" && hubStatus >= 200 && hubStatus < 300) {
        console.log("[reveal-email-captured] success", { ...logMeta, status: hubStatus });
      } else {
        console.warn("[reveal-email-captured] Hub returned non-2xx", {
          ...logMeta,
          status: hubStatus,
          body: (data as any)?.hubBody,
        });
      }
    })
    .catch((err) => {
      console.warn("[reveal-email-captured] threw", {
        ...logMeta,
        error: err instanceof Error ? err.message : String(err),
      });
    });
}

function fireHubRelay(candidateEmail: string) {
  const logMeta = {
    timestamp: new Date().toISOString(),
    entry_mode: (() => {
      try { return storage.getEntryMode().mode ?? null; } catch { return null; }
    })(),
    candidate_email: candidateEmail,
  };

  try {
    const rawResults = localStorage.getItem("dna-results");
    const parsed = rawResults ? JSON.parse(rawResults) : null;
    const rawMatching = localStorage.getItem("dna-matching-results");
    const matchingResults = rawMatching ? JSON.parse(rawMatching) : null;
    const path = sessionStorage.getItem("beconnect-path") || null;

    const firstName = localStorage.getItem("beconnect-candidate-name") || null;

    // DNA-2: prefer the 23-dim comprehensiveScores from dna-matching-results.
    // Fall back to the 5-dim AssessmentResult.scores only if comprehensive is
    // unavailable, so Hub never receives an empty payload.
    const comprehensive = matchingResults?.comprehensiveScores || null;
    const dimensionScores = comprehensive || parsed?.scores || parsed?.dimensionScores || null;

    // DNA-4: defensive archetype + archetype_type lookup.
    // Normalise key to lowercase so legacy Title-Case localStorage shapes
    // resolve. Surface lookup failures rather than silently nulling.
    const rawArchetype = parsed?.primaryArchetype ?? null;
    const archetypeKey = rawArchetype ? String(rawArchetype).toLowerCase().trim() : null;
    const archetypeRecord = archetypeKey
      ? archetypeData[archetypeKey as keyof typeof archetypeData]
      : null;
    const archetypeTypeName = archetypeRecord?.name ?? null;
    const archetypeTypeLookupFailed = !!rawArchetype && !archetypeTypeName;

    if (archetypeTypeLookupFailed) {
      console.warn("[hub-relay] archetype_type lookup failed", {
        ...logMeta,
        rawArchetype,
        archetypeKey,
        knownKeys: Object.keys(archetypeData),
      });
    }

    // DNA-4d: refuse to fire if essential data missing.
    if (!parsed || !rawArchetype) {
      console.error("[hub-relay] refusing to fire — missing assessment data", {
        ...logMeta,
        hasParsed: !!parsed,
        hasArchetype: !!rawArchetype,
      });
      return { ok: false, reason: "missing-assessment-data" } as const;
    }

    const payload = {
      email: candidateEmail,
      first_name: firstName,
      archetype: archetypeKey,
      archetype_type: archetypeTypeName,
      archetype_type_lookup_failed: archetypeTypeLookupFailed,
      scores: dimensionScores,
      dimension_scores: dimensionScores,
      matching_results: matchingResults,
      path,
      candidate_path: localStorage.getItem("beconnect-path") || "growing",
      session_id: getOrCreateSessionId(),
      source: "dna-assessment",
      completed_at: new Date().toISOString(),
    };

    console.log("[hub-relay] attempt", {
      ...logMeta,
      dimension_count: dimensionScores ? Object.keys(dimensionScores).length : 0,
      archetype: archetypeKey,
      archetype_type: archetypeTypeName,
    });
    supabase.functions
      .invoke("hub-relay", { body: payload })
      .then(({ data, error }) => {
        if (error) {
          console.warn("[hub-relay] failed", { ...logMeta, error: error.message ?? String(error) });
        } else {
          console.log("[hub-relay] success", { ...logMeta, status: (data as any)?.hubStatus ?? 200, response: data });
        }
      })
      .catch((err) => {
        console.warn("[hub-relay] threw", { ...logMeta, error: err instanceof Error ? err.message : String(err) });
      });
    return { ok: true } as const;
  } catch (err) {
    console.warn("[hub-relay] payload build error", { ...logMeta, error: err instanceof Error ? err.message : String(err) });
    return { ok: false, reason: "build-error" } as const;
  }
}
import ScrollRevealSection from "./ScrollRevealSection";

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

    // Single canonicalisation point per A6 — extract once, use everywhere.
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
          supabase
            .rpc("update_dna_participant", {
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

      // Fire reveal-email-captured webhook to the Hub (Email #1 trigger).
      // Non-blocking — candidate proceeds regardless of outcome.
      fireRevealEmailCaptured({
        assessmentId: storage.getAssessmentId(),
        email: normalisedEmail,
        firstName: firstName.trim(),
        lastName: localStorage.getItem("beconnect-lastname") || "",
        archetype: result.primaryArchetype,
        path: localStorage.getItem("beconnect-path") || "growing",
      });

      // Fire hub-relay in background — never blocks UI
      fireHubRelay(normalisedEmail);

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
            Next step — build your career map →
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
