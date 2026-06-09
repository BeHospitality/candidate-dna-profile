import { supabase } from "@/integrations/supabase/client";
import { storage } from "@/lib/storage";
import { archetypeData } from "@/lib/archetypes";
import { invokeSecureRpc } from "@/lib/secureRpc";
import { track } from "@/lib/funnel";
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
 * FIX 3, Fire hub-relay immediately after persistAssessment succeeds in
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

    console.log("[hub-relay:reveal] enqueue", logMeta);

    // Durable outbox: write once, retry worker delivers. Replaces the prior
    // fire-and-forget direct invoke that silently lost rows on network blips
    // (the "DNA PRE-FIX" cohort). See migration: public.hub_outbox.
    // Proof token = the response_proof written into assessments.token at
    // persistAssessment time (entryInfo.token || beconnect-session-id).
    // Server-side secure-rpc verifies this matches assessments.token, so
    // only the candidate that actually inserted the row can enqueue for it.
    const assessmentToken =
      entryInfo.token ||
      localStorage.getItem("beconnect-session-id") ||
      "";

    invokeSecureRpc("enqueue_hub_outbox", {
      p_assessment_id: args.assessmentId,
      p_assessment_token: assessmentToken,
      p_email: email,
      p_payload: payload,
    })
      .then(({ data, error }) => {
        if (error) {
          console.warn("[hub-relay:reveal] enqueue failed", { ...logMeta, error: error.message });
          return;
        }
        console.log("[hub-relay:reveal] enqueued", { ...logMeta, outbox_id: data });
        // SYNC FLUSH: kick the worker NOW so the Hub's candidate_memory is
        // updated before the 15s concierge auto-return fires. Without this,
        // the cron tick (lag 7-53s, median ~22s) would race the redirect
        // and returning candidates could land back on "start your DNA".
        // Cron remains as a safety net for failed kicks.
        supabase.functions.invoke("hub-outbox-worker", { body: {} })
          .then(({ data: flushData, error: flushErr }) => {
            if (flushErr) {
              console.warn("[hub-relay:reveal] worker flush failed", { ...logMeta, error: flushErr.message });
            } else {
              console.log("[hub-relay:reveal] worker flushed", { ...logMeta, ...flushData });
            }
          })
          .catch((err) => {
            console.warn("[hub-relay:reveal] worker flush threw", {
              ...logMeta,
              error: err instanceof Error ? err.message : String(err),
            });
          });
      })
      .catch((err) => {
        console.warn("[hub-relay:reveal] enqueue threw", {
          ...logMeta,
          error: err instanceof Error ? err.message : String(err),
        });
      });

    // PORTAL SYNC: in addition to the Hub path above, write the archetype
    // directly into the Portal's candidate_memory (separate Supabase project)
    // so connect.be.ie /resume + concierge recognise the DNA as done.
    // Synchronous-ish (fire-and-forget Promise, server has 4s timeout + 1 retry)
    // so it completes well within the 15s auto-return grace.
    if (email) {
      const portalPayload = {
        email,
        archetype: archetypeKey,
        first_name: firstName,
        last_name: localStorage.getItem("beconnect-lastname") || null,
        assessment_id: args.assessmentId,
        completed_at: new Date().toISOString(),
      };
      supabase.functions.invoke("portal-sync", { body: portalPayload })
        .then(({ data: portalData, error: portalErr }) => {
          if (portalErr) {
            console.warn("[portal-sync:reveal] failed", { ...logMeta, error: portalErr.message });
          } else {
            console.log("[portal-sync:reveal] ok", { ...logMeta, ...(portalData ?? {}) });
          }
        })
        .catch((err) => {
          console.warn("[portal-sync:reveal] threw", {
            ...logMeta,
            error: err instanceof Error ? err.message : String(err),
          });
        });
    } else {
      console.log("[portal-sync:reveal] skipped, no email", logMeta);
    }

      .catch((err) => {
        console.warn("[hub-relay:reveal] enqueue threw", {
          ...logMeta,
          error: err instanceof Error ? err.message : String(err),
        });
      });

    track("assessment_completed", { assessment_id: args.assessmentId, archetype: archetypeKey });
  } catch (err) {
    console.warn("[hub-relay:reveal] build error", err);
  }
}

/**
 * FIX 2, Log a persist failure to audit_log so we have forensic
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
