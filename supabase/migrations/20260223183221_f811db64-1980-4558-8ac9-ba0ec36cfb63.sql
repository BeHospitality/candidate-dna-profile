
CREATE TABLE public.dna_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  role_title TEXT,
  referral_source TEXT,
  assessment_path TEXT,
  assessment_id TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dna_participants_email ON public.dna_participants(email);

ALTER TABLE public.dna_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert participant details"
  ON public.dna_participants
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update participant records"
  ON public.dna_participants
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can read participant records"
  ON public.dna_participants
  FOR SELECT
  USING (true);
