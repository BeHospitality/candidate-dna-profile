/**
 * Hub Integration — Sends DNA assessment results to the Hub webhook
 *
 * The Hub is a separate project used by Charter Partner managers.
 * When a candidate completes the DNA assessment, we send their results
 * so the Hub can display archetype badges, power buddy matching,
 * and calculate placement risk.
 *
 * This ONLY fires for 'candidate' and 'team' entry modes.
 * Public assessments (general visitors) do NOT send to Hub.
 */

const HUB_WEBHOOK_URL =
  "https://buriwmeuvujisgmqnpjr.supabase.co/functions/v1/dna-webhook";

const PENDING_KEY = "dna_hub_pending";

export interface HubWebhookPayload {
  assessment_id: string;
  candidate_email: string;
  archetype: string;
  dimension_scores: Record<string, number>;
  experience_path?: string;
}

export async function sendResultsToHub(
  payload: HubWebhookPayload
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(HUB_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "[Hub Integration] Webhook failed:",
        response.status,
        errorText
      );
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    console.log("[Hub Integration] Results sent successfully");
    return { success: true };
  } catch (error) {
    console.error("[Hub Integration] Network error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/** Store a failed payload for retry on next app load */
export function storePendingPayload(payload: HubWebhookPayload): void {
  localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
}

/** Clear any pending payload after successful send */
export function clearPendingPayload(): void {
  localStorage.removeItem(PENDING_KEY);
}

/** Retry any pending payload from a previous failed attempt */
export async function retryPendingPayload(): Promise<void> {
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return;

  try {
    const payload: HubWebhookPayload = JSON.parse(raw);
    const result = await sendResultsToHub(payload);
    if (result.success) {
      clearPendingPayload();
      console.log(
        "[Hub Integration] Retry successful — pending payload sent"
      );
    }
  } catch {
    // Corrupted localStorage, clear it
    clearPendingPayload();
  }
}
