import { supabase } from "@/integrations/supabase/client";
import type { AssessmentResult } from "./scoring";
import type { ComprehensiveScores } from "./scoring";
import type { EntryInfo } from "./storage";
import { storage } from "./storage";
import type { SectorMatch } from "@/utils/sectorMatching";
import type { GeographyMatch } from "@/utils/geographyMatching";
import type { DepartmentFit } from "@/utils/departmentMatching";


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

    // Stage 7B (Option A): Path 2's Hub-push has been removed.
    // Hub is now notified ONLY via Path 3 (SaveDNAPanel → hub-relay)
    // when the candidate explicitly opts in by submitting the email
    // capture form on the results page. This eliminates the duplicate
    // record problem and ensures every Hub row corresponds to a
    // candidate who has consciously asked to save their DNA profile.
    // The assessment row itself is still written locally to the
    // DNA app's `assessments` table above.

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

    // Link participant record to assessment and mark completed (via security-definer RPC)
    const participantId = storage.getParticipantId();
    if (participantId && !participantId.startsWith("local-")) {
      await supabase.rpc("update_dna_participant", {
        p_id: participantId,
        p_assessment_id: assessment.id,
        p_completed_at: new Date().toISOString(),
      });
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
    const { data: rows, error } = await supabase
      .rpc("validate_magic_link", { p_token: token });

    const data = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
    if (error || !data) return { valid: false };
    if (data.used) return { valid: false };
    if (data.expire_at && new Date(data.expire_at) < new Date()) return { valid: false };

    // Boundary normalisation: canonicalise email returned from magic-link DB lookup.
    const candidateEmail = data.candidate_email
      ? String(data.candidate_email).toLowerCase().trim()
      : undefined;
    return {
      valid: true,
      orgCode: data.org_code,
      candidateName: data.candidate_name || undefined,
      candidateEmail,
    };
  } catch {
    return { valid: false };
  }
}

export async function markMagicLinkUsed(token: string, assessmentId: string): Promise<void> {
  try {
    await supabase.rpc("mark_magic_link_used", {
      p_token: token,
      p_assessment_id: assessmentId,
    });
  } catch (err) {
    console.error("Failed to mark magic link used:", err);
  }
}
