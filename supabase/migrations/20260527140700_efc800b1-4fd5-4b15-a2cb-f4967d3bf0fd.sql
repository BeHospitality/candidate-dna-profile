CREATE OR REPLACE FUNCTION public.can_insert_assessment_response(p_assessment_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.assessments a
    WHERE a.id = p_assessment_id
      AND (
        (auth.uid() IS NULL AND a.user_id IS NULL)
        OR
        (auth.uid() IS NOT NULL AND a.user_id = auth.uid())
      )
  );
$$;

REVOKE EXECUTE ON FUNCTION public.can_insert_assessment_response(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_insert_assessment_response(uuid) TO service_role;

DROP POLICY IF EXISTS "Insert responses for public or own assessments" ON public.assessment_responses;
CREATE POLICY "Insert responses for public or own assessments"
ON public.assessment_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (public.can_insert_assessment_response(assessment_id));

COMMENT ON FUNCTION public.can_insert_assessment_response(uuid) IS 'Internal RLS helper for assessment_responses insert checks; not directly callable by clients.';