import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getQuestionsForPath } from "@/data/questions";

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

    // Build realistic answers from actual questions
    const questions = getQuestionsForPath("entry");
    const answers: Record<number, any> = {};
    for (const q of questions) {
      if (q.type === "mc" && q.options) {
        // Pick option "B" (collaboration-heavy → Whale)
        answers[q.id] = "B";
      } else if (q.type === "slider") {
        answers[q.id] = 7;
      } else if (q.type === "ranking" && q.items) {
        answers[q.id] = q.items.map((item: any) => item.text);
      }
    }

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
