-- Deny direct reads (idempotent re-affirm)
DROP POLICY IF EXISTS "Deny direct reads" ON public.assessments;
CREATE POLICY "Deny direct reads" ON public.assessments FOR SELECT TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "Deny direct reads" ON public.magic_links;
CREATE POLICY "Deny direct reads" ON public.magic_links FOR SELECT TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "Deny direct reads" ON public.resume_tokens;
CREATE POLICY "Deny direct reads" ON public.resume_tokens FOR SELECT TO anon, authenticated USING (false);

DROP POLICY IF EXISTS "Deny direct reads" ON public.dna_candidates;
CREATE POLICY "Deny direct reads" ON public.dna_candidates FOR SELECT TO anon, authenticated USING (false);

-- Tighten INSERT WITH CHECK on career_milestones and motivators
DROP POLICY IF EXISTS "Insert own or anonymous career milestones" ON public.career_milestones;
CREATE POLICY "Insert own or anonymous career milestones"
  ON public.career_milestones FOR INSERT TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
  );

DROP POLICY IF EXISTS "Insert own or anonymous motivators" ON public.motivators;
CREATE POLICY "Insert own or anonymous motivators"
  ON public.motivators FOR INSERT TO anon, authenticated
  WITH CHECK (
    (auth.uid() IS NULL AND user_id IS NULL)
    OR (auth.uid() IS NOT NULL AND (user_id IS NULL OR user_id = auth.uid()))
  );

-- Document magic_links access model
COMMENT ON TABLE public.magic_links IS
  'Server-validated only. Anon and authenticated clients cannot SELECT directly (RLS deny). Reads happen via SECURITY DEFINER RPC validate_magic_link(p_token) or via edge functions using the service role key. INSERT is performed only by the register-magic-link edge function (service role).';