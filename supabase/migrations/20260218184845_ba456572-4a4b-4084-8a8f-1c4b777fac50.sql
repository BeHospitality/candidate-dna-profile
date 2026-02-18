
-- Profiles table for additional user info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  org_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Assessments table
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entry_mode TEXT NOT NULL DEFAULT 'public' CHECK (entry_mode IN ('public', 'candidate', 'team')),
  token TEXT,
  org_code TEXT,
  archetype TEXT NOT NULL,
  archetype_scores JSONB NOT NULL DEFAULT '{}',
  dimension_scores JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments" ON public.assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert assessments" ON public.assessments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can insert assessments" ON public.assessments FOR INSERT TO anon WITH CHECK (true);

-- Assessment responses (individual answers)
CREATE TABLE public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL,
  answer JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own responses" ON public.assessment_responses FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.assessments WHERE id = assessment_id AND user_id = auth.uid()));
CREATE POLICY "Anyone can insert responses" ON public.assessment_responses FOR INSERT WITH CHECK (true);

-- Career milestones
CREATE TABLE public.career_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.career_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own milestones" ON public.career_milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON public.career_milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON public.career_milestones FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own milestones" ON public.career_milestones FOR DELETE USING (auth.uid() = user_id);

-- Motivators
CREATE TABLE public.motivators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.motivators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own motivators" ON public.motivators FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own motivators" ON public.motivators FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own motivators" ON public.motivators FOR UPDATE USING (auth.uid() = user_id);

-- Magic links for candidate pre-screening
CREATE TABLE public.magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  candidate_email TEXT,
  candidate_name TEXT,
  org_code TEXT NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMPTZ,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Validation trigger for expiry instead of CHECK constraint
CREATE OR REPLACE FUNCTION public.validate_magic_link_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.expire_at IS NOT NULL AND NEW.expire_at <= NEW.created_at THEN
    RAISE EXCEPTION 'expire_at must be after created_at';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

ALTER TABLE public.magic_links ADD COLUMN expire_at TIMESTAMPTZ DEFAULT (now() + interval '7 days');

CREATE TRIGGER validate_magic_link_expiry_trigger
BEFORE INSERT OR UPDATE ON public.magic_links
FOR EACH ROW EXECUTE FUNCTION public.validate_magic_link_expiry();

ALTER TABLE public.magic_links ENABLE ROW LEVEL SECURITY;

-- Magic links are read by token (public access for validation)
CREATE POLICY "Anyone can validate magic link by token" ON public.magic_links FOR SELECT USING (true);
CREATE POLICY "System can update magic links" ON public.magic_links FOR UPDATE USING (true);

-- Audit log
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Audit logs are insert-only, viewable by the actor
CREATE POLICY "Anyone can insert audit logs" ON public.audit_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own audit logs" ON public.audit_log FOR SELECT USING (auth.uid() = actor_id);

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
