/**
 * Builds a URL to hand off candidate data to the Be Connect concierge.
 * Reads localStorage values and passes them as URL params.
 */
export function buildConciergeURL(): string {
  const base = "https://connect.be.ie/concierge";
  const params = new URLSearchParams();

  const path = localStorage.getItem("beconnect-path");
  if (path) params.set("path", path);

  const name = localStorage.getItem("beconnect-firstname");
  if (name) {
    // TEMPORARY backward-compat — drop after connect.be.ie
    // (Build #1B) is verified reading first_name=. Tracking
    // ticket: post-#1B cleanup follow-up.
    params.set("name", name);
    params.set("first_name", name);
  }

  const lastName = localStorage.getItem("beconnect-lastname");
  if (lastName) params.set("last_name", lastName);

  // Boundary normalisation: canonicalise email before handing off to connect.be.ie.
  // CRITICAL: this is the cross-project boundary — email must be lowercased here.
  const emailRaw = localStorage.getItem("beconnect-email");
  const email = emailRaw ? String(emailRaw).toLowerCase().trim() : null;
  if (email) params.set("email", email);

  const assessmentId = localStorage.getItem("dna-assessment-id");
  if (assessmentId) params.set("assessment_id", assessmentId);

  try {
    const raw = localStorage.getItem("dna-results");
    if (raw) {
      const parsed = JSON.parse(raw);

      if (parsed.primaryArchetype) {
        params.set("archetype", parsed.primaryArchetype);
        params.set("dna_verified", "true");
      }

      if (parsed.eqSuperpower) {
        params.set("eq", parsed.eqSuperpower);
      }

      // Top 3 dimension scores
      const scores = parsed.dimensionScores || parsed.comprehensiveScores;
      if (scores && typeof scores === "object") {
        const top3 = Object.entries(scores as Record<string, number>)
          .filter(([, v]) => typeof v === "number")
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([k, v]) => `${k}:${Math.round(v)}`)
          .join(",");
        if (top3) params.set("scores", top3);
      }
    }
  } catch {
    // silently skip if parsing fails
  }

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
