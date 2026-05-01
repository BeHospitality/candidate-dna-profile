import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-dna-outbound-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Constant-time string comparison to prevent timing attacks on the
 * shared-secret check. Returns false immediately on length mismatch
 * (length is not itself secret in this protocol).
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * assessments-by-email
 *
 * Read-only endpoint exposed to the Hub project for backfill of
 * dimension scores that were lost by the pre-Stage-7B wrong-key bug.
 *
 * Auth: shared secret in `x-dna-outbound-secret` header, validated
 * against the DNA_OUTBOUND_SECRET env var with a constant-time compare.
 *
 * Behaviour: for each requested email, look up the most recent
 * dna_participants row, join to its assessment, and return the
 * scoring payload using LOWERCASE dimension keys (native DNA app
 * shape). The Hub-side caller is responsible for any Title-Case
 * normalisation at its own boundary.
 *
 * Strictly SELECT-only. No writes to any table.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ts = new Date().toISOString();

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "method_not_allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const expectedSecret = Deno.env.get("DNA_OUTBOUND_SECRET");
  if (!expectedSecret) {
    console.error("[assessments-by-email] DNA_OUTBOUND_SECRET not configured", { timestamp: ts });
    return new Response(
      JSON.stringify({ error: "server_misconfigured" }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const providedSecret = req.headers.get("x-dna-outbound-secret") ?? "";
  if (!providedSecret || !timingSafeEqual(providedSecret, expectedSecret)) {
    console.warn("[assessments-by-email] auth rejected", {
      timestamp: ts,
      had_header: providedSecret.length > 0,
    });
    return new Response(
      JSON.stringify({ error: "unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  let body: { emails?: unknown };
  try {
    body = await req.json();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "invalid_json" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!Array.isArray(body.emails) || body.emails.length === 0) {
    return new Response(
      JSON.stringify({ error: "emails_required", detail: "POST { emails: string[] }" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
  if (body.emails.length > 500) {
    return new Response(
      JSON.stringify({ error: "too_many_emails", max: 500 }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Canonicalise emails the same way they're stored (lower + trim).
  const emails: string[] = Array.from(
    new Set(
      body.emails
        .filter((e): e is string => typeof e === "string")
        .map((e) => e.toLowerCase().trim())
        .filter((e) => e.length > 0)
    )
  );

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  // Fetch all participant rows for the requested emails in one query.
  const { data: participants, error: pErr } = await supabase
    .from("dna_participants")
    .select("email, assessment_id, completed_at, created_at")
    .in("email", emails);

  if (pErr) {
    console.error("[assessments-by-email] participants query failed", {
      timestamp: ts,
      error: pErr.message,
    });
    return new Response(
      JSON.stringify({ error: "query_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Pick the most recent participant row per email that has an assessment_id.
  const bestByEmail = new Map<string, { assessment_id: string; ts: number }>();
  for (const p of participants ?? []) {
    if (!p.assessment_id) continue;
    const candidateTs = new Date(p.completed_at ?? p.created_at ?? 0).getTime();
    const existing = bestByEmail.get(p.email);
    if (!existing || candidateTs > existing.ts) {
      bestByEmail.set(p.email, { assessment_id: p.assessment_id, ts: candidateTs });
    }
  }

  const assessmentIds = Array.from(new Set(Array.from(bestByEmail.values()).map((v) => v.assessment_id)));

  // Fetch the assessment rows for those ids.
  let assessmentsById = new Map<string, any>();
  if (assessmentIds.length > 0) {
    const { data: assessments, error: aErr } = await supabase
      .from("assessments")
      .select("id, archetype, dimension_scores, comprehensive_scores, completed_at")
      .in("id", assessmentIds);

    if (aErr) {
      console.error("[assessments-by-email] assessments query failed", {
        timestamp: ts,
        error: aErr.message,
      });
      return new Response(
        JSON.stringify({ error: "query_failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    for (const a of assessments ?? []) assessmentsById.set(a.id, a);
  }

  const results: Array<Record<string, unknown>> = [];
  const missing: string[] = [];

  for (const email of emails) {
    const link = bestByEmail.get(email);
    const assessment = link ? assessmentsById.get(link.assessment_id) : null;
    if (!link || !assessment || !assessment.completed_at) {
      missing.push(email);
      continue;
    }
    results.push({
      email,
      dimension_scores: assessment.dimension_scores ?? null,
      comprehensive_scores: assessment.comprehensive_scores ?? null,
      archetype: assessment.archetype ?? null,
      completed_at: assessment.completed_at,
      assessment_id: assessment.id,
    });
  }

  // Best-effort audit: log call metadata only (NEVER the email list).
  try {
    await supabase.from("audit_log").insert({
      event_type: "assessments_by_email_request",
      target_type: "assessment_backfill",
      metadata: {
        source: "hub_backfill",
        requested_count: emails.length,
        matched_count: results.length,
        missing_count: missing.length,
      },
    });
  } catch (auditErr) {
    console.warn("[assessments-by-email] audit_log insert failed (non-fatal)", {
      timestamp: ts,
      error: auditErr instanceof Error ? auditErr.message : String(auditErr),
    });
  }

  console.log("[assessments-by-email] served", {
    timestamp: ts,
    requested: emails.length,
    matched: results.length,
    missing: missing.length,
  });

  return new Response(
    JSON.stringify({ results, missing }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
