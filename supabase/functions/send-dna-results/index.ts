import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      archetype,
      archetypeDescription,
      topCareerPaths,
      eqSuperpower,
      resultsUrl,
    } = await req.json();

    if (!email || !archetype) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const recipientName = [firstName, lastName].filter(Boolean).join(" ") || "there";

    const emailPayload = {
      sender: { name: "Be Connect", email: "hello@be.ie" },
      to: [{ email, name: recipientName }],
      subject: `Your Work DNA Results — You're a ${archetype}!`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; padding: 20px 0;">
            <h1 style="color: #1a1a2e; font-size: 24px; margin: 0;">Be Connect</h1>
          </div>
          
          <h2 style="color: #1a1a2e;">Hi ${firstName || "there"},</h2>
          
          <p>Your Work DNA assessment is complete. Here's your snapshot:</p>
          
          <div style="background: #1a1a2e; border-radius: 12px; padding: 30px; text-align: center; margin: 20px 0;">
            <p style="color: #f59e0b; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Your Archetype</p>
            <h1 style="color: #ffffff; font-size: 36px; margin: 10px 0;">You're a ${archetype}!</h1>
            <p style="color: #94a3b8; font-size: 16px; margin: 0;">${archetypeDescription || ""}</p>
          </div>
          
          ${eqSuperpower ? `
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1a1a2e; margin-top: 0;">Your EQ Superpower</h3>
            <p style="font-size: 18px; color: #f59e0b; font-weight: bold; margin: 0;">${eqSuperpower}</p>
          </div>
          ` : ""}
          
          ${topCareerPaths && topCareerPaths.length > 0 ? `
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1a1a2e; margin-top: 0;">Your Top Career Paths</h3>
            ${topCareerPaths.map((path: string, i: number) =>
              `<p style="margin: 5px 0; font-size: 16px;">${i + 1}. ${path}</p>`
            ).join("")}
          </div>
          ` : ""}
          
          ${resultsUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resultsUrl}" 
               style="background: #f59e0b; color: #1a1a2e; padding: 14px 35px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">
              View Your Full DNA Profile →
            </a>
          </div>
          ` : ""}
          
          <p style="color: #666;">Your full profile includes detailed dimension scores, career compass, department fit, and a downloadable PDF.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="text-align: center;">
            <p style="font-size: 14px; color: #666;">Share your archetype with friends:</p>
            <p style="font-size: 14px;">
              <a href="https://be-connect-dna.lovable.app" style="color: #f59e0b;">Discover Your Work DNA →</a>
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            Be Connect — Discover Where You'll Thrive<br>
            hello@be.ie | be.ie
          </p>
        </div>
      `,
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({ success: response.ok, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
