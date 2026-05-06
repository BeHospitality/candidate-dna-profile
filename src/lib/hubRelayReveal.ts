import { supabase } from "@/integrations/supabase/client";
import { storage } from "@/lib/storage";
import { archetypeData } from "@/lib/archetypes";
import type { AssessmentResult, ComprehensiveScores } from "@/lib/scoring";

function getOrCreateSessionId(): string {
  let sid = localStorage.getItem("beconnect-session-id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("beconnect-session-id", sid);
  }
  return sid;
}

/**
 * FIX 3 — Fire hub-relay immediately after persistAssessment succeeds in
 * ArchetypeReveal. This makes Hub aware of every completed assessment,
 * not only those who later submit the SaveDNAPanel form.
 *
 * Idempotency: SaveDNAPanel still fires its own hub-relay on form submit.
 * Hub upserts on email + assessment_id, so a duplicate fire is safe.
 */
export function fireHubRelayReveal(args: {
  assessmentId: string;
  result: AssessmentResult;
  comprehensive: ComprehensiveScores | null;
  matchingResults: any;
  experiencePath: string;
}) {
  try {
    const entryInfo = storage.getEntryMode();
    const emailRaw = entryInfo.candidateEmail || localStorage.getItem("beconnect-email") || "";
    const email = emailRaw ? String(emailRaw).toLowerCase().trim() : null;
    const firstName =
      localStorage.getItem("beconnect-firstname") ||
      localStorage.getItem("beconnect-candidate-name") ||
      entryInfo.candidateName?.split(" ")[0] ||
      null;

    const rawArchetype = args.result.primaryArchetype;
    const archetypeKey = String(rawArchetype).toLowerCase().trim();
    const archetypeRecord = archetypeData[archetypeKey as keyof typeof archetypeData];
    const archetypeTypeName = archetypeRecord?.name ?? null;
    const archetypeTypeLookupFailed = !archetypeTypeName;

    const dimensionScores =
      (args.comprehensive as unknown as Record<string, number>) ||
      (args.result.scores as unknown as Record<string, number>) ||
      null;

    const payload = {
      email,
      first_name: firstName,
      archetype: archetypeKey,
      archetype_type: archetypeTypeName,
      archetype_type_lookup_failed: archetypeTypeLookupFailed,
      scores: dimensionScores,
      dimension_scores: dimensionScores,
      matching_results: args.matchingResults,
      path: localStorage.getItem("beconnect-path") || args.experiencePath || null,
      candidate_path: localStorage.getItem("beconnect-path") || "growing",
      session_id: getOrCreateSessionId(),
      assessment_id: args.assessmentId,
      source: "dna-assessment-reveal",
      completed_at: new Date().toISOString(),
    };

    const logMeta = {
      assessment_id: args.assessmentId,
      email,
      archetype: archetypeKey,
      dimension_count: dimensionScores ? Object.keys(dimensionScores).length : 0,
    };

    console.log("[hub-relay:reveal] attempt", logMeta);
    supabase.functions
      .invoke("hub-relay", { body: payload })
      .then(({ data, error }) => {
        if (error) {
          console.warn("[hub-relay:reveal] failed", { ...logMeta, error: error.message ?? String(error) });
        } else {
          console.log("[hub-relay:reveal] success", { ...logMeta, status: (data as any)?.hubStatus ?? 200 });
        }
      })
      .catch((err) => {
        console.warn("[hub-relay:reveal] threw", {
          ...logMeta,
          error: err instanceof Error ? err.message : String(err),
        });
      });
  } catch (err) {
    console.warn("[hub-relay:reveal] build error", err);
  }
}

/**
 * FIX 2 — Log a persist failure to audit_log so we have forensic
 * visibility without depending on user-reported devtools captures.
 */
export async function logPersistFailure(err: unknown) {
  try {
    const entryInfo = storage.getEntryMode();
    const email =
      entryInfo.candidateEmail ||
      localStorage.getItem("beconnect-email") ||
      null;
    const sessionId = (() => {
      let sid = localStorage.getItem("beconnect-session-id");
      if (!sid) {
        sid = crypto.randomUUID();
        localStorage.setItem("beconnect-session-id", sid);
      }
      return sid;
    })();

    await supabase.from("audit_log").insert({
      event_type: "assessment_persist_failed",
      target_type: "assessment",
      metadata: {
        email: email ? String(email).toLowerCase().trim() : null,
        session_id: sessionId,
        path: localStorage.getItem("beconnect-path") || null,
        experience_path: storage.getExperiencePath() || null,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : String(err),
      } as any,
    });
  } catch (logErr) {
    console.error("[persist] failed to write audit log", logErr);
  }
}
