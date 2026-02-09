
-- Remove the overly permissive policy - service role key bypasses RLS automatically
DROP POLICY "Service role can manage performer images" ON public.performer_images;
