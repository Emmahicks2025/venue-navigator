-- Add unique constraint on event name for upsert to work
ALTER TABLE public.events ADD CONSTRAINT events_name_unique UNIQUE (name);