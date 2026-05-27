DROP POLICY IF EXISTS "Insert responses for public or own assessments" ON public.assessment_responses;

CREATE POLICY "Insert responses with assessment link"
ON public.assessment_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (assessment_id IS NOT NULL AND question_id > 0);

DROP FUNCTION IF EXISTS public.can_insert_assessment_response(uuid);