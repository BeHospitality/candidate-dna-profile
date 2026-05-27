-- Remove direct client execute access from SECURITY DEFINER helper functions.
-- The secure-rpc edge function uses the service role and remains able to call them.

REVOKE EXECUTE ON FUNCTION public.get_assessment_by_id(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_dna_candidate_by_email(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_resume_token(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_magic_link(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_magic_link_used(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_resume_token_used(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.link_participant_to_assessment(text, text, text, text, text, timestamp with time zone) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_dna_participant(uuid, text, text, text, text, text, text, text, text, text, timestamp with time zone, boolean, timestamp with time zone) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_assessment_by_id(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_dna_candidate_by_email(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_resume_token(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.validate_magic_link(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_magic_link_used(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_resume_token_used(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.link_participant_to_assessment(text, text, text, text, text, timestamp with time zone) TO service_role;
GRANT EXECUTE ON FUNCTION public.update_dna_participant(uuid, text, text, text, text, text, text, text, text, text, timestamp with time zone, boolean, timestamp with time zone) TO service_role;

COMMENT ON FUNCTION public.get_assessment_by_id(uuid) IS 'Backend-only RPC called by secure-rpc with service role; direct table reads are denied by RLS.';
COMMENT ON FUNCTION public.get_dna_candidate_by_email(text) IS 'Backend-only RPC called by secure-rpc with service role for returning-flow exact email lookup.';
COMMENT ON FUNCTION public.get_resume_token(text) IS 'Backend-only RPC called by secure-rpc with service role for unguessable resume-token lookup.';
COMMENT ON FUNCTION public.validate_magic_link(text) IS 'Backend-only RPC called by secure-rpc with service role for unguessable magic-link validation.';
COMMENT ON FUNCTION public.mark_magic_link_used(text, uuid) IS 'Backend-only RPC called by secure-rpc with service role to complete magic-link redemption.';
COMMENT ON FUNCTION public.mark_resume_token_used(text) IS 'Backend-only RPC called by secure-rpc with service role to complete resume-token redemption.';
COMMENT ON FUNCTION public.link_participant_to_assessment(text, text, text, text, text, timestamp with time zone) IS 'Backend-only RPC called by secure-rpc with service role to link public assessment completion.';
COMMENT ON FUNCTION public.update_dna_participant(uuid, text, text, text, text, text, text, text, text, text, timestamp with time zone, boolean, timestamp with time zone) IS 'Backend-only RPC called by secure-rpc with service role for assessment-flow participant updates.';