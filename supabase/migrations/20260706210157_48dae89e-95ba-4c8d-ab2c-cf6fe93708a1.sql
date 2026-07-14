ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS hidden_program_slugs text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hidden_plan_slugs text[] DEFAULT '{}';