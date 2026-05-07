CREATE OR REPLACE FUNCTION public.link_participant_to_assessment(
  p_email text,
  p_assessment_id text,
  p_first_name text DEFAULT NULL,
  p_last_name text DEFAULT NULL,
  p_path text DEFAULT NULL,
  p_completed_at timestamptz DEFAULT now()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_normalized_email text;
  v_existing_id uuid;
  v_email_hash text;
  v_result_id uuid;
  v_was_update boolean;
BEGIN
  v_normalized_email := lower(trim(p_email));

  IF v_normalized_email IS NULL OR v_normalized_email = '' THEN
    RAISE EXCEPTION 'email cannot be empty';
  END IF;

  IF p_assessment_id IS NULL OR p_assessment_id = '' THEN
    RAISE EXCEPTION 'assessment_id cannot be empty';
  END IF;

  v_email_hash := encode(extensions.digest(v_normalized_email, 'sha256'), 'hex');

  SELECT id INTO v_existing_id
  FROM dna_participants
  WHERE email = v_normalized_email
    AND (assessment_id IS NULL OR assessment_id = p_assessment_id)
  ORDER BY
    CASE WHEN assessment_id = p_assessment_id THEN 0 ELSE 1 END,
    created_at DESC
  LIMIT 1;

  IF v_existing_id IS NOT NULL THEN
    v_was_update := true;
    UPDATE dna_participants
    SET
      assessment_id = p_assessment_id,
      completed_at = COALESCE(p_completed_at, completed_at, now()),
      first_name = COALESCE(NULLIF(trim(p_first_name), ''), first_name),
      last_name = COALESCE(NULLIF(trim(p_last_name), ''), last_name),
      assessment_path = COALESCE(NULLIF(trim(p_path), ''), assessment_path)
    WHERE id = v_existing_id;
    v_result_id := v_existing_id;
  ELSE
    v_was_update := false;
    INSERT INTO dna_participants (
      email,
      assessment_id,
      first_name,
      last_name,
      assessment_path,
      completed_at,
      gdpr_consent
    ) VALUES (
      v_normalized_email,
      p_assessment_id,
      COALESCE(NULLIF(trim(p_first_name), ''), split_part(v_normalized_email, '@', 1)),
      COALESCE(NULLIF(trim(p_last_name), ''), 'Unknown'),
      NULLIF(trim(p_path), ''),
      COALESCE(p_completed_at, now()),
      false
    )
    RETURNING id INTO v_result_id;
  END IF;

  INSERT INTO audit_log (event_type, target_id, metadata)
  VALUES (
    'participant_linkage_created',
    NULL,
    jsonb_build_object(
      'email_hash', v_email_hash,
      'participant_id', v_result_id::text,
      'assessment_id', p_assessment_id,
      'was_update', v_was_update,
      'source', 'public_flow',
      'ts', to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    )
  );

  RETURN v_result_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.link_participant_to_assessment(text, text, text, text, text, timestamptz) TO anon, authenticated;