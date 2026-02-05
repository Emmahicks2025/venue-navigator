
-- Allow inserts from service role (edge functions) and admin
-- For now, allow all operations since we don't have auth yet
-- This is for the admin management functionality
CREATE POLICY "Allow insert events"
ON public.events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update events"
ON public.events
FOR UPDATE
USING (true);

CREATE POLICY "Allow delete events"
ON public.events
FOR DELETE
USING (true);

-- Same for venue_maps
CREATE POLICY "Allow insert venue_maps"
ON public.venue_maps
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update venue_maps"
ON public.venue_maps
FOR UPDATE
USING (true);

CREATE POLICY "Allow delete venue_maps"
ON public.venue_maps
FOR DELETE
USING (true);
