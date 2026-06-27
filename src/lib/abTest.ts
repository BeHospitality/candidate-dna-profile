// A/B test: prominent archetype reveal after Chapter 1.
// Sticky per-browser assignment in localStorage. Single source of truth.
export type ArchCh1Variant = "control" | "archch1_treatment";

const KEY = "beconnect-ab-archch1";

export function getArchCh1Variant(): ArchCh1Variant {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "control" || stored === "archch1_treatment") return stored;
    const assigned: ArchCh1Variant = Math.random() < 0.5 ? "control" : "archch1_treatment";
    localStorage.setItem(KEY, assigned);
    return assigned;
  } catch {
    // localStorage unavailable, default to control without persisting.
    return "control";
  }
}
