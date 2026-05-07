SELECT public.link_participant_to_assessment(
  p_email := 'hello@be.ie',
  p_assessment_id := 'a8e9068a-c0be-4cad-84eb-e48b6d0cebbf',
  p_first_name := 'Hello',
  p_last_name := 'Fingleton',
  p_path := 'growing',
  p_completed_at := '2026-05-07 08:16:09.218699+00'::timestamptz
);