export type QuestionType = "mc" | "slider" | "ranking";

export interface DimensionScores {
  autonomy: number;
  collaboration: number;
  precision: number;
  leadership: number;
  adaptability: number;
}

export interface MCOption {
  label: string;
  text: string;
  scores: DimensionScores;
}

export interface RankingItem {
  text: string;
  scores: DimensionScores;
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: MCOption[];
  leftLabel?: string;
  rightLabel?: string;
  leftScores?: DimensionScores;
  rightScores?: DimensionScores;
  items?: RankingItem[];
}

const s = (a: number, c: number, p: number, l: number, ad: number): DimensionScores => ({
  autonomy: a, collaboration: c, precision: p, leadership: l, adaptability: ad,
});

export const questions: Question[] = [
  {
    id: 1,
    type: "mc",
    text: "In a crisis, I prefer to:",
    options: [
      { label: "A", text: "Take charge immediately", scores: s(8, 2, 3, 10, 6) },
      { label: "B", text: "Rally the team first", scores: s(2, 10, 3, 5, 7) },
      { label: "C", text: "Analyze data before acting", scores: s(5, 3, 10, 3, 3) },
      { label: "D", text: "Defer to the expert", scores: s(1, 6, 7, 1, 8) },
    ],
  },
  {
    id: 2,
    type: "slider",
    text: "My ideal work environment has:",
    leftLabel: "Autonomy",
    rightLabel: "Structure",
    leftScores: s(10, 2, 3, 7, 5),
    rightScores: s(2, 5, 10, 3, 4),
  },
  {
    id: 3,
    type: "ranking",
    text: "Rank these by importance:",
    items: [
      { text: "Being the decision-maker", scores: s(8, 2, 3, 10, 5) },
      { text: "Team collaboration", scores: s(2, 10, 3, 4, 8) },
      { text: "Process excellence", scores: s(4, 3, 10, 3, 4) },
    ],
  },
  {
    id: 4,
    type: "mc",
    text: "When starting a new project, I:",
    options: [
      { label: "A", text: "Jump in and figure it out", scores: s(9, 2, 2, 7, 9) },
      { label: "B", text: "Gather the team for input", scores: s(2, 10, 4, 5, 6) },
      { label: "C", text: "Plan every detail first", scores: s(5, 3, 10, 4, 2) },
      { label: "D", text: "Look for best practices", scores: s(3, 5, 8, 2, 6) },
    ],
  },
  {
    id: 5,
    type: "mc",
    text: "I thrive when I can:",
    options: [
      { label: "A", text: "Lead initiatives independently", scores: s(10, 2, 4, 9, 5) },
      { label: "B", text: "Support others' success", scores: s(2, 10, 4, 3, 7) },
      { label: "C", text: "Perfect systems and processes", scores: s(5, 3, 10, 3, 3) },
      { label: "D", text: "Adapt quickly to change", scores: s(6, 5, 2, 5, 10) },
    ],
  },
  {
    id: 6,
    type: "mc",
    text: "Conflict at work is best handled by:",
    options: [
      { label: "A", text: "Direct confrontation", scores: s(8, 2, 3, 9, 5) },
      { label: "B", text: "Diplomatic mediation", scores: s(2, 10, 4, 5, 8) },
      { label: "C", text: "Data-driven resolution", scores: s(4, 3, 10, 4, 4) },
      { label: "D", text: "Avoiding escalation", scores: s(3, 6, 5, 1, 7) },
    ],
  },
  {
    id: 7,
    type: "slider",
    text: "My communication style is:",
    leftLabel: "Direct",
    rightLabel: "Diplomatic",
    leftScores: s(8, 3, 5, 9, 4),
    rightScores: s(3, 9, 5, 4, 8),
  },
  {
    id: 8,
    type: "mc",
    text: "I prefer to work:",
    options: [
      { label: "A", text: "Solo with full ownership", scores: s(10, 1, 5, 7, 4) },
      { label: "B", text: "In tight-knit teams", scores: s(2, 10, 4, 4, 7) },
      { label: "C", text: "With clear SOPs", scores: s(3, 4, 10, 3, 3) },
      { label: "D", text: "In fast-paced environments", scores: s(7, 5, 2, 6, 10) },
    ],
  },
  {
    id: 9,
    type: "mc",
    text: "Success to me means:",
    options: [
      { label: "A", text: "Achieving ambitious goals", scores: s(9, 2, 4, 10, 6) },
      { label: "B", text: "Lifting up my teammates", scores: s(2, 10, 3, 4, 7) },
      { label: "C", text: "Flawless execution", scores: s(4, 3, 10, 4, 3) },
      { label: "D", text: "Continuous growth", scores: s(6, 5, 4, 5, 9) },
    ],
  },
  {
    id: 10,
    type: "slider",
    text: "Rate your comfort with ambiguity:",
    leftLabel: "Low",
    rightLabel: "High",
    leftScores: s(3, 5, 10, 3, 2),
    rightScores: s(8, 5, 2, 7, 10),
  },
  {
    id: 11,
    type: "mc",
    text: "When learning, I prefer:",
    options: [
      { label: "A", text: "Experimentation", scores: s(9, 3, 3, 7, 9) },
      { label: "B", text: "Mentorship", scores: s(2, 9, 4, 3, 7) },
      { label: "C", text: "Manuals and documentation", scores: s(4, 2, 10, 2, 3) },
      { label: "D", text: "On-the-job immersion", scores: s(6, 6, 3, 5, 9) },
    ],
  },
  {
    id: 12,
    type: "mc",
    text: "My ideal role gives me:",
    options: [
      { label: "A", text: "Full authority", scores: s(10, 1, 3, 10, 5) },
      { label: "B", text: "Strong team bonds", scores: s(2, 10, 3, 3, 7) },
      { label: "C", text: "Clear expectations", scores: s(3, 4, 10, 3, 3) },
      { label: "D", text: "Variety and challenge", scores: s(7, 5, 3, 6, 10) },
    ],
  },
];
