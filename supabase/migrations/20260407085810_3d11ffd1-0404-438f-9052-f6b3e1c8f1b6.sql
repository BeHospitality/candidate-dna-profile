
CREATE TABLE public.dna_candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  path TEXT DEFAULT 'growing',
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dna_candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert candidates"
ON public.dna_candidates
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can read candidates by email"
ON public.dna_candidates
FOR SELECT
TO anon, authenticated
USING (true);
