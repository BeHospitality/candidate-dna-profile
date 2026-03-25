import { useState } from "react";

const CONSENT_KEY = "beconnect-consent-given";
const TIMESTAMP_KEY = "beconnect-consent-timestamp";

export const hasConsented = (): boolean => {
  return localStorage.getItem(CONSENT_KEY) === "true";
};

const ConsentGate = ({ onConsent }: { onConsent: () => void }) => {
  const handleConsent = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    localStorage.setItem(TIMESTAMP_KEY, new Date().toISOString());
    onConsent();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0f1729" }}>
      <div
        className="w-full bg-white sm:p-10 p-6"
        style={{ maxWidth: 560, borderRadius: 16 }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://be.ie/wp-content/uploads/2024/01/be-connect-logo.png"
            alt="Be Connect"
            className="h-10 object-contain"
          />
        </div>

        {/* Heading */}
        <h1
          className="text-center mb-6"
          style={{ fontFamily: "Montserrat, sans-serif", fontSize: 24, fontWeight: 700, color: "#0f1729" }}
        >
          Before we begin
        </h1>

        {/* Body */}
        <div
          className="mb-6"
          style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "#374151", lineHeight: 1.7 }}
        >
          <p className="mb-4">
            The DNA Assessment uses personality profiling to match you with roles,
            teams, and career paths that fit who you are.
          </p>
          <p>
            By continuing, you consent to this profiling being used for career
            matching purposes. We will never sell your data or share it without
            your permission.
          </p>
        </div>

        {/* Privacy link */}
        <div className="mb-8">
          <a
            href="https://be.ie/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: "#008C72" }}
          >
            Read our Privacy Policy
          </a>
        </div>

        {/* Primary button */}
        <button
          onClick={handleConsent}
          className="w-full text-white cursor-pointer transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "#E11048",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 8,
            height: 52,
            border: "none",
          }}
        >
          I understand — let's begin
        </button>

        {/* Secondary text */}
        <p
          className="text-center mt-4"
          style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#6B7280" }}
        >
          Not ready? That's okay.
        </p>
      </div>
    </div>
  );
};

export default ConsentGate;
