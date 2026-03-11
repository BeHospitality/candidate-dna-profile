
ALTER TABLE public.dna_participants
ADD COLUMN gdpr_consent boolean NOT NULL DEFAULT false,
ADD COLUMN consent_given_at timestamptz;
