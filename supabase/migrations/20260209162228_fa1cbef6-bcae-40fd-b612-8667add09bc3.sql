ALTER TABLE public.tickets ADD COLUMN remarks text DEFAULT NULL;

-- Allow admins to update any ticket (for adding remarks)
CREATE POLICY "Admins can update any ticket"
ON public.tickets FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to view all tickets (for the admin panel)
CREATE POLICY "Admins can view all tickets"
ON public.tickets FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));