// Hub outbox worker: drains pending hub_outbox rows with exponential backoff.
// Cron-triggered every minute. Idempotent. Dead-letters after ~24h.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HUB_WEBHOOK_URL = "https://buriwmeuvujisgmqnpjr.supabase.co/functions/v1/dna-webhook";
const BATCH_SIZE = 25;
const DEAD_AFTER_MS = 24 * 60 * 60 * 1000; // 24h

// Backoff schedule (minutes) by attempt count
const BACKOFF_MIN = [1, 5, 15, 60, 240, 720];

function nextDelayMs(attempts: number): number {
  const idx = Math.min(attempts, BACKOFF_MIN.length - 1);
  return BACKOFF_MIN[idx] * 60_000;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const sharedSecret = Deno.env.get("DNA_REVEAL_WEBHOOK_SECRET");
  if (!sharedSecret) {
    return new Response(JSON.stringify({ error: "missing DNA_REVEAL_WEBHOOK_SECRET" }), {
      status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Claim a batch atomically (status -> in_flight)
  const { data: claimed, error: claimErr } = await supabase
    .from("hub_outbox")
    .select("id, assessment_id, email, payload, attempts, first_attempt_at, created_at")
    .eq("status", "pending")
    .lte("next_attempt_at", new Date().toISOString())
    .order("next_attempt_at", { ascending: true })
    .limit(BATCH_SIZE);

  if (claimErr) {
    console.error("[hub-outbox-worker] claim error:", claimErr);
    return new Response(JSON.stringify({ error: claimErr.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!claimed || claimed.length === 0) {
    return new Response(JSON.stringify({ processed: 0 }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ids = claimed.map((r) => r.id);
  await supabase.from("hub_outbox")
    .update({ status: "in_flight", last_attempt_at: new Date().toISOString() })
    .in("id", ids);

  let delivered = 0, failed = 0, dead = 0;

  for (const row of claimed) {
    const firstAttempt = row.first_attempt_at ?? row.created_at;
    const ageMs = Date.now() - new Date(firstAttempt).getTime();
    const nextAttempts = (row.attempts ?? 0) + 1;

    try {
      const resp = await fetch(HUB_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-dna-secret": sharedSecret },
        body: JSON.stringify(row.payload),
      });
      const body = await resp.text();

      await supabase.from("audit_log").insert({
        event_type: "hub_outbox_attempt",
        target_type: "hub_outbox",
        target_id: row.id,
        metadata: {
          status_code: resp.status,
          attempts: nextAttempts,
          assessment_id: row.assessment_id,
          email: row.email,
          ok: resp.ok,
          body_preview: body.slice(0, 300),
        } as any,
      });

      if (resp.ok) {
        await supabase.from("hub_outbox").update({
          status: "delivered",
          attempts: nextAttempts,
          delivered_at: new Date().toISOString(),
          last_error: null,
          first_attempt_at: row.first_attempt_at ?? firstAttempt,
        }).eq("id", row.id);

        await supabase.from("funnel_events").insert({
          session_id: row.assessment_id,
          email: row.email,
          event_name: "hub_delivery_succeeded",
          metadata: { attempts: nextAttempts } as any,
        });
        delivered++;
      } else {
        throw new Error(`Hub ${resp.status}: ${body.slice(0, 200)}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      // Dead-letter rules:
      //   1. row has been retrying for >= 24h (DEAD_AFTER_MS), OR
      //   2. row has no email AND has failed >= 5 times — these historic
      //      email-less rows can never satisfy Hub's `email required` check,
      //      so they would otherwise loop on backoff for the full 24h window.
      const noEmailGiveUp = (!row.email || String(row.email).trim() === "") && nextAttempts >= 5;
      const shouldDeadLetter = ageMs >= DEAD_AFTER_MS || noEmailGiveUp;
      const newStatus = shouldDeadLetter ? "dead" : "pending";

      await supabase.from("hub_outbox").update({
        status: newStatus,
        attempts: nextAttempts,
        last_error: msg,
        next_attempt_at: new Date(Date.now() + nextDelayMs(nextAttempts)).toISOString(),
        first_attempt_at: row.first_attempt_at ?? firstAttempt,
      }).eq("id", row.id);

      if (shouldDeadLetter) {
        dead++;
        await supabase.from("audit_log").insert({
          event_type: "hub_outbox_dead_letter",
          target_type: "hub_outbox",
          target_id: row.id,
          metadata: {
            assessment_id: row.assessment_id, email: row.email,
            attempts: nextAttempts, last_error: msg,
            reason: noEmailGiveUp ? "no_email_after_5_attempts" : "age_24h",
          } as any,
        });
        await supabase.from("funnel_events").insert({
          session_id: row.assessment_id,
          email: row.email,
          event_name: "hub_delivery_dead",
          metadata: {
            attempts: nextAttempts,
            error: msg,
            reason: noEmailGiveUp ? "no_email_after_5_attempts" : "age_24h",
          } as any,
        });
      } else {
        failed++;
      }
    }
  }

  return new Response(
    JSON.stringify({ processed: claimed.length, delivered, failed, dead }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
