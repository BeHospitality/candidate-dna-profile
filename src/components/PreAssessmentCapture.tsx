import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BrandHeader from "@/components/BrandHeader";
import DynamicFooter from "@/components/DynamicFooter";

type PathKey = "starting" | "growing" | "returning" | "advancing";

const PERSONA: Record<string, { emoji: string; heading: string; sub: string; btnBg: string; btnColor: string }> = {
  starting: {
    emoji: "🌱",
    heading: "Let's find out who you are",
    sub: "Before your first step in hospitality — understand what makes you great.",
    btnBg: "#E11048",
    btnColor: "#fff",
  },
  growing: {
    emoji: "🌍",
    heading: "Let's map where you belong",
    sub: "Your archetype shapes your international pathway. Let's figure it out together.",
    btnBg: "#008C72",
    btnColor: "#fff",
  },
  returning: {
    emoji: "🔄",
    heading: "Welcome back",
    sub: "Good to see you again. Enter your email and we'll check your profile.",
    btnBg: "#d97706",
    btnColor: "#fff",
  },
  advancing: {
    emoji: "⭐",
    heading: "Let's understand how you lead",
    sub: "The DNA Assessment is how we build a picture of you as a professional. Not a quiz — a mirror.",
    btnBg: "#7c3aed",
    btnColor: "#fff",
  },
};

const DEFAULT_PERSONA = {
  emoji: "🏨",
  heading: "Let's find out who you are",
  sub: "Your archetype is the foundation of everything Be Connect does for you.",
  btnBg: "#f59e0b",
  btnColor: "#0f1729",
};

interface PreAssessmentCaptureProps {
  onContinue: (participantId: string) => void;
}

const PreAssessmentCapture = ({ onContinue }: PreAssessmentCaptureProps) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [welcomeBack, setWelcomeBack] = useState<string | null>(null);

  const path = localStorage.getItem("beconnect-path") || "growing";
  const persona = PERSONA[path] || DEFAULT_PERSONA;

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!firstName.trim()) e.firstName = "First name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);

    const trimmedFirst = firstName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Returning path: check for existing record
    if (path === "returning") {
      try {
        const { data } = await supabase
          .from("dna_candidates")
          .select("first_name")
          .eq("email", trimmedEmail)
          .limit(1)
          .maybeSingle();
        if (data) {
          localStorage.setItem("beconnect-firstname", data.first_name);
          localStorage.setItem("beconnect-email", trimmedEmail);
          setWelcomeBack(data.first_name);
          setTimeout(() => finishCapture(data.first_name, trimmedEmail), 1500);
          return;
        }
      } catch {
        // proceed as new
      }
    }

    // Store to DB
    try {
      let sid = localStorage.getItem("beconnect-session-id");
      if (!sid) {
        sid = crypto.randomUUID();
        localStorage.setItem("beconnect-session-id", sid);
      }
      await supabase.from("dna_candidates").insert({
        first_name: trimmedFirst,
        email: trimmedEmail,
        path,
        session_id: sid,
      });
      // Fire profile to Hub pipeline (non-blocking)
      try {
        await supabase.functions.invoke('hub-relay', {
          body: {
            candidate_email: trimmedEmail,
            candidate_name: trimmedFirst,
            candidate_path: path,
            profile_created_at: new Date().toISOString(),
          },
        });
      } catch (relayErr) {
        console.error('[registration] hub-relay:', relayErr);
      }
    } catch (err) {
      console.error("Pre-assessment capture insert failed:", err);
    }

    finishCapture(trimmedFirst, trimmedEmail);
  };

  const finishCapture = (name: string, emailVal: string) => {
    localStorage.setItem("beconnect-firstname", name);
    localStorage.setItem("beconnect-email", emailVal);
    const participantId = "local-" + Date.now();
    localStorage.setItem("beconnect-participant-id", participantId);
    onContinue(participantId);
  };

  if (welcomeBack) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#0f1729" }}>
        <BrandHeader />
        <div className="flex-1 flex items-center justify-center px-6">
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#d97706", textAlign: "center" }}>
            Welcome back, {welcomeBack}. Your profile is still here.
          </p>
        </div>
        <DynamicFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f1729" }}>
      <BrandHeader />
      <div className="flex-1 flex items-center justify-center px-6">
        <div style={{ maxWidth: 440, width: "100%", padding: "40px 0" }}>
          {/* Persona greeting */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36 }}>{persona.emoji}</div>
            <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 700, color: "#fff", marginTop: 12, marginBottom: 6 }}>
              {persona.heading}
            </h1>
            <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, color: "#9CA3AF", lineHeight: 1.7, marginBottom: 24 }}>
              {persona.sub}
            </p>
          </div>

          {/* First Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 4 }}>
              FIRST NAME
            </label>
            <input
              type="text"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: undefined })); }}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#1a2640", border: `1px solid ${errors.firstName ? "#E11048" : "#374151"}`,
                borderRadius: 8, height: 48, padding: "0 14px",
                fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "#fff", outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
              onBlur={(e) => (e.target.style.borderColor = errors.firstName ? "#E11048" : "#374151")}
            />
            {errors.firstName && (
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#E11048", marginTop: 4 }}>{errors.firstName}</p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 4 }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "#1a2640", border: `1px solid ${errors.email ? "#E11048" : "#374151"}`,
                borderRadius: 8, height: 48, padding: "0 14px",
                fontFamily: "DM Sans, sans-serif", fontSize: 14, color: "#fff", outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
              onBlur={(e) => (e.target.style.borderColor = errors.email ? "#E11048" : "#374151")}
            />
            {errors.email && (
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#E11048", marginTop: 4 }}>{errors.email}</p>
            )}
          </div>

          {/* Consent */}
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#6b7280", marginTop: 12, marginBottom: 16 }}>
            By continuing you agree to our{" "}
            <a href="https://be.ie/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#008C72", textDecoration: "underline" }}>
              Privacy Notice
            </a>
          </p>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%", height: 52, borderRadius: 8, border: "none",
              fontFamily: "DM Sans, sans-serif", fontSize: 14, fontWeight: 600,
              background: persona.btnBg, color: persona.btnColor,
              cursor: submitting ? "wait" : "pointer", marginTop: 4,
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Starting…" : "Start my DNA assessment →"}
          </button>

          {/* Footer text */}
          <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "#4b5563", textAlign: "center", marginTop: 12 }}>
            Free · No CV needed · Results in 5 minutes
          </p>
        </div>
      </div>
      <DynamicFooter />
    </div>
  );
};

export default PreAssessmentCapture;
