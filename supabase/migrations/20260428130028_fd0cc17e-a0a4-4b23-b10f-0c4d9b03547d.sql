-- DNA app email canonicalisation (Follow-up #3, 28 April 2026)
-- Three-leg pattern matching connect.be.ie's morning canonicalisation:
-- application-layer boundary normalisation (see code), database-layer
-- CHECK constraints on all 5 email columns, and idempotent backfill.
-- Backfill is no-op against current data per pre-state diagnostic;
-- included as principle codification + race defence.
-- No UNIQUE constraints added — magic_links.candidate_email currently
-- has expected duplicates (4x becoyyy@gmail.com); UNIQUE is a separate
-- schema-design decision deferred to a future prompt.

-- 5a. Backfill: idempotent, expected zero rows affected per diagnostic
UPDATE dna_candidates    SET email           = lower(email)           WHERE email <> lower(email);
UPDATE dna_participants  SET email           = lower(email)           WHERE email <> lower(email);
UPDATE magic_links       SET candidate_email = lower(candidate_email) WHERE candidate_email IS NOT NULL AND candidate_email <> lower(candidate_email);
UPDATE profiles          SET email           = lower(email)           WHERE email IS NOT NULL AND email <> lower(email);
UPDATE resume_tokens     SET email           = lower(email)           WHERE email IS NOT NULL AND email <> lower(email);

-- 5b. CHECK constraints — defend forever (matching connect.be.ie pattern, lowercase-only per A3-i)
ALTER TABLE dna_candidates
  ADD CONSTRAINT dna_candidates_email_lowercase_check
  CHECK (email = lower(email));

ALTER TABLE dna_participants
  ADD CONSTRAINT dna_participants_email_lowercase_check
  CHECK (email = lower(email));

ALTER TABLE magic_links
  ADD CONSTRAINT magic_links_candidate_email_lowercase_check
  CHECK (candidate_email IS NULL OR candidate_email = lower(candidate_email));

ALTER TABLE profiles
  ADD CONSTRAINT profiles_email_lowercase_check
  CHECK (email IS NULL OR email = lower(email));

ALTER TABLE resume_tokens
  ADD CONSTRAINT resume_tokens_email_lowercase_check
  CHECK (email IS NULL OR email = lower(email));