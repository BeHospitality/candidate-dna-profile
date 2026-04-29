
-- =========================================================================
-- DNA App RLS Remediation: replace 7 permissive policies with security-definer RPCs
-- =========================================================================

-- ---------- 1. dna_candidates: lookup by email ----------------------------
CREATE OR REPLACE FUNCTION public.get_dna_candidate_by_email(p_email text)
RETURNS TABLE (
  email text,
  first_name text,
  last_name text,
  path text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Returns the single dna_candidates row for the given (canonicalised) email.
  -- Replaces the permissive "Anyone can read candidates by email" SELECT policy.
  SELECT email, first_name, last_name, path
  FROM public.dna_candidates
  WHERE email = lower(trim(p_email))
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_dna_candidate_by_email(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_dna_candidate_by_email(text) TO anon, authenticated;

-- ---------- 2. magic_links: validate by token -----------------------------
CREATE OR REPLACE FUNCTION public.validate_magic_link(p_token text)
RETURNS TABLE (
  org_code text,
  candidate_name text,
  candidate_email text,
  used boolean,
  expire_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Returns the magic_links row matching the exact token (single row).
  -- Replaces "Anyone can validate specific magic link" (USING true).
  SELECT org_code, candidate_name, candidate_email, used, expire_at
  FROM public.magic_links
  WHERE token = p_token
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.validate_magic_link(text) FROM public;
GRANT EXECUTE ON FUNCTION public.validate_magic_link(text) TO anon, authenticated;

-- ---------- 3. magic_links: mark used by token ----------------------------
CREATE OR REPLACE FUNCTION public.mark_magic_link_used(p_token text, p_assessment_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Marks ONLY the row matching the supplied token as used.
  -- Replaces "Anyone can mark magic link used" (USING true) which allowed mass DoS.
  UPDATE public.magic_links
  SET used = true, used_at = now(), assessment_id = p_assessment_id
  WHERE token = p_token AND used = false;
$$;
REVOKE ALL ON FUNCTION public.mark_magic_link_used(text, uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.mark_magic_link_used(text, uuid) TO anon, authenticated;

-- ---------- 4. resume_tokens: get by token --------------------------------
CREATE OR REPLACE FUNCTION public.get_resume_token(p_token text)
RETURNS TABLE (
  experience_path text,
  current_question integer,
  answers jsonb,
  total_questions integer,
  email text,
  participant_id uuid,
  phase1_results jsonb,
  assessment_id text,
  used boolean,
  expires_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Returns the single resume_tokens row matching the exact token.
  -- Replaces "Users can read resume token by value" (USING true).
  SELECT experience_path, current_question, answers, total_questions,
         email, participant_id, phase1_results, assessment_id, used, expires_at
  FROM public.resume_tokens
  WHERE token = p_token
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_resume_token(text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_resume_token(text) TO anon, authenticated;

-- ---------- 5. resume_tokens: mark used by token --------------------------
CREATE OR REPLACE FUNCTION public.mark_resume_token_used(p_token text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Marks ONLY the row matching the supplied token as used.
  -- Replaces "Anyone can update resume tokens" (USING true).
  UPDATE public.resume_tokens
  SET used = true, used_at = now()
  WHERE token = p_token AND used = false;
$$;
REVOKE ALL ON FUNCTION public.mark_resume_token_used(text) FROM public;
GRANT EXECUTE ON FUNCTION public.mark_resume_token_used(text) TO anon, authenticated;

-- ---------- 6. assessments: get by id -------------------------------------
CREATE OR REPLACE FUNCTION public.get_assessment_by_id(p_id uuid)
RETURNS TABLE (
  id uuid,
  archetype text,
  archetype_scores jsonb,
  dimension_scores jsonb,
  comprehensive_scores jsonb,
  sector_matches jsonb,
  geography_matches jsonb,
  department_matches jsonb,
  completed_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Returns the single assessment matching the supplied UUID.
  -- Replaces "Anyone can view assessment by ID" (USING true) which allowed bulk dump.
  -- Caller must already know the UUID (shared via /results/:assessmentId link).
  SELECT id, archetype, archetype_scores, dimension_scores, comprehensive_scores,
         sector_matches, geography_matches, department_matches, completed_at
  FROM public.assessments
  WHERE id = p_id
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_assessment_by_id(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.get_assessment_by_id(uuid) TO anon, authenticated;

-- ---------- 7. dna_participants: scoped update by id ----------------------
CREATE OR REPLACE FUNCTION public.update_dna_participant(
  p_id uuid,
  p_email text DEFAULT NULL,
  p_phone text DEFAULT NULL,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_role_title text DEFAULT NULL,
  p_referral_source text DEFAULT NULL,
  p_assessment_path text DEFAULT NULL,
  p_assessment_id text DEFAULT NULL,
  p_completed_at timestamptz DEFAULT NULL,
  p_gdpr_consent boolean DEFAULT NULL,
  p_consent_given_at timestamptz DEFAULT NULL
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Updates a SPECIFIC participant row by UUID. Replaces "Allow update by record id"
  -- (USING true / WITH CHECK true) which allowed any anon caller to overwrite ANY row.
  -- Possession of the UUID (returned from INSERT, stored in localStorage) is the binding.
  -- Only the explicit allowlist of candidate-owned columns can be set; passing NULL
  -- leaves the existing value unchanged via COALESCE.
  UPDATE public.dna_participants
  SET email             = lower(trim(COALESCE(p_email, email))),
      phone             = COALESCE(p_phone, phone),
      first_name        = COALESCE(p_first_name, first_name),
      last_name         = COALESCE(p_last_name, last_name),
      country           = COALESCE(p_country, country),
      role_title        = COALESCE(p_role_title, role_title),
      referral_source   = COALESCE(p_referral_source, referral_source),
      assessment_path   = COALESCE(p_assessment_path, assessment_path),
      assessment_id     = COALESCE(p_assessment_id, assessment_id),
      completed_at      = COALESCE(p_completed_at, completed_at),
      gdpr_consent      = COALESCE(p_gdpr_consent, gdpr_consent),
      consent_given_at  = COALESCE(p_consent_given_at, consent_given_at)
  WHERE id = p_id;
$$;
REVOKE ALL ON FUNCTION public.update_dna_participant(uuid, text, text, text, text, text, text, text, text, text, timestamptz, boolean, timestamptz) FROM public;
GRANT EXECUTE ON FUNCTION public.update_dna_participant(uuid, text, text, text, text, text, text, text, text, text, timestamptz, boolean, timestamptz) TO anon, authenticated;

-- =========================================================================
-- Drop the seven permissive policies now that RPCs cover the legitimate paths
-- =========================================================================
DROP POLICY IF EXISTS "Anyone can read candidates by email" ON public.dna_candidates;
DROP POLICY IF EXISTS "Anyone can validate specific magic link" ON public.magic_links;
DROP POLICY IF EXISTS "Anyone can mark magic link used" ON public.magic_links;
DROP POLICY IF EXISTS "Users can read resume token by value" ON public.resume_tokens;
DROP POLICY IF EXISTS "Anyone can update resume tokens" ON public.resume_tokens;
DROP POLICY IF EXISTS "Anyone can view assessment by ID" ON public.assessments;
DROP POLICY IF EXISTS "Allow update by record id" ON public.dna_participants;
