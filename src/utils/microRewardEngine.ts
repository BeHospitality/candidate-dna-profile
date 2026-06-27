export type MicroRewardContent = {
  emoji: string;
  insight: string;
  sublabel: string;
  /** The dimension key this insight derives from (used to avoid repeats). */
  dim?: string;
};

const TRIGGER_POSITIONS = [7, 17, 27, 37, 47, 57, 67];
const BOUNDARY_BUFFER = 2;
const CHAPTER_BOUNDARIES = [11, 26, 46, 61, 76];

/** Score gap (on the 0-100 comprehensive scale) the top eligible dimension
 *  must beat the runner-up by before we name it. Avoids near-tie reveals. */
export const MICRO_MARGIN = 5;

export const INSIGHT_MAP: Record<string, MicroRewardContent> = {
  leadership:         { emoji: "👑", insight: "Natural command is emerging", sublabel: "Rooms reorganise around you." },
  precision:          { emoji: "🎯", insight: "Your precision is standing out", sublabel: "You catch what others miss." },
  empathy:            { emoji: "🌊", insight: "Your emotional intelligence is high", sublabel: "You read rooms others can't." },
  adaptability:       { emoji: "⚡", insight: "You're built for change", sublabel: "Disruption energises you." },
  collaboration:      { emoji: "🤝", insight: "Team architecture is your strength", sublabel: "Teams work better with you in them." },
  conscientiousness:  { emoji: "🏗️", insight: "Your reliability is clear", sublabel: "If you said it, consider it done." },
  problemSolving:     { emoji: "🔍", insight: "Strong problem-solving profile", sublabel: "You find routes when others see dead ends." },
  attentionToDetail:  { emoji: "🔬", insight: "Nothing gets past you", sublabel: "You catch what everyone else walks past." },
  learningSpeed:      { emoji: "🚀", insight: "Fast adapter identified", sublabel: "You hit the ground running, every time." },
  patternRecognition: { emoji: "🧩", insight: "Pattern recognition is high", sublabel: "You see what's coming before it arrives." },
  concentration:      { emoji: "🎯", insight: "Deep focus is a strength", sublabel: "When you're in, you're fully in." },
  extraversion:       { emoji: "✨", insight: "Social energy is high", sublabel: "Guests feel you before you've said a word." },
  openness:           { emoji: "🌍", insight: "Curiosity is a core trait", sublabel: "You improve things by questioning them." },
  agreeableness:      { emoji: "🌿", insight: "Harmonising strength identified", sublabel: "Teams work better when you're in them." },
  emotionalStability: { emoji: "⚓", insight: "Remarkable stability under pressure", sublabel: "Teams calibrate to you." },
  autonomy:           { emoji: "🦅", insight: "Independent thinker identified", sublabel: "You work best when trusted and given space." },
  readingOthers:      { emoji: "👁️", insight: "You read between the lines", sublabel: "You notice what others miss entirely." },
  selfRegulation:     { emoji: "🛡️", insight: "Composure under pressure", sublabel: "You choose your response, even under fire." },
  socialAwareness:    { emoji: "🎭", insight: "You read the room", sublabel: "You know what's happening before it's said." },
  integrity:          { emoji: "⚖️", insight: "Your integrity is evident", sublabel: "You do the right thing, especially when nobody's watching." },
  ruleFollowing:      { emoji: "📋", insight: "Standards anchor showing", sublabel: "Operations rely on people like you." },
  safetyConsciousness:{ emoji: "🔒", insight: "Safety-first mindset identified", sublabel: "You see hazards before they become incidents." },
  dependability:      { emoji: "⚙️", insight: "Dependability is a pattern", sublabel: "People can count on you, consistently." },
};

export function getMicroReward(
  dimensionScores: Record<string, number>,
  questionIndex: number,
  firedPositions: Set<number>,
  shownDimensions: Set<string> = new Set()
): MicroRewardContent | null {
  if (!TRIGGER_POSITIONS.includes(questionIndex)) return null;
  if (firedPositions.has(questionIndex)) return null;

  const nearBoundary = CHAPTER_BOUNDARIES.some(
    (b) => Math.abs(questionIndex - b) <= BOUNDARY_BUFFER
  );
  if (nearBoundary) return null;

  // Deterministic tie-break: sort by score desc, then dimension key asc.
  const sorted = Object.entries(dimensionScores)
    .filter(([dim, score]) => score > 20 && INSIGHT_MAP[dim])
    .sort(([a, sa], [b, sb]) => (sb - sa) || a.localeCompare(b));

  if (sorted.length === 0) return null;

  // Find the highest-scoring not-yet-shown dimension.
  const topIdx = sorted.findIndex(([dim]) => !shownDimensions.has(dim));
  if (topIdx === -1) return null;

  const [topDim, topScore] = sorted[topIdx];

  // Margin check against the next eligible candidate (>20), whether shown or
  // not. If the gap is too thin we skip rather than name a near-tie.
  const runnerUp = sorted[topIdx + 1];
  if (runnerUp && topScore - runnerUp[1] < MICRO_MARGIN) return null;

  return { ...INSIGHT_MAP[topDim], dim: topDim };
}
