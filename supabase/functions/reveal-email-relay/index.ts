import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const HUB_REVEAL_URL =
  "https://buriwmeuvujisgmqnpjr.supabase.co/functions/v1/dna-reveal-email-captured";

/**
 * Server-side proxy for the Hub's dna-reveal-email-captured webhook.
 * Reads DNA_REVEAL_WEBHOOK_SECRET at invocation time and attaches it
 * as the x-be-connect-secret header. If the secret is missing, the
 * request is NOT forwarded — we don't want to send bare requests to
 * a Hub that's expecting auth (would create noisy 401s on the Hub side).
 *
 * Non-blocking from the client's perspective — the client fires this
 * fire-and-forget and never gates the candidate's reveal flow on the
 * response.
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ts = new Date().toISOString();
  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch (err) {
    console.error("[reveal-email-relay] invalid JSON body", {
      timestamp: ts,
      error: err instanceof Error ? err.message : String(err),
    });
    return new Response(
      JSON.stringify({ error: "invalid_json" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const assessmentId = (payload.assessment_id as string) ?? null;
  // Boundary normalisation: canonicalise inbound email immediately on receipt.
  const rawEmail = payload.email;
  const email = rawEmail ? String(rawEmail).toLowerCase().trim() : null;
  if (email !== null) {
    payload.email = email;
  }
  const secret = Deno.env.get("DNA_REVEAL_WEBHOOK_SECRET");

  if (!secret) {
    console.error("[reveal-email-relay] DNA_REVEAL_WEBHOOK_SECRET missing — skipping forward", {
      timestamp: ts,
      assessment_id: assessmentId,
      email,
      reason: "secret missing",
    });
    return new Response(
      JSON.stringify({ skipped: true, reason: "secret_missing" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  console.log("[reveal-email-relay] forwarding to Hub", {
    timestamp: ts,
    assessment_id: assessmentId,
    email,
  });

  try {
    const res = await fetch(HUB_REVEAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Header renamed from x-be-connect-secret per Fix-B (28 April 2026); secret env variable DNA_REVEAL_WEBHOOK_SECRET unchanged
        "x-dna-secret": secret,
      },
      body: JSON.stringify(payload),
    });

    const body = await res.text();
    if (res.ok) {
      console.log("[reveal-email-relay] success", {
        timestamp: ts,
        assessment_id: assessmentId,
        email,
        status: res.status,
      });
    } else {
      console.warn("[reveal-email-relay] Hub responded with error", {
        timestamp: ts,
        assessment_id: assessmentId,
        email,
        status: res.status,
        body,
      });
    }

    return new Response(
      JSON.stringify({ hubStatus: res.status, hubBody: body }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[reveal-email-relay] forward threw", {
      timestamp: ts,
      assessment_id: assessmentId,
      email,
      error: err instanceof Error ? err.message : String(err),
    });
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
