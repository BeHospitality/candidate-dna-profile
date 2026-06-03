// Video reminder worker: hourly cron. Finds participants who skipped the video
// and sends warm reminder emails at 48h and 7d via Brevo.
// Stops after the 7-day final nudge.
//
// SECURITY: Requires inbound shared secret (x-dna-secret) matching
// DNA_OUTBOUND_SECRET. Without this, any unauthenticated caller could
// trigger premature 48h/7d nudges and burn the one-shot nudge slots.
// The pg_cron job is configured to send this header.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-dna-secret",
};

const BREVO_API = "https://api.brevo.com/v3/smtp/email";
const SENDER = { name: "Be Connect DNA", email: "dna@be-connect.ie" };

function escHtml(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function emailBody(firstName: string, isFinal: boolean) {
  const name = escHtml(firstName || "there");
  const headline = isFinal
    ? "Your DNA profile is one short video away from complete"
    : "Your profile looks great — add your 60-second intro?";
  const body = isFinal
    ? "This is the last gentle nudge from us. Recording your 60-second intro unlocks the match summaries employers see. Whenever you're ready, your saved progress is here."
    : "Recording a short intro helps the right people see you the way you'd want to be seen. It only takes about a minute, and your profile picks up right where you left off.";
  return `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;background:#f6f7fb;padding:24px;color:#0f1729">
    <div style="max-width:560px;margin:auto;background:#ffffff;border-radius:12px;padding:32px">
      <h1 style="font-size:20px;margin:0 0 12px;color:#0f1729">Hi ${name},</h1>
      <h2 style="font-size:18px;margin:0 0 16px;color:#0f1729;font-weight:600">${escHtml(headline)}</h2>
      <p style="line-height:1.6;color:#374151;margin:0 0 20px">${escHtml(body)}</p>
      <p style="margin:0 0 24px"><a href="https://be-connect-dna.lovable.app/" style="background:#f59e0b;color:#0f1729;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">Add my intro video</a></p>
      <p style="font-size:13px;color:#6b7280;margin:0">No pressure — you can do this whenever you have a moment.</p>
    </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Inbound auth — only the pg_cron job (or an authorised operator) may
  // trigger reminder sends. Without this gate, anyone on the internet
  // could POST to this endpoint and immediately burn the 7d final-nudge
  // slot for every eligible participant.
  const expectedSecret = Deno.env.get("DNA_OUTBOUND_SECRET");
  const providedSecret = req.headers.get("x-dna-secret");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const brevoKey = Deno.env.get("BREVO_API_KEY");
  if (!brevoKey) {
    return new Response(JSON.stringify({ error: "BREVO_API_KEY missing" }), {
      status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const now = Date.now();
  const T48 = new Date(now - 48 * 3600_000).toISOString();
  const T7D = new Date(now - 7 * 24 * 3600_000).toISOString();

  // 48h candidates: skipped > 48h ago, no 48h nudge yet
  const { data: due48 } = await supabase
    .from("dna_participants")
    .select("id, email, first_name, video_skipped_at, video_nudge_48h_at, video_nudge_7d_at")
    .eq("video_status", "skipped_pending")
    .lte("video_skipped_at", T48)
    .is("video_nudge_48h_at", null)
    .limit(50);

  // 7d candidates: skipped > 7d ago, no final nudge yet
  const { data: due7d } = await supabase
    .from("dna_participants")
    .select("id, email, first_name, video_skipped_at, video_nudge_48h_at, video_nudge_7d_at")
    .eq("video_status", "skipped_pending")
    .lte("video_skipped_at", T7D)
    .is("video_nudge_7d_at", null)
    .limit(50);

  async function sendOne(row: any, isFinal: boolean) {
    if (!row?.email) return false;
    try {
      const resp = await fetch(BREVO_API, {
        method: "POST",
        headers: { "api-key": brevoKey, "Content-Type": "application/json", "accept": "application/json" },
        body: JSON.stringify({
          sender: SENDER,
          to: [{ email: row.email, name: row.first_name || undefined }],
          subject: isFinal ? "Your DNA profile, one step away" : "Quick add: your 60-second intro",
          htmlContent: emailBody(row.first_name || "", isFinal),
        }),
      });
      const ok = resp.ok;
      const patch: any = isFinal
        ? { video_nudge_7d_at: new Date().toISOString() }
        : { video_nudge_48h_at: new Date().toISOString() };
      await supabase.from("dna_participants").update(patch).eq("id", row.id);
      await supabase.from("audit_log").insert({
        event_type: "video_reminder_sent",
        target_type: "dna_participant",
        target_id: row.id,
        metadata: { stage: isFinal ? "7d" : "48h", brevo_status: resp.status, ok } as any,
      });
      return ok;
    } catch (err) {
      console.error("[video-reminder] send error", err);
      return false;
    }
  }

  let sent = 0;
  for (const r of due48 ?? []) if (await sendOne(r, false)) sent++;
  for (const r of due7d ?? []) if (await sendOne(r, true)) sent++;

  return new Response(JSON.stringify({
    due48: due48?.length ?? 0, due7d: due7d?.length ?? 0, sent,
  }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
