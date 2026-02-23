import { supabase } from "@/integrations/supabase/client";
import type { AssessmentResult } from "./scoring";
import type { ComprehensiveScores } from "./scoring";
import type { EntryInfo } from "./storage";
import { storage } from "./storage";
import type { SectorMatch } from "@/utils/sectorMatching";
import type { GeographyMatch } from "@/utils/geographyMatching";
import type { DepartmentFit } from "@/utils/departmentMatching";
import { sendResultsToHub, storePendingPayload, clearPendingPayload, type HubWebhookPayload } from "@/utils/hubIntegration";

export interface PersistAssessmentParams {
  result: AssessmentResult;
  answers: Record<number, any>;
  entryInfo: EntryInfo;
  comprehensiveScores?: ComprehensiveScores;
  experiencePath?: string;
  sectorMatches?: SectorMatch[];
  geographyMatches?: GeographyMatch[];
  departmentMatches?: DepartmentFit[];
}

export async function persistAssessment({ result, answers, entryInfo, comprehensiveScores, experiencePath, sectorMatches, geographyMatches, departmentMatches }: PersistAssessmentParams): Promise<string | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id || null;

    // Insert assessment with matching data
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
        comprehensive_scores: (comprehensiveScores || {}) as any,
        sector_matches: (sectorMatches || []) as any,
        geography_matches: (geographyMatches || []) as any,
        department_matches: (departmentMatches || []) as any,
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

    // Send results to Hub for candidate and team modes (fire-and-forget)
    if ((entryInfo.mode === 'candidate' || entryInfo.mode === 'team') && entryInfo.candidateEmail) {
      const cs = comprehensiveScores;
      const hubPayload: HubWebhookPayload = {
        assessment_id: assessment.id,
        candidate_email: entryInfo.candidateEmail,
        archetype: result.primaryArchetype.toLowerCase(),
        dimension_scores: {
          autonomy: Math.round(result.scores.autonomy),
          collaboration: Math.round(result.scores.collaboration),
          precision: Math.round(result.scores.precision),
          leadership: Math.round(result.scores.leadership),
          adaptability: Math.round(result.scores.adaptability),
          problemSolving: Math.round(cs?.problemSolving || 0),
          attentionToDetail: Math.round(cs?.attentionToDetail || 0),
          learningSpeed: Math.round(cs?.learningSpeed || 0),
          patternRecognition: Math.round(cs?.patternRecognition || 0),
          concentration: Math.round(cs?.concentration || 0),
          extraversion: Math.round(cs?.extraversion || 0),
          conscientiousness: Math.round(cs?.conscientiousness || 0),
          openness: Math.round(cs?.openness || 0),
          agreeableness: Math.round(cs?.agreeableness || 0),
          emotionalStability: Math.round(cs?.emotionalStability || 0),
          readingOthers: Math.round(cs?.readingOthers || 0),
          empathy: Math.round(cs?.empathy || 0),
          selfRegulation: Math.round(cs?.selfRegulation || 0),
          socialAwareness: Math.round(cs?.socialAwareness || 0),
          integrity: Math.round(cs?.integrity || 0),
          ruleFollowing: Math.round(cs?.ruleFollowing || 0),
          safetyConsciousness: Math.round(cs?.safetyConsciousness || 0),
          dependability: Math.round(cs?.dependability || 0),
        },
        experience_path: experiencePath || 'experienced',
        sector_matches: sectorMatches?.slice(0, 3),
        geography_fit: geographyMatches,
        department_ranking: departmentMatches?.slice(0, 5),
      };

      // Fire and forget — don't block user from seeing results
      sendResultsToHub(hubPayload).then((hubResult) => {
        if (hubResult.success) {
          clearPendingPayload();
        } else {
          console.warn('[Hub Integration] Failed, storing for retry');
          storePendingPayload(hubPayload);
        }
      });
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

    // Link participant record to assessment and mark completed
    const participantId = storage.getParticipantId();
    if (participantId && !participantId.startsWith("local-")) {
      await supabase
        .from("dna_participants")
        .update({
          assessment_id: assessment.id,
          completed_at: new Date().toISOString(),
        })
        .eq("id", participantId);
    }

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

export async function validateMagicLink(token: string): Promise<{ valid: boolean; orgCode?: string; candidateName?: string; candidateEmail?: string }> {
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
      candidateEmail: data.candidate_email || undefined,
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
