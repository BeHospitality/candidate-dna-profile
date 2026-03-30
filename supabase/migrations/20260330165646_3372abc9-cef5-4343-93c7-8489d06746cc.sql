
CREATE TABLE public.consent_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  consent_type text NOT NULL DEFAULT 'dna_assessment_profiling',
  consented_at timestamptz NOT NULL DEFAULT now(),
  path text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.consent_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert consent logs"
  ON public.consent_log
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "No public read access to consent logs"
  ON public.consent_log
  FOR SELECT
  TO anon, authenticated
  USING (false);
