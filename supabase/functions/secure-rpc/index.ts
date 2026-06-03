import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type RpcPayload = Record<string, unknown>;

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function cleanToken(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const token = value.trim();
  return token.length >= 16 && token.length <= 256 ? token : null;
}

function cleanUuid(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const id = value.trim().toLowerCase();
  return UUID_RE.test(id) ? id : null;
}

function cleanEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return EMAIL_RE.test(email) && email.length <= 320 ? email : null;
}

function cleanText(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length > 0 && text.length <= max ? text : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse(405, { error: "method_not_allowed" });

  let body: { action?: unknown; payload?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: "invalid_json" });
  }

  const action = typeof body.action === "string" ? body.action : "";
  const payload: RpcPayload = body.payload && typeof body.payload === "object" ? body.payload as RpcPayload : {};

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  try {
    switch (action) {
      case "get_assessment_by_id": {
        const id = cleanUuid(payload.p_id);
        if (!id) return jsonResponse(400, { error: "invalid_assessment_id" });
        const { data, error } = await supabase.rpc("get_assessment_by_id", { p_id: id });
        if (error) throw error;
        return jsonResponse(200, { data });
      }

      case "get_dna_candidate_by_email": {
        const email = cleanEmail(payload.p_email);
        if (!email) return jsonResponse(400, { error: "invalid_email" });
        const { data, error } = await supabase.rpc("get_dna_candidate_by_email", { p_email: email });
        if (error) throw error;
        return jsonResponse(200, { data });
      }

      case "get_resume_token": {
        const token = cleanToken(payload.p_token);
        if (!token) return jsonResponse(400, { error: "invalid_token" });
        const { data, error } = await supabase.rpc("get_resume_token", { p_token: token });
        if (error) throw error;
        return jsonResponse(200, { data });
      }

      case "validate_magic_link": {
        const token = cleanToken(payload.p_token);
        if (!token) return jsonResponse(400, { error: "invalid_token" });
        const { data, error } = await supabase.rpc("validate_magic_link", { p_token: token });
        if (error) throw error;
        return jsonResponse(200, { data });
      }

      case "mark_magic_link_used": {
        const token = cleanToken(payload.p_token);
        const assessmentId = cleanUuid(payload.p_assessment_id);
        if (!token || !assessmentId) return jsonResponse(400, { error: "invalid_magic_link_update" });
        const { error } = await supabase.rpc("mark_magic_link_used", {
          p_token: token,
          p_assessment_id: assessmentId,
        });
        if (error) throw error;
        return jsonResponse(200, { data: true });
      }

      case "mark_resume_token_used": {
        const token = cleanToken(payload.p_token);
        if (!token) return jsonResponse(400, { error: "invalid_token" });
        const { error } = await supabase.rpc("mark_resume_token_used", { p_token: token });
        if (error) throw error;
        return jsonResponse(200, { data: true });
      }

      case "update_dna_participant": {
        const id = cleanUuid(payload.p_id);
        if (!id) return jsonResponse(400, { error: "invalid_participant_id" });
        const args = {
          p_id: id,
          p_email: payload.p_email == null ? null : cleanEmail(payload.p_email),
          p_phone: payload.p_phone == null ? null : cleanText(payload.p_phone, 40),
          p_first_name: payload.p_first_name == null ? null : cleanText(payload.p_first_name, 120),
          p_last_name: payload.p_last_name == null ? null : cleanText(payload.p_last_name, 120),
          p_country: payload.p_country == null ? null : cleanText(payload.p_country, 120),
          p_role_title: payload.p_role_title == null ? null : cleanText(payload.p_role_title, 160),
          p_referral_source: payload.p_referral_source == null ? null : cleanText(payload.p_referral_source, 160),
          p_assessment_path: payload.p_assessment_path == null ? null : cleanText(payload.p_assessment_path, 80),
          p_assessment_id: payload.p_assessment_id == null ? null : cleanText(payload.p_assessment_id, 80),
          p_completed_at: typeof payload.p_completed_at === "string" ? payload.p_completed_at : null,
          p_gdpr_consent: typeof payload.p_gdpr_consent === "boolean" ? payload.p_gdpr_consent : null,
          p_consent_given_at: typeof payload.p_consent_given_at === "string" ? payload.p_consent_given_at : null,
        };
        const { error } = await supabase.rpc("update_dna_participant", args);
        if (error) throw error;
        return jsonResponse(200, { data: true });
      }

      case "link_participant_to_assessment": {
        const email = cleanEmail(payload.p_email);
        const assessmentId = cleanUuid(payload.p_assessment_id);
        if (!email || !assessmentId) return jsonResponse(400, { error: "invalid_participant_link" });
        const { data, error } = await supabase.rpc("link_participant_to_assessment", {
          p_email: email,
          p_assessment_id: assessmentId,
          p_first_name: payload.p_first_name == null ? null : cleanText(payload.p_first_name, 120),
          p_last_name: payload.p_last_name == null ? null : cleanText(payload.p_last_name, 120),
          p_path: payload.p_path == null ? null : cleanText(payload.p_path, 80),
          p_completed_at: typeof payload.p_completed_at === "string" ? payload.p_completed_at : null,
        });
        if (error) throw error;
        return jsonResponse(200, { data });
      }

      case "insert_assessment_responses": {
        const assessmentId = cleanUuid(payload.p_assessment_id);
        const proof = cleanText(payload.p_response_proof, 256);
        const responses = Array.isArray(payload.p_responses) ? payload.p_responses : [];
        if (!assessmentId || !proof || responses.length === 0 || responses.length > 200) {
          return jsonResponse(400, { error: "invalid_responses" });
        }

        const { data: assessment, error: assessmentError } = await supabase
          .from("assessments")
          .select("id")
          .eq("id", assessmentId)
          .eq("token", proof)
          .maybeSingle();
        if (assessmentError) throw assessmentError;
        if (!assessment) return jsonResponse(403, { error: "response_proof_rejected" });

        const rows = responses.map((row) => {
          const value = row && typeof row === "object" ? row as Record<string, unknown> : {};
          return {
            assessment_id: assessmentId,
            question_id: Number(value.question_id),
            answer: value.answer,
          };
        }).filter((row) => Number.isInteger(row.question_id) && row.question_id > 0);

        if (rows.length !== responses.length) return jsonResponse(400, { error: "invalid_response_rows" });

        const { error } = await supabase.from("assessment_responses").insert(rows);
        if (error) throw error;
        return jsonResponse(200, { data: true });
      }

      case "enqueue_hub_outbox": {
        // SECURITY: bind enqueue to the candidate who actually created the
        // assessment. The caller must present the assessment row's `token`
        // (the same response_proof used by insert_assessment_responses),
        // which only the legitimate browser session that inserted the row
        // knows. This blocks the prior arbitrary-injection vector where an
        // anonymous caller could enqueue any uuid + fabricated payload and
        // have the worker forward it to the Hub with our outbound secret.
        const assessmentId = cleanUuid(payload.p_assessment_id);
        if (!assessmentId) return jsonResponse(400, { error: "invalid_assessment_id" });
        const proof = cleanText(payload.p_assessment_token, 256);
        if (!proof) return jsonResponse(400, { error: "missing_assessment_token" });

        const email = payload.p_email == null ? null : cleanEmail(payload.p_email);
        const p = payload.p_payload;
        if (!p || typeof p !== "object") return jsonResponse(400, { error: "invalid_payload" });

        // Hard size cap (16 KB JSON) to stop abusive bloat.
        let serialised: string;
        try {
          serialised = JSON.stringify(p);
        } catch {
          return jsonResponse(400, { error: "unserialisable_payload" });
        }
        if (serialised.length > 16_384) return jsonResponse(413, { error: "payload_too_large" });

        // Verify assessment exists AND token matches.
        const { data: assessmentRow, error: lookupError } = await supabase
          .from("assessments")
          .select("id")
          .eq("id", assessmentId)
          .eq("token", proof)
          .maybeSingle();
        if (lookupError) throw lookupError;
        if (!assessmentRow) return jsonResponse(403, { error: "assessment_proof_rejected" });

        const { data, error } = await supabase.rpc("enqueue_hub_outbox", {
          p_assessment_id: assessmentId,
          p_email: email,
          p_payload: p as any,
        });
        if (error) throw error;
        return jsonResponse(200, { data });
      }

      case "save_progress": {
        const email = cleanEmail(payload.p_email);
        if (!email) return jsonResponse(400, { error: "invalid_email" });
        const expPath = payload.p_experience_path == null ? null : cleanText(payload.p_experience_path, 40);
        const cur = Number(payload.p_current_question);
        const total = payload.p_total_questions == null ? null : Number(payload.p_total_questions);
        const answers = payload.p_answers && typeof payload.p_answers === "object" ? payload.p_answers : {};
        const phase1 = payload.p_phase1_results && typeof payload.p_phase1_results === "object"
          ? payload.p_phase1_results : null;
        const { error } = await supabase.rpc("upsert_assessment_progress", {
          p_email: email,
          p_experience_path: expPath,
          p_current_question: Number.isFinite(cur) ? cur : 0,
          p_answers: answers as any,
          p_phase1_results: phase1 as any,
          p_total_questions: total != null && Number.isFinite(total) ? total : null,
        });
        if (error) throw error;
        return jsonResponse(200, { data: true });
      }

      case "load_progress": {
        const email = cleanEmail(payload.p_email);
        if (!email) return jsonResponse(400, { error: "invalid_email" });
        const { data, error } = await supabase.rpc("load_assessment_progress", { p_email: email });
        if (error) throw error;
        return jsonResponse(200, { data });
      }

      case "mark_video_skipped": {
        const id = cleanUuid(payload.p_participant_id);
        if (!id) return jsonResponse(400, { error: "invalid_participant_id" });
        const { error } = await supabase.rpc("mark_video_skipped", { p_participant_id: id });
        if (error) throw error;
        return jsonResponse(200, { data: true });
      }

      case "mark_video_completed": {
        const id = cleanUuid(payload.p_participant_id);
        if (!id) return jsonResponse(400, { error: "invalid_participant_id" });
        const { error } = await supabase.rpc("mark_video_completed", { p_participant_id: id });
        if (error) throw error;
        return jsonResponse(200, { data: true });
      }

      default:
        return jsonResponse(400, { error: "unsupported_action" });
    }
  } catch (error) {
    console.error("[secure-rpc] call failed", {
      action,
      error: error instanceof Error ? error.message : String(error),
    });
    return jsonResponse(500, { error: "rpc_failed" });
  }
});