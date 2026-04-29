import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const HUB_WEBHOOK_URL =
  "https://buriwmeuvujisgmqnpjr.supabase.co/functions/v1/dna-webhook";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Read shared secret server-side. Per Stage 7B (Q1 confirmation):
  // reuse the existing DNA_REVEAL_WEBHOOK_SECRET — the same value
  // protects both inbound endpoints on Hub (dna-webhook and
  // dna-reveal-email-captured). Do NOT introduce a separate
  // DNA_INBOUND_SECRET env var.
  const sharedSecret = Deno.env.get("DNA_REVEAL_WEBHOOK_SECRET");
  if (!sharedSecret) {
    console.error("[hub-relay] DNA_REVEAL_WEBHOOK_SECRET is not set — refusing to forward unauthenticated POST to Hub");
    return new Response(
      JSON.stringify({
        skipped: true,
        reason: "missing_shared_secret",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const payload = await req.json();
    console.log("[hub-relay] Forwarding payload to Hub:", JSON.stringify(payload));

    const response = await fetch(HUB_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-dna-secret": sharedSecret,
      },
      body: JSON.stringify(payload),
    });

    const body = await response.text();
    console.log("[hub-relay] Hub response:", response.status, body);

    return new Response(
      JSON.stringify({ hubStatus: response.status, hubBody: body }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[hub-relay] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
