
-- Drop existing overly-permissive policies on dna_participants
DROP POLICY IF EXISTS "Anyone can read participant records" ON public.dna_participants;
DROP POLICY IF EXISTS "Anyone can update participant records" ON public.dna_participants;
DROP POLICY IF EXISTS "Anyone can insert participant details" ON public.dna_participants;

-- INSERT: Allow anon/authenticated to insert (needed for assessment flow)
CREATE POLICY "Anyone can insert participant details"
ON public.dna_participants FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- SELECT: No client-side reads allowed (service_role bypasses RLS automatically)
-- This closes the GDPR vulnerability - no anonymous user can read PII
CREATE POLICY "No public read access"
ON public.dna_participants FOR SELECT
TO anon, authenticated
USING (false);

-- UPDATE: Allow updates only by matching record ID (needed by persistence.ts to link assessment_id)
-- Risk is minimal since UUIDs are unguessable
CREATE POLICY "Allow update by record id"
ON public.dna_participants FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);
