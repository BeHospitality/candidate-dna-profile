-- Harden public-write RLS policies without changing schema or public anon flow.

DROP POLICY IF EXISTS "Users can insert assessments" ON public.assessments;
DROP POLICY IF EXISTS "Anon can insert assessments" ON public.assessments;
CREATE POLICY "Insert own or anonymous assessments"
ON public.assessments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (auth.uid() IS NULL AND user_id IS NULL)
  OR
  (auth.uid() IS NOT NULL AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Anyone can insert responses" ON public.assessment_responses;
CREATE POLICY "Insert responses for public or own assessments"
ON public.assessment_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.assessments a
    WHERE a.id = assessment_responses.assessment_id
      AND (
        (auth.uid() IS NULL AND a.user_id IS NULL)
        OR
        (auth.uid() IS NOT NULL AND a.user_id = auth.uid())
      )
  )
);

DROP POLICY IF EXISTS "Anyone can create resume tokens" ON public.resume_tokens;
CREATE POLICY "Create public or own resume tokens"
ON public.resume_tokens
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (auth.uid() IS NULL AND participant_id IS NULL)
  OR
  (auth.uid() IS NOT NULL AND (
    participant_id IS NULL
    OR EXISTS (
      SELECT 1
      FROM public.dna_participants p
      WHERE p.id = resume_tokens.participant_id
        AND lower(p.email) = lower((auth.jwt() ->> 'email'))
    )
  ))
);

DROP POLICY IF EXISTS "Anyone can insert audit logs" ON public.audit_log;
CREATE POLICY "Insert public or own audit logs"
ON public.audit_log
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (auth.uid() IS NULL AND actor_id IS NULL)
  OR
  (auth.uid() IS NOT NULL AND (actor_id IS NULL OR actor_id = auth.uid()))
);

DROP POLICY IF EXISTS "Anyone can insert consent logs" ON public.consent_log;
CREATE POLICY "Anyone can insert consent logs"
ON public.consent_log
FOR INSERT
TO anon, authenticated
WITH CHECK (session_id IS NOT NULL AND length(trim(session_id)) > 0);

DROP POLICY IF EXISTS "Anyone can insert candidates" ON public.dna_candidates;
CREATE POLICY "Anyone can insert candidates"
ON public.dna_candidates
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(trim(email)) > 0
  AND first_name IS NOT NULL
  AND length(trim(first_name)) > 0
);

DROP POLICY IF EXISTS "Anyone can insert participant details" ON public.dna_participants;
CREATE POLICY "Anyone can insert participant details"
ON public.dna_participants
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(trim(email)) > 0
  AND first_name IS NOT NULL
  AND length(trim(first_name)) > 0
  AND last_name IS NOT NULL
  AND length(trim(last_name)) > 0
);

-- Restrict SECURITY DEFINER routines that are internal/trigger-only.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_magic_link_expiry() FROM PUBLIC, anon, authenticated;

-- Keep intentional public RPCs executable; these are scoped by unguessable token/ID/email inputs.
GRANT EXECUTE ON FUNCTION public.get_assessment_by_id(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_dna_candidate_by_email(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_resume_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.validate_magic_link(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_magic_link_used(text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_resume_token_used(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.link_participant_to_assessment(text, text, text, text, text, timestamp with time zone) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_dna_participant(uuid, text, text, text, text, text, text, text, text, text, timestamp with time zone, boolean, timestamp with time zone) TO anon, authenticated;

COMMENT ON FUNCTION public.get_assessment_by_id(uuid) IS 'Public RPC intentionally callable with unguessable assessment UUID; direct table reads are denied by RLS.';
COMMENT ON FUNCTION public.get_dna_candidate_by_email(text) IS 'Public RPC intentionally callable for returning-flow lookup by exact canonical email; direct table reads are denied by RLS.';
COMMENT ON FUNCTION public.get_resume_token(text) IS 'Public RPC intentionally callable with unguessable resume token; direct table reads are denied by RLS.';
COMMENT ON FUNCTION public.validate_magic_link(text) IS 'Public RPC intentionally callable with unguessable magic-link token; direct table reads are denied by RLS.';
COMMENT ON FUNCTION public.mark_magic_link_used(text, uuid) IS 'Public RPC intentionally callable with unguessable magic-link token to complete redemption.';
COMMENT ON FUNCTION public.mark_resume_token_used(text) IS 'Public RPC intentionally callable with unguessable resume token to complete resume redemption.';
COMMENT ON FUNCTION public.link_participant_to_assessment(text, text, text, text, text, timestamp with time zone) IS 'Public RPC intentionally callable by public assessment flow to link a known email to the just-created assessment.';
COMMENT ON FUNCTION public.update_dna_participant(uuid, text, text, text, text, text, text, text, text, text, timestamp with time zone, boolean, timestamp with time zone) IS 'Public RPC intentionally callable by the assessment flow with the participant UUID returned during capture.';