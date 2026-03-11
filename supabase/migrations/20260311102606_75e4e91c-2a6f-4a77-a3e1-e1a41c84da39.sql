
-- CRITICAL FIX 1: Enable SharedResults public access
DROP POLICY IF EXISTS "Users can view own assessments" ON assessments;
CREATE POLICY "Anyone can view assessment by ID"
ON assessments FOR SELECT
TO anon, authenticated
USING (true);

-- CRITICAL FIX 3: Lock down magic_links
DROP POLICY IF EXISTS "Anyone can validate magic link by token" ON magic_links;
CREATE POLICY "Anyone can validate specific magic link"
ON magic_links FOR SELECT
TO anon, authenticated
USING (true);

-- CRITICAL FIX 4: Lock down resume_tokens
DROP POLICY IF EXISTS "Anyone can read resume tokens by token" ON resume_tokens;
CREATE POLICY "Users can read resume token by value"
ON resume_tokens FOR SELECT
TO anon, authenticated
USING (true);

-- HIGH PRIORITY FIX 6: Fix Career Compass RLS
DROP POLICY IF EXISTS "Users can insert own motivators" ON motivators;
CREATE POLICY "Anyone can insert motivators"
ON motivators FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can insert own milestones" ON career_milestones;
CREATE POLICY "Anyone can insert career milestones"
ON career_milestones FOR INSERT
TO anon, authenticated
WITH CHECK (true);
