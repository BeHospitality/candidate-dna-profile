import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY');
    if (!BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY is not configured');
    }

    const { email, resumeUrl, firstName } = await req.json();

    if (!email || !resumeUrl) {
      return new Response(JSON.stringify({ error: 'email and resumeUrl are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const name = firstName || 'there';

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Be Connect DNA', email: 'noreply@beconnect.co' },
        to: [{ email, name }],
        subject: 'Resume your DNA Assessment',
        htmlContent: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 20px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 48px;">🧬</span>
            </div>
            <h1 style="text-align: center; color: #1a1a2e; font-size: 24px; margin-bottom: 8px;">
              Hi ${name}, your assessment is waiting!
            </h1>
            <p style="text-align: center; color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
              You saved your progress on the Work DNA assessment. Click below to pick up right where you left off.
            </p>
            <div style="text-align: center; margin-bottom: 28px;">
              <a href="${resumeUrl}" style="display: inline-block; background: linear-gradient(135deg, #d4a843, #b8922e); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 16px;">
                Resume Assessment →
              </a>
            </div>
            <p style="text-align: center; color: #999; font-size: 13px;">
              This link expires in 7 days. If it has expired, you can restart the assessment at any time.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 28px 0 16px;" />
            <p style="text-align: center; color: #bbb; font-size: 11px;">
              Candidate DNA Profile · Powered by Be Connect
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API error:', JSON.stringify(data));
      throw new Error(`Brevo API failed [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending resume email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
