import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "@/data/questions";

const TestSeed = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.setItem("beconnect-path", "growing");
    localStorage.setItem("beconnect-firstname", "Jessica");
    localStorage.setItem("beconnect-email", "jessica.muir@test.com");
    localStorage.setItem("beconnect-gdpr-consent", "true");
    localStorage.setItem("dna-participant-id", "local-test-" + Date.now());
    localStorage.setItem("dna_experience_path", "entry");
    localStorage.setItem("dna-entry-mode", JSON.stringify({ mode: "public", candidateEmail: "jessica.muir@test.com", candidateName: "Jessica" }));
    const answers: Record<number, any> = {};
    questions.forEach((q) => {
      if (q.type === "mc" && q.options) answers[q.id] = "B";
      else if (q.type === "slider") answers[q.id] = 7;
      else if (q.type === "ranking" && q.items) answers[q.id] = q.items.map((i) => i.text);
    });
    localStorage.setItem("dna-answers", JSON.stringify(answers));
    navigate("/reveal", { replace: true });
  }, [navigate]);
  return <div style={{ background: "#0f1729", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Seeding...</div>;
};
export default TestSeed;
