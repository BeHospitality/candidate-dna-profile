import { supabase } from "@/integrations/supabase/client";

type SecureRpcAction =
  | "get_assessment_by_id"
  | "get_dna_candidate_by_email"
  | "get_resume_token"
  | "validate_magic_link"
  | "mark_magic_link_used"
  | "mark_resume_token_used"
  | "update_dna_participant"
  | "link_participant_to_assessment"
  | "insert_assessment_responses"
  | "enqueue_hub_outbox"
  | "save_progress"
  | "load_progress"
  | "mark_video_skipped"
  | "mark_video_completed";

export async function invokeSecureRpc<T = unknown>(
  action: SecureRpcAction,
  payload: Record<string, unknown>,
): Promise<{ data: T | null; error: Error | null }> {
  const { data, error } = await supabase.functions.invoke("secure-rpc", {
    body: { action, payload },
  });

  if (error) return { data: null, error };
  if ((data as any)?.error) return { data: null, error: new Error((data as any).error) };

  return { data: ((data as any)?.data ?? null) as T | null, error: null };
}