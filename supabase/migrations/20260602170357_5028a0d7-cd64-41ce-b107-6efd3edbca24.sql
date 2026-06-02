
-- =====================================================================
-- DNA app: outbox + funnel + cross-device autosave + video skip flow
-- =====================================================================

-- 1) HUB OUTBOX -------------------------------------------------------
CREATE TABLE public.hub_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL,
  email text,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  last_attempt_at timestamptz,
  last_error text,
  delivered_at timestamptz,
  first_attempt_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.hub_outbox TO service_role;
-- No anon/authenticated grants: writes go via SECURITY DEFINER RPC,
-- reads go via service_role only.

ALTER TABLE public.hub_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all direct access to hub_outbox"
ON public.hub_outbox FOR SELECT
TO anon, authenticated
USING (false);

CREATE INDEX idx_hub_outbox_pending
  ON public.hub_outbox (status, next_attempt_at)
  WHERE status = 'pending';

CREATE INDEX idx_hub_outbox_assessment
  ON public.hub_outbox (assessment_id);

-- Enqueue RPC (called from frontend via secure-rpc)
CREATE OR REPLACE FUNCTION public.enqueue_hub_outbox(
  p_assessment_id uuid,
  p_email text,
  p_payload jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_assessment_id IS NULL OR p_payload IS NULL THEN
    RAISE EXCEPTION 'assessment_id and payload are required';
  END IF;

  -- Idempotent: if a non-dead row exists for this assessment, return it
  SELECT id INTO v_id
  FROM public.hub_outbox
  WHERE assessment_id = p_assessment_id
    AND status IN ('pending','in_flight','delivered')
  LIMIT 1;

  IF v_id IS NOT NULL THEN RETURN v_id; END IF;

  INSERT INTO public.hub_outbox (assessment_id, email, payload)
  VALUES (p_assessment_id, lower(trim(p_email)), p_payload)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.enqueue_hub_outbox(uuid, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enqueue_hub_outbox(uuid, text, jsonb) TO service_role;

-- Backfill helper: returns assessment rows without a delivered outbox entry
CREATE OR REPLACE FUNCTION public.list_undelivered_assessments(p_limit int DEFAULT 500)
RETURNS TABLE (
  assessment_id uuid,
  archetype text,
  dimension_scores jsonb,
  comprehensive_scores jsonb,
  sector_matches jsonb,
  geography_matches jsonb,
  department_matches jsonb,
  completed_at timestamptz,
  email text,
  first_name text,
  assessment_path text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT a.id, a.archetype, a.dimension_scores, a.comprehensive_scores,
         a.sector_matches, a.geography_matches, a.department_matches,
         a.completed_at,
         p.email, p.first_name, p.assessment_path
  FROM public.assessments a
  LEFT JOIN public.dna_participants p
    ON p.assessment_id::text = a.id::text
  WHERE NOT EXISTS (
    SELECT 1 FROM public.hub_outbox o
    WHERE o.assessment_id = a.id
      AND o.status IN ('delivered','pending','in_flight')
  )
  ORDER BY a.completed_at DESC
  LIMIT p_limit;
$$;

REVOKE ALL ON FUNCTION public.list_undelivered_assessments(int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_undelivered_assessments(int) TO service_role;


-- 2) FUNNEL EVENTS ---------------------------------------------------
CREATE TABLE public.funnel_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  email text,
  event_name text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.funnel_events TO anon, authenticated;
GRANT ALL ON public.funnel_events TO service_role;

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny direct reads on funnel_events"
ON public.funnel_events FOR SELECT
TO anon, authenticated
USING (false);

CREATE POLICY "Anyone can insert funnel events"
ON public.funnel_events FOR INSERT
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL
  AND length(trim(session_id)) > 0
  AND length(event_name) BETWEEN 1 AND 64
);

CREATE INDEX idx_funnel_events_event_time
  ON public.funnel_events (event_name, created_at DESC);

CREATE INDEX idx_funnel_events_session
  ON public.funnel_events (session_id, created_at);


-- 3) ASSESSMENT PROGRESS (cross-device autosave) ---------------------
CREATE TABLE public.assessment_progress (
  email text PRIMARY KEY,
  experience_path text,
  current_question integer NOT NULL DEFAULT 0,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  phase1_results jsonb,
  total_questions integer,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.assessment_progress TO service_role;
-- No anon/authenticated grants: all access goes through SECURITY DEFINER RPCs

ALTER TABLE public.assessment_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deny all direct access to assessment_progress"
ON public.assessment_progress FOR SELECT
TO anon, authenticated
USING (false);

CREATE OR REPLACE FUNCTION public.upsert_assessment_progress(
  p_email text,
  p_experience_path text,
  p_current_question integer,
  p_answers jsonb,
  p_phase1_results jsonb DEFAULT NULL,
  p_total_questions integer DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text := lower(trim(p_email));
BEGIN
  IF v_email IS NULL OR v_email = '' THEN
    RAISE EXCEPTION 'email is required';
  END IF;

  INSERT INTO public.assessment_progress (
    email, experience_path, current_question, answers, phase1_results, total_questions
  ) VALUES (
    v_email, p_experience_path, COALESCE(p_current_question, 0),
    COALESCE(p_answers, '{}'::jsonb), p_phase1_results, p_total_questions
  )
  ON CONFLICT (email) DO UPDATE
  SET experience_path = COALESCE(EXCLUDED.experience_path, public.assessment_progress.experience_path),
      current_question = GREATEST(EXCLUDED.current_question, public.assessment_progress.current_question),
      answers = EXCLUDED.answers,
      phase1_results = COALESCE(EXCLUDED.phase1_results, public.assessment_progress.phase1_results),
      total_questions = COALESCE(EXCLUDED.total_questions, public.assessment_progress.total_questions),
      updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.upsert_assessment_progress(text, text, integer, jsonb, jsonb, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upsert_assessment_progress(text, text, integer, jsonb, jsonb, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.load_assessment_progress(p_email text)
RETURNS TABLE (
  experience_path text,
  current_question integer,
  answers jsonb,
  phase1_results jsonb,
  total_questions integer,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT experience_path, current_question, answers, phase1_results, total_questions, updated_at
  FROM public.assessment_progress
  WHERE email = lower(trim(p_email))
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.load_assessment_progress(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.load_assessment_progress(text) TO service_role;


-- 4) VIDEO STATUS COLUMNS on dna_participants -----------------------
ALTER TABLE public.dna_participants
  ADD COLUMN IF NOT EXISTS video_status text DEFAULT 'not_started',
  ADD COLUMN IF NOT EXISTS video_skipped_at timestamptz,
  ADD COLUMN IF NOT EXISTS video_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS video_nudge_48h_at timestamptz,
  ADD COLUMN IF NOT EXISTS video_nudge_7d_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_dna_participants_video_pending
  ON public.dna_participants (video_status, video_skipped_at)
  WHERE video_status = 'skipped_pending';

-- Allow secure-rpc to update video status without widening RLS
CREATE OR REPLACE FUNCTION public.mark_video_skipped(p_participant_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.dna_participants
  SET video_status = 'skipped_pending',
      video_skipped_at = COALESCE(video_skipped_at, now())
  WHERE id = p_participant_id;
$$;

REVOKE ALL ON FUNCTION public.mark_video_skipped(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_video_skipped(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.mark_video_completed(p_participant_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.dna_participants
  SET video_status = 'completed',
      video_completed_at = now()
  WHERE id = p_participant_id;
$$;

REVOKE ALL ON FUNCTION public.mark_video_completed(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_video_completed(uuid) TO service_role;

-- Required extensions for cron worker (idempotent)
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
