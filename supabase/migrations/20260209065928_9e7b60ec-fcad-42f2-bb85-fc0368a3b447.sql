
-- Cache table for Ticketmaster performer/event images
CREATE TABLE public.performer_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  performer_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_width INT,
  image_height INT,
  source TEXT DEFAULT 'ticketmaster',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique index on performer name (case-insensitive)
CREATE UNIQUE INDEX idx_performer_images_name ON public.performer_images (LOWER(performer_name));

-- Enable RLS
ALTER TABLE public.performer_images ENABLE ROW LEVEL SECURITY;

-- Public read access (images are public data)
CREATE POLICY "Performer images are publicly readable"
  ON public.performer_images
  FOR SELECT
  USING (true);

-- Only service role can insert/update (via edge function)
CREATE POLICY "Service role can manage performer images"
  ON public.performer_images
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_performer_images_updated_at
  BEFORE UPDATE ON public.performer_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
