import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/funnel";

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
  useEffect(() => {
    track("ethics_shown");
  }, []);

  const handleConsent = async () => {
    localStorage.setItem(CONSENT_KEY, "true");
    localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
    track("ethics_signed");
    onConsent();

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
      <div style={{ maxWidth: 520, width: "100%" }}>
        {/* Logo mark */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: "#f59e0b",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: 17, color: "#0f1729" }}>
              Be
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: 30,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            marginBottom: 14,
            textAlign: "center",
          }}
        >
          Your answers are yours.
        </h1>

        {/* Lead */}
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 15,
            color: "#D1D5DB",
            lineHeight: 1.7,
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          Here is exactly what we share with employers — and what we never will.
        </p>

        {/* Two-column truth card */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 14,
            padding: 22,
            marginBottom: 18,
          }}
        >
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "1.5px",
              color: "#10B981",
              marginBottom: 12,
            }}
          >
            WHAT WE SHARE
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#E5E7EB", fontFamily: "DM Sans, sans-serif", fontSize: 14, lineHeight: 1.7 }}>
            <li>Your archetype and dimension scores</li>
            <li>Your sector, department, and geography fit</li>
            <li>Your first name, so it feels human</li>
          </ul>

          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "1.5px",
              color: "#f59e0b",
              marginTop: 20,
              marginBottom: 12,
            }}
          >
            WHAT WE NEVER SHARE
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#E5E7EB", fontFamily: "DM Sans, sans-serif", fontSize: 14, lineHeight: 1.7 }}>
            <li>Your individual answers to any question</li>
            <li>Anything you type into a free-text field</li>
            <li>Your data with anyone outside Be Connect</li>
          </ul>
        </div>

        {/* Withdrawal note */}
        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 13,
            color: "#9CA3AF",
            textAlign: "center",
            marginBottom: 22,
            lineHeight: 1.6,
          }}
        >
          You can ask us to delete your profile any time, no questions asked, at{" "}
          <a href="mailto:privacy@be.ie" style={{ color: "#10B981", textDecoration: "underline" }}>
            privacy@be.ie
          </a>
          . Full details in our{" "}
          <a
            href="https://be.ie/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#10B981", textDecoration: "underline" }}
          >
            Privacy Notice
          </a>
          .
        </p>

        {/* Primary CTA */}
        <button
          onClick={handleConsent}
          style={{
            width: "100%",
            backgroundColor: "#f59e0b",
            color: "#0f1729",
            fontFamily: "DM Sans, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 10,
            padding: 16,
            border: "none",
            cursor: "pointer",
            marginBottom: 10,
          }}
        >
          I'm in — start my profile
        </button>

        {/* Secondary */}
        <button
          onClick={handleDecline}
          style={{
            width: "100%",
            background: "transparent",
            color: "#9CA3AF",
            fontFamily: "DM Sans, sans-serif",
            fontSize: 13,
            fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: 10,
            padding: 14,
            cursor: "pointer",
          }}
        >
          Not right now
        </button>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 11,
            color: "#6B7280",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Be Hospitality Solutions Ltd, Cork, Ireland · GDPR Art. 6(1)(a) consent
        </p>
      </div>
    </div>
  );
};

export default ConsentGate;
