DROP POLICY IF EXISTS "Anyone can insert responses" ON public.assessment_responses;
DROP POLICY IF EXISTS "Insert responses with assessment link" ON public.assessment_responses;
DROP POLICY IF EXISTS "Insert responses for public or own assessments" ON public.assessment_responses;

CREATE POLICY "No direct response inserts"
ON public.assessment_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

COMMENT ON TABLE public.assessment_responses IS 'Answer rows are written via the secure-rpc backend function after assessment token proof validation; direct client inserts are denied.';