DELETE FROM audit_log
WHERE event_type = 'participant_linkage_created'
  AND metadata->>'assessment_id' = '11111111-2222-3333-4444-555555555555';

DELETE FROM dna_participants
WHERE email = 'rpc-smoke-test@be.ie';