
-- Table to store save-and-resume tokens for the assessment
CREATE TABLE public.resume_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL DEFAULT (gen_random_uuid())::text UNIQUE,
  email TEXT,
  participant_id UUID REFERENCES public.dna_participants(id),
  experience_path TEXT NOT NULL,
  current_question INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_questions INTEGER NOT NULL,
  -- Phase 1 results (if completed)
  phase1_results JSONB,
  assessment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.resume_tokens ENABLE ROW LEVEL SECURITY;

-- Anyone can create a resume token (public assessment, no auth required)
CREATE POLICY "Anyone can create resume tokens"
  ON public.resume_tokens FOR INSERT
  WITH CHECK (true);

-- Anyone can read a resume token by its token value (for resuming)
CREATE POLICY "Anyone can read resume tokens by token"
  ON public.resume_tokens FOR SELECT
  USING (true);

-- Anyone can mark a resume token as used
CREATE POLICY "Anyone can update resume tokens"
  ON public.resume_tokens FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Index for fast token lookups
CREATE INDEX idx_resume_tokens_token ON public.resume_tokens (token);
