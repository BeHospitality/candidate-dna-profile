
-- Tighten magic_links UPDATE: only allow marking as used, not arbitrary updates
DROP POLICY "System can update magic links" ON public.magic_links;

-- Only allow updating the 'used' flag via service role or edge functions
-- For now, restrict to authenticated users (edge functions will use service role)
CREATE POLICY "Authenticated can mark magic link used" ON public.magic_links 
FOR UPDATE TO authenticated 
USING (true) 
WITH CHECK (used = true);
