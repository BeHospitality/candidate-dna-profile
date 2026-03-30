import { supabase } from '@/integrations/supabase/client';

export const testHubRelay = async () => {
  const testPayload = {
    email: 'bridge-test@be.ie',
    archetype: 'Lion',
    archetype_type: 'The Autonomous Leader',
    scores: {
      autonomy: 85,
      collaboration: 60,
      leadership: 90,
      precision: 70,
      adaptability: 75
    },
    matching_results: {
      top_sectors: ['Events & Conferences', 'Cruise Lines'],
      top_departments: ['Front Office', 'F&B']
    },
    path: 'growing',
    session_id: 'test-session-' + Date.now(),
    source: 'bridge-test',
    completed_at: new Date().toISOString()
  };

  console.log('[bridge-test] Firing hub-relay with test payload...');
  
  const { data, error } = await supabase.functions.invoke(
    'hub-relay', 
    { body: testPayload }
  );

  if (error) {
    console.error('[bridge-test] FAILED:', error);
    return { success: false, error };
  }

  console.log('[bridge-test] SUCCESS:', data);
  return { success: true, data };
};
