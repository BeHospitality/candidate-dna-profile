// Hub outbox backfill (one-shot, admin-callable).
// Auth: caller must send `x-admin-secret: <DNA_OUTBOUND_SECRET>`.
// Effect: for every assessments row without a delivered/pending outbox row,
// rebuild the Hub payload and enqueue it. The worker picks them up.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const adminSecret = Deno.env.get("DNA_OUTBOUND_SECRET");
  if (!adminSecret || req.headers.get("x-admin-secret") !== adminSecret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "500", 10) || 500, 2000);

  const { data: rows, error } = await supabase.rpc("list_undelivered_assessments", { p_limit: limit });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let enqueued = 0;
  for (const r of rows ?? []) {
    const payload = {
      email: r.email ? String(r.email).toLowerCase().trim() : null,
      first_name: r.first_name ?? null,
      archetype: r.archetype,
      archetype_type: null,
      archetype_type_lookup_failed: true,
      scores: r.dimension_scores ?? r.comprehensive_scores ?? null,
      dimension_scores: r.dimension_scores ?? r.comprehensive_scores ?? null,
      matching_results: {
        sector: r.sector_matches ?? [],
        geography: r.geography_matches ?? [],
        department: r.department_matches ?? [],
      },
      path: r.assessment_path ?? null,
      candidate_path: r.assessment_path ?? "growing",
      session_id: r.assessment_id,
      assessment_id: r.assessment_id,
      source: "dna-assessment-backfill",
      completed_at: r.completed_at,
    };

    const { error: enqErr } = await supabase.rpc("enqueue_hub_outbox", {
      p_assessment_id: r.assessment_id,
      p_email: payload.email,
      p_payload: payload,
    });
    if (!enqErr) enqueued++;
  }

  await supabase.from("audit_log").insert({
    event_type: "hub_outbox_backfill_run",
    metadata: { scanned: rows?.length ?? 0, enqueued } as any,
  });

  return new Response(JSON.stringify({ scanned: rows?.length ?? 0, enqueued }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
