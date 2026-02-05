-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for storing FIFA World Cup 2026 events from Ticketmaster
CREATE TABLE public.world_cup_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticketmaster_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_time TEXT,
  venue_name TEXT NOT NULL,
  venue_city TEXT NOT NULL,
  venue_state TEXT,
  venue_country TEXT DEFAULT 'US',
  venue_lat DECIMAL(10, 8),
  venue_lon DECIMAL(11, 8),
  min_price DECIMAL(10, 2),
  max_price DECIMAL(10, 2),
  image_url TEXT,
  ticketmaster_url TEXT,
  status TEXT DEFAULT 'onsale',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.world_cup_events ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (events are public)
CREATE POLICY "World Cup events are publicly readable" 
ON public.world_cup_events 
FOR SELECT 
USING (true);

-- Create index on event_date for sorting
CREATE INDEX idx_world_cup_events_date ON public.world_cup_events(event_date);

-- Create index on location for proximity queries
CREATE INDEX idx_world_cup_events_location ON public.world_cup_events(venue_lat, venue_lon);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_world_cup_events_updated_at
BEFORE UPDATE ON public.world_cup_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();