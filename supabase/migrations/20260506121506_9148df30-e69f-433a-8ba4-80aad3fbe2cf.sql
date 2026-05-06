DELETE FROM audit_log WHERE metadata->>'email'='verify-test@synthetic.example' OR metadata->>'source'='connect_ethics' OR target_id::text IN ('507ac74e-b8e3-46a5-86c0-cc8ee762c740','93255df8-ba89-4aca-abf2-d11643709d02');
DELETE FROM assessment_responses WHERE assessment_id IN ('507ac74e-b8e3-46a5-86c0-cc8ee762c740','93255df8-ba89-4aca-abf2-d11643709d02');
DELETE FROM dna_participants WHERE email='verify-test@synthetic.example';
DELETE FROM assessments WHERE id IN ('507ac74e-b8e3-46a5-86c0-cc8ee762c740','93255df8-ba89-4aca-abf2-d11643709d02');