
DELETE FROM dna_participants WHERE email = 'prog-test-2026-05-07@be.ie';
DELETE FROM assessments WHERE id = '86297828-dbea-42c6-a6e1-f8a40016a810';
DELETE FROM audit_log
  WHERE (event_type = 'participant_linkage_created' AND metadata->>'assessment_id' = '86297828-dbea-42c6-a6e1-f8a40016a810')
     OR (event_type = 'verify_assessment_request' AND metadata->>'assessment_id' = '86297828-dbea-42c6-a6e1-f8a40016a810')
     OR (event_type = 'e2e_test_marker' AND metadata->>'tag' = 'prog-test-2026-05-07');
