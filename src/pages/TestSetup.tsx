import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/**
 * TEMPORARY — injects fake completed assessment data into localStorage
 * and redirects to /reveal for visual QA. Remove after testing.
 */
const TestSetup = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const path = params.get("path") || "growing";
    const name = params.get("name") || "TestUser";

    // Set beconnect keys
    localStorage.setItem("beconnect-path", path);
    localStorage.setItem("beconnect-firstname", name);
    localStorage.setItem("beconnect-email", "test@example.com");
    localStorage.setItem("beconnect-gdpr-consent", "true");

    // Fake answers that produce a Whale archetype (collaboration-heavy)
    const answers: Record<number, any> = {};
    for (let i = 1; i <= 60; i++) {
      answers[i] = "b"; // default MC answer
    }
    // Slider answers
    [4,9,14,19,24,29,34,39,44,49,54,59].forEach(id => { answers[id] = 7; });
    localStorage.setItem("dna-answers", JSON.stringify(answers));
    localStorage.setItem("dna_experience_path", "entry");
    localStorage.setItem("dna-entry-mode", JSON.stringify({
      mode: "public",
      candidateEmail: "test@example.com",
      candidateName: name,
    }));

    navigate("/reveal");
  }, [navigate, params]);

  return <p style={{ color: "#fff", textAlign: "center", marginTop: 100 }}>Setting up test data…</p>;
};

export default TestSetup;
