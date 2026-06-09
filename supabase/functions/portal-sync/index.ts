import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PORTAL_URL = "https://xctvbnccqqvviycsuygu.supabase.co/functions/v1/ingest-dna-archetype";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function postOnce(payload: Record<string, unknown>, secret: string, timeoutMs: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(PORTAL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-portal-sync-secret": secret,
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    const text = await res.text().catch(() => "");
    return { ok: res.ok, status: res.status, body: text };
  } finally {
    clearTimeout(timer);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  const secret = Deno.env.get("PORTAL_DNA_SYNC_SECRET");
  if (!secret) {
    console.error("[portal-sync] missing PORTAL_DNA_SYNC_SECRET");
    return json(500, { error: "missing_secret" });
  }

  let body: any;
  try { body = await req.json(); } catch { return json(400, { error: "invalid_json" }); }

  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const archetype = typeof body?.archetype === "string" ? body.archetype.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || !archetype) return json(400, { error: "invalid_email_or_archetype" });

  const payload: Record<string, unknown> = {
    email,
    archetype,
    completed_at: typeof body?.completed_at === "string" ? body.completed_at : new Date().toISOString(),
  };
  if (typeof body?.first_name === "string" && body.first_name.trim()) payload.first_name = body.first_name.trim();
  if (typeof body?.last_name === "string" && body.last_name.trim()) payload.last_name = body.last_name.trim();
  if (typeof body?.assessment_id === "string" && body.assessment_id.trim()) payload.assessment_id = body.assessment_id.trim();

  const logMeta = { email, archetype, assessment_id: payload.assessment_id ?? null };

  let last: { ok: boolean; status: number; body: string } | null = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      last = await postOnce(payload, secret, 4000);
      console.log("[portal-sync] attempt", { ...logMeta, attempt, status: last.status, ok: last.ok });
      if (last.ok) return json(200, { ok: true, attempt, portal_status: last.status });
    } catch (err) {
      console.warn("[portal-sync] attempt threw", {
        ...logMeta,
        attempt,
        error: err instanceof Error ? err.message : String(err),
      });
      last = { ok: false, status: 0, body: err instanceof Error ? err.message : String(err) };
    }
  }
  return json(502, { ok: false, portal_status: last?.status ?? 0, error: "portal_unreachable" });
});
