import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-dna-connect-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function sha256Hex(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * verify-assessment
 *
 * Read-only endpoint exposed to the CONNECT project for ethics-gating
 * verification of a single (email, assessment_id) pair.
 *
 * Auth: shared secret in `x-dna-connect-secret` header, validated against
 * the DNA_CONNECT_SECRET env var with a constant-time compare.
 *
 * Strictly SELECT-only against assessments + dna_participants. Writes one
 * audit_log row per call (success or not-verified) with email_hash only.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ts = new Date().toISOString();

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" });
  }

  const expectedSecret = Deno.env.get("DNA_CONNECT_SECRET");
  if (!expectedSecret) {
    console.error("[verify-assessment] DNA_CONNECT_SECRET not configured", {
      timestamp: ts,
    });
    return jsonResponse(503, { error: "server_misconfigured" });
  }

  const providedSecret = req.headers.get("x-dna-connect-secret") ?? "";
  if (!providedSecret || !timingSafeEqual(providedSecret, expectedSecret)) {
    console.warn("[verify-assessment] auth rejected", {
      timestamp: ts,
      had_header: providedSecret.length > 0,
    });
    return jsonResponse(401, { error: "unauthorized" });
  }

  let body: { email?: unknown; assessment_id?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: "invalid_json" });
  }

  const rawEmail = typeof body.email === "string" ? body.email : "";
  const rawId =
    typeof body.assessment_id === "string" ? body.assessment_id : "";

  if (!rawEmail || !rawId) {
    return jsonResponse(400, { error: "missing_required_fields" });
  }
  if (!UUID_RE.test(rawId)) {
    return jsonResponse(400, { error: "invalid_assessment_id_format" });
  }

  const email = rawEmail.toLowerCase().trim();
  const assessmentId = rawId.toLowerCase();
  const emailHash = await sha256Hex(email);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // 1) Look up the assessment row by id.
  const { data: assessment, error: aErr } = await supabase
    .from("assessments")
    .select("id, archetype, completed_at")
    .eq("id", assessmentId)
    .maybeSingle();

  if (aErr) {
    console.error("[verify-assessment] assessment query failed", {
      timestamp: ts,
      error: aErr.message,
    });
    return jsonResponse(500, { error: "query_failed" });
  }

  let verified = false;
  let reason: string | null = null;
  let completedAt: string | null = null;
  let archetype: string | null = null;

  if (!assessment) {
    reason = "assessment_not_found";
  } else {
    // 2) Check that a participant row links this assessment_id to this email.
    //    Same join pattern as assessments-by-email (dna_participants.assessment_id is text).
    const { data: participants, error: pErr } = await supabase
      .from("dna_participants")
      .select("email, assessment_id")
      .eq("assessment_id", assessmentId);

    if (pErr) {
      console.error("[verify-assessment] participants query failed", {
        timestamp: ts,
        error: pErr.message,
      });
      return jsonResponse(500, { error: "query_failed" });
    }

    const emailMatch = (participants ?? []).some(
      (p) => (p.email ?? "").toLowerCase().trim() === email,
    );

    if (!emailMatch) {
      reason = "email_mismatch";
    } else if (!assessment.completed_at) {
      reason = "not_completed";
    } else {
      verified = true;
      completedAt = assessment.completed_at as string;
      archetype = (assessment.archetype as string) ?? null;
    }
  }

  // Best-effort audit log; never includes raw email or secret.
  try {
    await supabase.from("audit_log").insert({
      event_type: "verify_assessment_request",
      target_type: "assessment_verification",
      target_id: assessment?.id ?? null,
      metadata: {
        source: "connect_ethics",
        email_hash: emailHash,
        assessment_id: assessmentId,
        verified,
        reason,
        ts,
      },
    });
  } catch (auditErr) {
    console.warn("[verify-assessment] audit_log insert failed (non-fatal)", {
      timestamp: ts,
      error: auditErr instanceof Error ? auditErr.message : String(auditErr),
    });
  }

  console.log("[verify-assessment] served", {
    timestamp: ts,
    verified,
    reason,
  });

  if (verified) {
    return jsonResponse(200, {
      verified: true,
      completed_at: completedAt,
      archetype,
    });
  }
  return jsonResponse(200, { verified: false, reason });
});
