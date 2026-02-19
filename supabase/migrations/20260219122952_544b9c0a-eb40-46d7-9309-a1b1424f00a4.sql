ALTER TABLE public.assessments 
ADD COLUMN IF NOT EXISTS comprehensive_scores JSONB,
ADD COLUMN IF NOT EXISTS sector_matches JSONB,
ADD COLUMN IF NOT EXISTS geography_matches JSONB,
ADD COLUMN IF NOT EXISTS department_matches JSONB;