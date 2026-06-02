// Funnel ingest: validates and inserts a single funnel event.
// No JWT required (anon clients call this); RLS on funnel_events still applies.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_EVENTS = new Set([
  "assessment_started",
  "chapter_completed",
  "ethics_shown",
  "ethics_signed",
  "video_shown",
  "video_recorded",
  "video_skipped",
  "assessment_completed",
  "results_viewed",
  "hub_delivery_succeeded",
  "hub_delivery_dead",
  "autosave_synced",
  "resume_link_requested",
  "resume_link_used",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const session_id = typeof body?.session_id === "string" ? body.session_id.trim() : "";
  const event_name = typeof body?.event_name === "string" ? body.event_name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.toLowerCase().trim() : null;
  const metadata = body?.metadata && typeof body.metadata === "object" ? body.metadata : {};

  if (!session_id || !event_name) {
    return new Response(JSON.stringify({ error: "session_id and event_name required" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!ALLOWED_EVENTS.has(event_name)) {
    return new Response(JSON.stringify({ error: `unknown event_name: ${event_name}` }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await supabase.from("funnel_events").insert({
    session_id, email, event_name, metadata,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
