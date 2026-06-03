// Admin-only outbox monitor. Gated by x-admin-secret == DNA_OUTBOUND_SECRET.
// Returns 24h aggregate counts + recent rows (no payload bodies, no PII beyond email).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const adminSecret = Deno.env.get("DNA_OUTBOUND_SECRET");
  if (!adminSecret || req.headers.get("x-admin-secret") !== adminSecret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: rows, error } = await supabase
    .from("hub_outbox")
    .select(
      "id, assessment_id, email, status, attempts, last_error, next_attempt_at, last_attempt_at, delivered_at, first_attempt_at, created_at",
    )
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const counts = { delivered: 0, pending: 0, in_flight: 0, dead: 0 };
  let totalAttempts = 0;
  const failureReasons: Record<string, number> = {};

  for (const r of rows ?? []) {
    counts[r.status as keyof typeof counts] =
      (counts[r.status as keyof typeof counts] ?? 0) + 1;
    totalAttempts += r.attempts ?? 0;
    if (r.last_error && r.status !== "delivered") {
      const key = r.last_error.slice(0, 160);
      failureReasons[key] = (failureReasons[key] ?? 0) + 1;
    }
  }

  return new Response(
    JSON.stringify({
      window: "last_24h",
      generated_at: new Date().toISOString(),
      counts,
      total_attempts: totalAttempts,
      failure_reasons: Object.entries(failureReasons)
        .sort((a, b) => b[1] - a[1])
        .map(([reason, count]) => ({ reason, count })),
      rows: rows ?? [],
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
