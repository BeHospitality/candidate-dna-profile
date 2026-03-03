import { signatureCombinations, type SignatureCombination } from "@/data/signatureCombinations";

export function getSignatureCombination(
  dimensionScores: Record<string, number>
): SignatureCombination {
  for (const combo of signatureCombinations) {
    if (combo.id === "rising_force") continue;

    const highMatch = combo.high_dims.every(
      (dim) => (dimensionScores[dim] ?? 0) >= 70
    );
    const lowMatch =
      combo.low_dims.length === 0 ||
      combo.low_dims.some((dim) => (dimensionScores[dim] ?? 100) <= 39);

    if (highMatch && lowMatch) return combo;
  }

  return signatureCombinations.find((c) => c.id === "rising_force")!;
}
