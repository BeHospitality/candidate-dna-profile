// DEPRECATED 2026-06-03.
// Hub delivery is now done exclusively via the durable hub_outbox queue
// (enqueue_hub_outbox RPC → hub-outbox-worker cron). This open relay used to
// accept any browser POST and forward it to Hub with the outbound secret —
// which meant anyone could inject fake assessments. It is now retired.
//
// We keep the function deployed but it returns 410 Gone for ALL callers so
// any stale client code surfaces loudly rather than silently writing garbage.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-dna-secret",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  console.warn("[hub-relay] called after deprecation", {
    timestamp: new Date().toISOString(),
    method: req.method,
    ua: req.headers.get("user-agent"),
  });
  return new Response(
    JSON.stringify({
      error: "gone",
      message: "hub-relay is deprecated. Hub delivery is now via the durable hub_outbox queue.",
    }),
    { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
