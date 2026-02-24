import { supabase } from "@/integrations/supabase/client";

export interface ResumeTokenData {
  experiencePath: string;
  currentQuestion: number;
  answers: Record<number, any>;
  totalQuestions: number;
  email?: string;
  participantId?: string;
  phase1Results?: any;
  assessmentId?: string;
}

/**
 * Create a resume token in the database and return the token string.
 */
export async function createResumeToken(data: ResumeTokenData): Promise<string | null> {
  try {
    const { data: row, error } = await supabase
      .from("resume_tokens")
      .insert({
        email: data.email || null,
        participant_id: data.participantId || null,
        experience_path: data.experiencePath,
        current_question: data.currentQuestion,
        answers: data.answers as any,
        total_questions: data.totalQuestions,
        phase1_results: data.phase1Results || null,
        assessment_id: data.assessmentId || null,
      })
      .select("token")
      .single();

    if (error || !row) {
      console.error("Failed to create resume token:", error);
      return null;
    }

    return row.token;
  } catch (err) {
    console.error("Resume token creation error:", err);
    return null;
  }
}

/**
 * Fetch a resume token's data. Returns null if expired, used, or not found.
 */
export async function fetchResumeToken(token: string): Promise<ResumeTokenData | null> {
  try {
    const { data, error } = await supabase
      .from("resume_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !data) return null;
    if (data.used) return null;
    if (data.expires_at && new Date(data.expires_at) < new Date()) return null;

    return {
      experiencePath: data.experience_path,
      currentQuestion: data.current_question,
      answers: data.answers as Record<number, any>,
      totalQuestions: data.total_questions,
      email: data.email || undefined,
      participantId: data.participant_id || undefined,
      phase1Results: data.phase1_results || undefined,
      assessmentId: data.assessment_id || undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Mark a resume token as used.
 */
export async function markResumeTokenUsed(token: string): Promise<void> {
  try {
    await supabase
      .from("resume_tokens")
      .update({ used: true, used_at: new Date().toISOString() })
      .eq("token", token);
  } catch (err) {
    console.error("Failed to mark resume token used:", err);
  }
}

/**
 * Send resume email via edge function.
 */
export async function sendResumeEmail(email: string, resumeUrl: string, firstName?: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("send-resume-email", {
      body: { email, resumeUrl, firstName },
    });

    if (error) {
      console.error("Resume email error:", error);
      return false;
    }

    return data?.success === true;
  } catch (err) {
    console.error("Resume email error:", err);
    return false;
  }
}
