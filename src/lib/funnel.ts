// Lightweight funnel event tracker. Fire-and-forget; never throws to caller.
// Server validates against an allowlist of event names, so typos here become 400s
// (visible in network tab) rather than silent corruption.
import { supabase } from "@/integrations/supabase/client";

export type FunnelEvent =
  | "assessment_started"
  | "chapter_completed"
  | "ethics_shown"
  | "ethics_signed"
  | "video_shown"
  | "video_recorded"
  | "video_skipped"
  | "assessment_completed"
  | "results_viewed"
  | "autosave_synced"
  | "resume_link_requested"
  | "resume_link_used";

function getSessionId(): string {
  let sid = localStorage.getItem("beconnect-session-id");
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem("beconnect-session-id", sid);
  }
  return sid;
}

function getEmail(): string | null {
  const raw = localStorage.getItem("beconnect-email");
  return raw ? raw.toLowerCase().trim() : null;
}

export function track(event: FunnelEvent, metadata: Record<string, unknown> = {}): void {
  try {
    const body = {
      session_id: getSessionId(),
      email: getEmail(),
      event_name: event,
      metadata,
    };
    // Don't await — keep candidate UX zero-latency
    supabase.functions
      .invoke("funnel-ingest", { body })
      .then(({ error }) => {
        if (error) console.warn("[funnel] ingest failed", event, error.message);
      })
      .catch((err) => console.warn("[funnel] threw", event, err));
  } catch (err) {
    console.warn("[funnel] build error", err);
  }
}
