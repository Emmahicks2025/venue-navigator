
-- Drop the expression-based index and add a proper unique constraint
DROP INDEX IF EXISTS idx_performer_images_name;
ALTER TABLE public.performer_images ADD CONSTRAINT performer_images_performer_name_key UNIQUE (performer_name);
