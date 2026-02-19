import { supabase } from "@/integrations/supabase/client";

export async function testDbConnection() {
  const results: Record<string, any> = {};

  // Test 1: candidates table
  const { data: candidates, error: candErr } = await supabase
    .from('candidates' as any)
    .select('id, full_name, tribe_viral_archetype')
    .limit(3);
  
  results.candidates = candErr ? { error: candErr.message } : { data: candidates };
  console.log("🧪 candidates table:", results.candidates);

  // Test 2: team_members table
  const { data: teamMembers, error: teamErr } = await supabase
    .from('team_members' as any)
    .select('id, full_name, tribe_viral_archetype')
    .limit(3);
  
  results.team_members = teamErr ? { error: teamErr.message } : { data: teamMembers };
  console.log("🧪 team_members table:", results.team_members);

  // Test 3: list all public tables
  const { data: tables, error: tablesErr } = await supabase
    .from('assessments' as any)
    .select('id')
    .limit(1);
  
  results.assessments_check = tablesErr ? { error: tablesErr.message } : { data: tables };
  console.log("🧪 assessments table (sanity check):", results.assessments_check);

  return results;
}
