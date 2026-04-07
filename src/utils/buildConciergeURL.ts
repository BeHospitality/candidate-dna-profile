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
  if (name) params.set("name", name);

  const email = localStorage.getItem("beconnect-email");
  if (email) params.set("email", email);

  try {
    const raw = localStorage.getItem("dna-results");
    if (raw) {
      const parsed = JSON.parse(raw);

      if (parsed.primaryArchetype) {
        params.set("archetype", parsed.primaryArchetype);
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
