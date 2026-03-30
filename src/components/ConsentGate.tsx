import { supabase } from "@/integrations/supabase/client";

const CONSENT_KEY = "beconnect-gdpr-consent";
const TIMESTAMP_KEY = "beconnect-consent-timestamp";
const SESSION_KEY = "beconnect-session-id";

export const hasGdprConsent = (): boolean => {
  return localStorage.getItem(CONSENT_KEY) === "true";
};

const getOrCreateSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

const ConsentGate = ({ onConsent }: { onConsent: () => void }) => {
  const handleConsent = async () => {
    localStorage.setItem(CONSENT_KEY, "true");
    localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
    onConsent();

    // Fire-and-forget Supabase insert
    try {
      const sessionId = getOrCreateSessionId();
      const urlParams = new URLSearchParams(window.location.search);
      const path = urlParams.get("path") || null;

      await supabase.from("consent_log").insert({
        session_id: sessionId,
        consent_type: "dna_assessment_profiling",
        consented_at: new Date().toISOString(),
        path,
        user_agent: navigator.userAgent,
      });
    } catch (err) {
      console.error("Consent log write failed:", err);
    }
  };

  const handleDecline = () => {
    window.location.href = "https://connect.be.ie";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f1729",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        {/* Logo mark */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            backgroundColor: "#f59e0b",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#0f1729",
              lineHeight: 1,
            }}
          >
            Be
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: 28,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          Before we begin —
          <br />a word about your data.
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 14,
            color: "#9CA3AF",
            lineHeight: 1.7,
            marginBottom: 28,
          }}
        >
          The Be Connect DNA Assessment asks questions about your personality,
          working style, and career preferences. This is personal data. We use
          it solely to generate your career archetype and match you with
          relevant opportunities.
        </p>

        {/* Consent card */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: 24,
            marginBottom: 24,
            textAlign: "left",
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: "1.5px",
              color: "#f59e0b",
              marginBottom: 16,
            }}
          >
            WHAT YOU ARE CONSENTING TO
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Personality profiling for career matching purposes",
              "Storage of your archetype result to personalise your Be Connect journey",
              "Optional: being contacted by Be Connect about relevant career opportunities",
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 14,
                    color: "#008C72",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    color: "#D1D5DB",
                    lineHeight: 1.5,
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy link */}
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 13,
            color: "#9CA3AF",
            marginBottom: 24,
          }}
        >
          Your data is handled in accordance with our{" "}
          <a
            href="https://be.ie/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#008C72", textDecoration: "underline" }}
          >
            Privacy Notice
          </a>
          . You can withdraw consent at any time by contacting us at
          privacy@be.ie.
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleConsent}
          style={{
            width: "100%",
            backgroundColor: "#E11048",
            color: "#ffffff",
            fontFamily: "DM Sans, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 10,
            padding: 16,
            border: "none",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          I understand — let's begin
        </button>

        {/* Secondary link */}
        <p
          onClick={handleDecline}
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 12,
            color: "#9CA3AF",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          I do not consent — take me back
        </p>

        {/* Bottom note */}
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 11,
            color: "#6B7280",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          Be Connect — Be Hospitality Solutions Ltd, Cork, Ireland. Registered
          under GDPR Article 6(1)(a) — consent.
        </p>
      </div>
    </div>
  );
};

export default ConsentGate;
