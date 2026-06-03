
-- assessment_progress: add explicit deny INSERT/UPDATE/DELETE policies so the
-- linter/scanner sees a clear "no direct writes" posture (previously these
-- commands had no policy and relied on implicit deny, which the scanner flags
-- as ambiguous). All real writes happen via SECURITY DEFINER RPC
-- upsert_assessment_progress called from the secure-rpc edge function.
CREATE POLICY "Deny direct inserts to assessment_progress"
ON public.assessment_progress
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

CREATE POLICY "Deny direct updates to assessment_progress"
ON public.assessment_progress
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny direct deletes from assessment_progress"
ON public.assessment_progress
FOR DELETE
TO anon, authenticated
USING (false);

-- career_milestones: tighten INSERT so that authenticated users cannot insert
-- orphan rows (user_id IS NULL). Anonymous (anon) callers may still insert
-- unowned rows for the public assessment flow.
DROP POLICY IF EXISTS "Insert own or anonymous career milestones" ON public.career_milestones;

CREATE POLICY "Anon can insert unowned career milestones"
ON public.career_milestones
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

CREATE POLICY "Authenticated must own career milestones"
ON public.career_milestones
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- motivators: same treatment.
DROP POLICY IF EXISTS "Insert own or anonymous motivators" ON public.motivators;

CREATE POLICY "Anon can insert unowned motivators"
ON public.motivators
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

CREATE POLICY "Authenticated must own motivators"
ON public.motivators
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());
