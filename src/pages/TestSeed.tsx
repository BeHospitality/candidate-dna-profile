import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Temporary page: seeds localStorage with realistic assessment results
 * and redirects to /reveal so we can verify the result page.
 * DELETE THIS FILE after testing.
 */
const TestSeed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Seed participant data
    localStorage.setItem("beconnect-path", "growing");
    localStorage.setItem("beconnect-firstname", "Jessica");
    localStorage.setItem("beconnect-email", "jessica.muir@test.com");
    localStorage.setItem("beconnect-gdpr-consent", "true");
    localStorage.setItem("beconnect-participant-id", "local-test-" + Date.now());

    // Seed experience path
    localStorage.setItem("dna_experience_path", "entry");

    // Build realistic answers for 60 entry-path questions
    const answers: Record<string, any> = {};
    for (let i = 1; i <= 60; i++) {
      // Mix of answer types to produce a Whale-leaning profile
      if (i <= 12) answers[i] = i % 3; // chapter 1: multiple choice
      else if (i <= 20) answers[i] = 60 + (i % 30); // sliders
      else if (i <= 30) answers[i] = i % 4;
      else if (i <= 40) answers[i] = 50 + (i % 40);
      else if (i <= 50) answers[i] = i % 3;
      else answers[i] = 70 + (i % 20);
    }
    localStorage.setItem("dna_answers", JSON.stringify(answers));

    // Seed comprehensive result object
    const result = {
      primaryArchetype: "Whale",
      archetypeScores: { Lion: 58, Whale: 82, Falcon: 64 },
      dimensionScores: {
        "Empathy": 85,
        "Collaboration": 80,
        "Adaptability": 76,
        "Leadership": 68,
        "Autonomy": 55,
        "Attention to Detail": 72,
        "Resilience": 70,
        "Communication": 88,
        "Problem Solving": 65,
        "Cultural Sensitivity": 78,
        "Service Orientation": 82,
        "Time Management": 60,
        "Creativity": 58,
        "Emotional Regulation": 74,
        "Initiative": 63,
        "Teamwork": 86,
        "Stress Tolerance": 66,
        "Guest Focus": 79,
        "Work Ethic": 71,
        "Flexibility": 77,
        "Conflict Resolution": 69,
        "Accountability": 64,
        "Learning Agility": 73,
      },
      eqSuperpower: "Empathic Resonance",
      comprehensiveScores: {
        "Empathy": 85,
        "Collaboration": 80,
        "Adaptability": 76,
        "Leadership": 68,
        "Autonomy": 55,
      },
    };
    localStorage.setItem("dna-results", JSON.stringify(result));
    localStorage.setItem("beconnect-archetype", "Whale");

    // Navigate to reveal
    navigate("/reveal", { replace: true });
  }, [navigate]);

  return <div style={{ background: "#0f1729", color: "#fff", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Seeding test data...</div>;
};

export default TestSeed;
