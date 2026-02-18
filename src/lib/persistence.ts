import { supabase } from "@/integrations/supabase/client";
import type { AssessmentResult } from "./scoring";
import type { EntryInfo } from "./storage";

export interface PersistAssessmentParams {
  result: AssessmentResult;
  answers: Record<number, any>;
  entryInfo: EntryInfo;
}

export async function persistAssessment({ result, answers, entryInfo }: PersistAssessmentParams): Promise<string | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;

    // Insert assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessments")
      .insert({
        user_id: userId,
        entry_mode: entryInfo.mode,
        token: entryInfo.token || null,
        org_code: entryInfo.orgCode || null,
        archetype: result.primaryArchetype,
        archetype_scores: result.archetypeScores as any,
        dimension_scores: result.scores as any,
      })
      .select("id")
      .single();

    if (assessmentError || !assessment) {
      console.error("Failed to persist assessment:", assessmentError);
      return null;
    }

    // Insert individual responses
    const responses = Object.entries(answers).map(([questionId, answer]) => ({
      assessment_id: assessment.id,
      question_id: parseInt(questionId),
      answer: answer as any,
    }));

    const { error: responsesError } = await supabase
      .from("assessment_responses")
      .insert(responses);

    if (responsesError) {
      console.error("Failed to persist responses:", responsesError);
    }

    // Send results to Hub if this is a candidate assessment
    if (entryInfo.mode === 'candidate' && entryInfo.candidateEmail) {
      try {
        await fetch('https://buriwmeuvujisgmqnpjr.supabase.co/functions/v1/dna-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assessment_id: assessment.id,
            candidate_email: entryInfo.candidateEmail,
            archetype: result.primaryArchetype,
            dimension_scores: {
              autonomy: result.scores.autonomy,
              collaboration: result.scores.collaboration,
              precision: result.scores.precision,
              leadership: result.scores.leadership,
              adaptability: result.scores.adaptability,
            },
          }),
        });
        console.log('Results sent to Hub successfully');
      } catch (err) {
        console.error('Failed to send results to Hub:', err);
      }
    }

    // Audit log
    await supabase.from("audit_log").insert({
      event_type: "assessment_completed",
      actor_id: userId,
      target_type: "assessment",
      target_id: assessment.id,
      metadata: {
        archetype: result.primaryArchetype,
        entry_mode: entryInfo.mode,
        org_code: entryInfo.orgCode || null,
      } as any,
    });

    return assessment.id;
  } catch (err) {
    console.error("Persistence error:", err);
    return null;
  }
}

export async function persistCareerProfile(
  assessmentId: string,
  milestones: Array<{ title: string; targetDate: string; whyMatters: string }>,
  motivators: Record<string, string>
): Promise<boolean> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;

    // Insert milestones
    const milestoneRows = milestones
      .filter((m) => m.title.trim())
      .map((m, idx) => ({
        assessment_id: assessmentId,
        user_id: userId,
        title: m.title,
        description: m.whyMatters || null,
        year: m.targetDate ? new Date(m.targetDate).getFullYear() : null,
        sort_order: idx,
      }));

    if (milestoneRows.length > 0) {
      const { error } = await supabase.from("career_milestones").insert(milestoneRows);
      if (error) console.error("Failed to persist milestones:", error);
    }

    // Insert motivators
    const motivatorRows = Object.entries(motivators)
      .filter(([, v]) => v.trim())
      .map(([category, value]) => ({
        assessment_id: assessmentId,
        user_id: userId,
        category,
        value,
      }));

    if (motivatorRows.length > 0) {
      const { error } = await supabase.from("motivators").insert(motivatorRows);
      if (error) console.error("Failed to persist motivators:", error);
    }

    // Audit log
    await supabase.from("audit_log").insert({
      event_type: "career_profile_completed",
      actor_id: userId,
      target_type: "assessment",
      target_id: assessmentId,
      metadata: {
        milestone_count: milestoneRows.length,
        motivator_count: motivatorRows.length,
      } as any,
    });

    return true;
  } catch (err) {
    console.error("Career profile persistence error:", err);
    return false;
  }
}

export async function validateMagicLink(token: string): Promise<{ valid: boolean; orgCode?: string; candidateName?: string }> {
  try {
    const { data, error } = await supabase
      .from("magic_links")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !data) return { valid: false };
    if (data.used) return { valid: false };
    if (data.expire_at && new Date(data.expire_at) < new Date()) return { valid: false };

    return {
      valid: true,
      orgCode: data.org_code,
      candidateName: data.candidate_name || undefined,
    };
  } catch {
    return { valid: false };
  }
}

export async function markMagicLinkUsed(token: string, assessmentId: string): Promise<void> {
  try {
    await supabase
      .from("magic_links")
      .update({ used: true, used_at: new Date().toISOString(), assessment_id: assessmentId })
      .eq("token", token);
  } catch (err) {
    console.error("Failed to mark magic link used:", err);
  }
}
