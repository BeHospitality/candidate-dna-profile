
-- Fix magic_links UPDATE policy to allow anonymous users (candidates are not authenticated)
DROP POLICY IF EXISTS "Authenticated can mark magic link used" ON magic_links;
CREATE POLICY "Anyone can mark magic link used"
ON magic_links FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (used = true);
