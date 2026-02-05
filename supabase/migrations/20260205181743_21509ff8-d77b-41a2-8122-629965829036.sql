
-- Create events table for all events (not just World Cup)
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  performer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'sports',
  venue_name TEXT NOT NULL,
  venue_city TEXT NOT NULL DEFAULT '',
  venue_state TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '19:00',
  description TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  min_price NUMERIC NOT NULL DEFAULT 0,
  max_price NUMERIC NOT NULL DEFAULT 0,
  performer_image TEXT,
  svg_map_name TEXT,
  match_number INTEGER,
  round TEXT,
  group_name TEXT,
  home_team TEXT,
  away_team TEXT,
  ticket_url TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Events are publicly readable"
ON public.events
FOR SELECT
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create venue_maps table for managing SVG maps
CREATE TABLE public.venue_maps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  venue_name TEXT NOT NULL UNIQUE,
  svg_content TEXT NOT NULL,
  venue_city TEXT,
  venue_state TEXT,
  venue_country TEXT DEFAULT 'USA',
  capacity INTEGER,
  venue_type TEXT DEFAULT 'arena',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.venue_maps ENABLE ROW LEVEL SECURITY;

-- Public read access for venue maps
CREATE POLICY "Venue maps are publicly readable"
ON public.venue_maps
FOR SELECT
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_venue_maps_updated_at
BEFORE UPDATE ON public.venue_maps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
