import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const { token, candidate_email, candidate_name, org_code, expire_at } = await req.json()

    // Validate required fields (org_code is NOT NULL in the table)
    if (!token || !candidate_email || !org_code) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          details: 'token, candidate_email, and org_code are required'
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const expiryDate = expire_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await supabase
      .from('magic_links')
      .insert({
        token,
        candidate_email,
        candidate_name: candidate_name || null,
        org_code,
        expire_at: expiryDate,
        used: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create magic link', details: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Audit log (non-critical)
    await supabase.from('audit_log').insert({
      event_type: 'magic_link_registered_from_hub',
      metadata: { token: token.substring(0, 8) + '...', candidate_email, org_code, source: 'hub_integration' }
    }).catch(err => console.warn('Audit log failed (non-critical):', err))

    console.log('Magic link registered:', { token: token.substring(0, 8) + '...', candidate_email, expires: expiryDate })

    return new Response(
      JSON.stringify({ success: true, data, message: 'Magic link registered successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
