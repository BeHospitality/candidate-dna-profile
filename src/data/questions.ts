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

// ==============================
// BRANCHING SYSTEM (additive)
// ==============================

export type ExperiencePath = 'entry' | 'experienced' | 'executive';

export type LayerType = 'archetype' | 'cognitive' | 'personality' | 'eq' | 'reliability' | 'career';

export interface BranchedMCOption {
  label: string;
  text: string;
  scores: Record<string, number>;
}

export interface BranchedRankingItem {
  text: string;
  scores: Record<string, number>;
}

export interface BranchedQuestion {
  id: number;
  type: QuestionType;
  text: string;
  options?: BranchedMCOption[];
  leftLabel?: string;
  rightLabel?: string;
  leftScores?: Record<string, number>;
  rightScores?: Record<string, number>;
  items?: BranchedRankingItem[];
  layer: LayerType;
  paths: ExperiencePath[];
  dimensionKey: string;
}

const allPaths: ExperiencePath[] = ['entry', 'experienced', 'executive'];

// Wrap existing 12 questions with branching metadata
function wrapExisting(q: Question, dimensionKey: string): BranchedQuestion {
  return {
    id: q.id,
    type: q.type,
    text: q.text,
    options: q.options?.map(o => ({ label: o.label, text: o.text, scores: { ...o.scores } })),
    leftLabel: q.leftLabel,
    rightLabel: q.rightLabel,
    leftScores: q.leftScores ? { ...q.leftScores } : undefined,
    rightScores: q.rightScores ? { ...q.rightScores } : undefined,
    items: q.items?.map(i => ({ text: i.text, scores: { ...i.scores } })),
    layer: 'archetype',
    paths: allPaths,
    dimensionKey,
  };
}

export const questionBank: BranchedQuestion[] = [
  // === LAYER 1: ARCHETYPE FOUNDATION (existing Q1-Q12) ===
  wrapExisting(questions[0], 'leadership'),    // Q1
  wrapExisting(questions[1], 'autonomy'),      // Q2
  wrapExisting(questions[2], 'leadership'),    // Q3
  wrapExisting(questions[3], 'autonomy'),      // Q4
  wrapExisting(questions[4], 'autonomy'),      // Q5
  wrapExisting(questions[5], 'leadership'),    // Q6
  wrapExisting(questions[6], 'leadership'),    // Q7
  wrapExisting(questions[7], 'autonomy'),      // Q8
  wrapExisting(questions[8], 'leadership'),    // Q9
  wrapExisting(questions[9], 'adaptability'),  // Q10
  wrapExisting(questions[10], 'autonomy'),     // Q11
  wrapExisting(questions[11], 'autonomy'),     // Q12

  // === LAYER 2: COGNITIVE APTITUDE (Q13-Q27) — ALL paths ===

  // Q13 — Problem Solving (MC)
  {
    id: 13, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "problemSolving",
    text: "A guest says their room key isn't working. The front desk is busy. What's your first move?",
    options: [
      { label: "A", text: "Try the key yourself to see if it's a user issue", scores: { problemSolving: 8, attentionToDetail: 4 } },
      { label: "B", text: "Immediately make a new key card", scores: { problemSolving: 5, attentionToDetail: 2 } },
      { label: "C", text: "Call maintenance to check the door lock", scores: { problemSolving: 3, attentionToDetail: 3 } },
      { label: "D", text: "Apologize and ask them to wait for the front desk", scores: { problemSolving: 2, attentionToDetail: 1 } },
    ],
  },

  // Q14 — Problem Solving (MC)
  {
    id: 14, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "problemSolving",
    text: "You're setting up for an event and realize you're 10 chairs short. The event starts in 30 minutes. You:",
    options: [
      { label: "A", text: "Check nearby conference rooms and borrow chairs immediately", scores: { problemSolving: 9, adaptability: 6 } },
      { label: "B", text: "Call your manager to ask what to do", scores: { problemSolving: 3, adaptability: 2 } },
      { label: "C", text: "Rearrange the layout to need fewer chairs", scores: { problemSolving: 8, adaptability: 8 } },
      { label: "D", text: "Wait for someone else to notice and handle it", scores: { problemSolving: 1, adaptability: 1 } },
    ],
  },

  // Q15 — Problem Solving (MC)
  {
    id: 15, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "problemSolving",
    text: "Two guests have been given the same table reservation for 8pm tonight. You need to resolve this. You:",
    options: [
      { label: "A", text: "Check who booked first and honour that reservation, offer the other a comparable alternative with a complimentary drink", scores: { problemSolving: 9, readingOthers: 5 } },
      { label: "B", text: "Ask both parties if they'd mind waiting 15 minutes", scores: { problemSolving: 5, readingOthers: 3 } },
      { label: "C", text: "Immediately escalate to the manager", scores: { problemSolving: 3, readingOthers: 2 } },
      { label: "D", text: "Seat whoever arrives first", scores: { problemSolving: 4, readingOthers: 1 } },
    ],
  },

  // Q16 — Attention to Detail (MC)
  {
    id: 16, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "attentionToDetail",
    text: "You're checking a banquet setup against the event order. What do you pay most attention to?",
    options: [
      { label: "A", text: "Every single item: napkin folds, glass placement, chair alignment, centrepieces, menu cards", scores: { attentionToDetail: 9, precision: 6 } },
      { label: "B", text: "The big things: table count, chair count, AV setup", scores: { attentionToDetail: 5, precision: 4 } },
      { label: "C", text: "Whatever the client specifically mentioned", scores: { attentionToDetail: 6, precision: 3 } },
      { label: "D", text: "As long as it looks good overall, the details will sort themselves", scores: { attentionToDetail: 2, precision: 1 } },
    ],
  },

  // Q17 — Attention to Detail (Slider)
  {
    id: 17, type: "slider", layer: "cognitive", paths: allPaths, dimensionKey: "attentionToDetail",
    text: "A guest's name is spelled unusually — 'Caoimhe' instead of what you might expect. How carefully do you check the spelling before writing it on anything?",
    leftLabel: "I'd spell it how it sounds — close enough",
    rightLabel: "I triple-check every letter, every time",
    leftScores: { attentionToDetail: 2 },
    rightScores: { attentionToDetail: 10, precision: 5 },
  },

  // Q18 — Attention to Detail (MC)
  {
    id: 18, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "attentionToDetail",
    text: "You're reviewing tomorrow's breakfast buffet checklist. You notice the gluten-free labels aren't listed. You:",
    options: [
      { label: "A", text: "Add them immediately — allergen labelling is critical for guest safety", scores: { attentionToDetail: 10, safetyConsciousness: 8 } },
      { label: "B", text: "Make a note to mention it to the kitchen", scores: { attentionToDetail: 6, safetyConsciousness: 4 } },
      { label: "C", text: "Assume the kitchen will handle their own labels", scores: { attentionToDetail: 3, safetyConsciousness: 2 } },
      { label: "D", text: "Only worry about it if a guest asks", scores: { attentionToDetail: 1, safetyConsciousness: 1 } },
    ],
  },

  // Q19 — Learning Speed (Slider)
  {
    id: 19, type: "slider", layer: "cognitive", paths: allPaths, dimensionKey: "learningSpeed",
    text: "Your property switches to a new booking system. Everyone gets a 2-hour training session. After the training, how confident are you using it on your own?",
    leftLabel: "I'd need a lot more practice and support",
    rightLabel: "I'd be comfortable navigating it solo",
    leftScores: { learningSpeed: 2 },
    rightScores: { learningSpeed: 9, adaptability: 5 },
  },

  // Q20 — Learning Speed (MC)
  {
    id: 20, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "learningSpeed",
    text: "You're shown how to make a cocktail once. How many times do you need to make it before you've memorised the recipe?",
    options: [
      { label: "A", text: "Once or twice — I pick things up fast", scores: { learningSpeed: 9 } },
      { label: "B", text: "Three to five times — practice makes perfect", scores: { learningSpeed: 6 } },
      { label: "C", text: "I'd want the recipe card nearby for at least a week", scores: { learningSpeed: 4 } },
      { label: "D", text: "I'd keep the recipe card permanently — why memorise?", scores: { learningSpeed: 2, precision: 4 } },
    ],
  },

  // Q21 — Learning Speed (MC)
  {
    id: 21, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "learningSpeed",
    text: "A new allergen regulation comes into effect next month. You:",
    options: [
      { label: "A", text: "Read up on it immediately and share key points with the team", scores: { learningSpeed: 9, leadership: 5 } },
      { label: "B", text: "Wait for the official training session", scores: { learningSpeed: 5, ruleFollowing: 5 } },
      { label: "C", text: "Skim the summary and figure it out as you go", scores: { learningSpeed: 4, adaptability: 3 } },
      { label: "D", text: "Assume management will tell you what's changed", scores: { learningSpeed: 2 } },
    ],
  },

  // Q22 — Pattern Recognition (MC)
  {
    id: 22, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "patternRecognition",
    text: "You notice that every Friday evening, the same three tables complain about slow service. What's likely happening?",
    options: [
      { label: "A", text: "Friday shift is probably understaffed relative to bookings — check the roster pattern", scores: { patternRecognition: 9, problemSolving: 6 } },
      { label: "B", text: "Those tables might be in a server's blind spot", scores: { patternRecognition: 7, attentionToDetail: 5 } },
      { label: "C", text: "Friday guests are probably just more impatient after a long week", scores: { patternRecognition: 3 } },
      { label: "D", text: "Random coincidence — I wouldn't read too much into it", scores: { patternRecognition: 1 } },
    ],
  },

  // Q23 — Pattern Recognition (Slider)
  {
    id: 23, type: "slider", layer: "cognitive", paths: allPaths, dimensionKey: "patternRecognition",
    text: "When you see numbers — like guest satisfaction scores or weekly covers — do you naturally look for trends and patterns?",
    leftLabel: "Numbers are numbers, I focus on the day in front of me",
    rightLabel: "I instinctively look for what's rising, falling, or repeating",
    leftScores: { patternRecognition: 2 },
    rightScores: { patternRecognition: 9, attentionToDetail: 4 },
  },

  // Q24 — Pattern Recognition (MC)
  {
    id: 24, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "patternRecognition",
    text: "Your hotel's bar revenue is down 15% this month but food is up 10%. What's your first theory?",
    options: [
      { label: "A", text: "Guests are dining in more but drinking less — maybe pricing or menu change?", scores: { patternRecognition: 9, problemSolving: 7 } },
      { label: "B", text: "Bar staff might have changed — service quality dropped", scores: { patternRecognition: 6, problemSolving: 5 } },
      { label: "C", text: "Seasonal variation — probably nothing", scores: { patternRecognition: 3 } },
      { label: "D", text: "Not my department, I wouldn't think about it", scores: { patternRecognition: 1 } },
    ],
  },

  // Q25 — Concentration (Slider)
  {
    id: 25, type: "slider", layer: "cognitive", paths: allPaths, dimensionKey: "concentration",
    text: "During a busy Saturday night service, a colleague asks you something while you're taking a complicated order. How easily do you lose track?",
    leftLabel: "I'd completely lose my place and need to start over",
    rightLabel: "I can hold the order in my head, respond to them, and continue seamlessly",
    leftScores: { concentration: 2 },
    rightScores: { concentration: 9, adaptability: 4 },
  },

  // Q26 — Concentration (MC)
  {
    id: 26, type: "mc", layer: "cognitive", paths: allPaths, dimensionKey: "concentration",
    text: "You're doing a stocktake count in a busy kitchen. People keep walking past and talking. You:",
    options: [
      { label: "A", text: "Stay locked in — distractions don't break my count", scores: { concentration: 9, precision: 5 } },
      { label: "B", text: "Pause, respond briefly, then pick up where I left off", scores: { concentration: 6, collaboration: 4 } },
      { label: "C", text: "Lose count often and have to restart sections", scores: { concentration: 3 } },
      { label: "D", text: "Ask someone else to do it — I can't focus in that environment", scores: { concentration: 1 } },
    ],
  },

  // Q27 — Concentration (Ranking)
  {
    id: 27, type: "ranking", layer: "cognitive", paths: allPaths, dimensionKey: "concentration",
    text: "Rank these by how well you maintain focus on each:",
    items: [
      { text: "Repetitive tasks (polishing cutlery, folding napkins)", scores: { concentration: 1 } },
      { text: "Long briefings or training sessions", scores: { concentration: 1 } },
      { text: "Detailed paperwork (rosters, stock orders)", scores: { concentration: 1, attentionToDetail: 1 } },
      { text: "Multi-table service during rush hour", scores: { concentration: 1, adaptability: 1 } },
    ],
  },

  // === LAYER 3: PERSONALITY — BIG 5 (Q28-Q37) — ALL paths ===

  // Q28 — Extraversion (MC)
  {
    id: 28, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "extraversion",
    text: "Your property is hosting a big charity gala tonight. Before the event, you feel:",
    options: [
      { label: "A", text: "Buzzing — I love the energy of big events and meeting new people", scores: { extraversion: 9 } },
      { label: "B", text: "Excited but pacing myself — I know it'll be draining", scores: { extraversion: 6 } },
      { label: "C", text: "A bit anxious — I prefer smaller, more intimate settings", scores: { extraversion: 3 } },
      { label: "D", text: "Dread — I'd rather work behind the scenes tonight", scores: { extraversion: 1 } },
    ],
  },

  // Q29 — Extraversion (Slider)
  {
    id: 29, type: "slider", layer: "personality", paths: allPaths, dimensionKey: "extraversion",
    text: "After a long, people-heavy shift, how do you recharge?",
    leftLabel: "Alone time — silence, no people, decompress",
    rightLabel: "More socialising — I go meet friends or stay for staff drinks",
    leftScores: { extraversion: 2 },
    rightScores: { extraversion: 9 },
  },

  // Q30 — Conscientiousness (MC)
  {
    id: 30, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "conscientiousness",
    text: "You're closing up the bar and it's 1am. You notice the ice well hasn't been drained — something the morning shift would eventually catch. You:",
    options: [
      { label: "A", text: "Drain it now. It's part of proper close-down, regardless of who notices", scores: { conscientiousness: 9, integrity: 6 } },
      { label: "B", text: "Drain it now because I'd be embarrassed if the morning team saw", scores: { conscientiousness: 7, integrity: 3 } },
      { label: "C", text: "Leave it — it's not going to cause any harm overnight", scores: { conscientiousness: 3 } },
      { label: "D", text: "I wouldn't have noticed it", scores: { conscientiousness: 1, attentionToDetail: 1 } },
    ],
  },

  // Q31 — Conscientiousness (Slider)
  {
    id: 31, type: "slider", layer: "personality", paths: allPaths, dimensionKey: "conscientiousness",
    text: "How organised is your personal workspace (locker, section, station) at the end of every shift?",
    leftLabel: "Functional chaos — I know where things are, roughly",
    rightLabel: "Everything has a place and is in its place, every single time",
    leftScores: { conscientiousness: 2 },
    rightScores: { conscientiousness: 9, precision: 5 },
  },

  // Q32 — Openness (MC)
  {
    id: 32, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "openness",
    text: "The head chef introduces a completely new tasting menu with ingredients you've never heard of. Your reaction:",
    options: [
      { label: "A", text: "Brilliant — I want to taste everything and learn about each ingredient", scores: { openness: 9, learningSpeed: 5 } },
      { label: "B", text: "Interesting — I'll learn what I need to describe it to guests", scores: { openness: 6, learningSpeed: 4 } },
      { label: "C", text: "I preferred the old menu — why fix what wasn't broken?", scores: { openness: 3 } },
      { label: "D", text: "I'll just read the descriptions from the menu card", scores: { openness: 1 } },
    ],
  },

  // Q33 — Openness (MC)
  {
    id: 33, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "openness",
    text: "A guest asks you to recommend something 'completely different' — they want to be surprised. You:",
    options: [
      { label: "A", text: "Love this — I suggest something creative and unconventional that I'm genuinely excited about", scores: { openness: 9, extraversion: 4 } },
      { label: "B", text: "Suggest our most popular dish — it's popular for a reason", scores: { openness: 4, conscientiousness: 3 } },
      { label: "C", text: "Ask more questions first — 'different' means different things to different people", scores: { openness: 6, readingOthers: 6 } },
      { label: "D", text: "Feel uncomfortable — I prefer straightforward requests", scores: { openness: 2 } },
    ],
  },

  // Q34 — Agreeableness (MC)
  {
    id: 34, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "agreeableness",
    text: "A colleague makes a mistake on a table's order and the guest is upset. Your colleague is visibly stressed. You:",
    options: [
      { label: "A", text: "Step in to help with the guest AND check on your colleague afterwards", scores: { agreeableness: 9, empathy: 7 } },
      { label: "B", text: "Handle the guest situation, but leave the colleague to manage their own feelings", scores: { agreeableness: 5, problemSolving: 5 } },
      { label: "C", text: "Focus on your own tables — they'll figure it out", scores: { agreeableness: 2 } },
      { label: "D", text: "Privately tell your colleague what they should have done differently", scores: { agreeableness: 3, leadership: 4 } },
    ],
  },

  // Q35 — Agreeableness (Ranking)
  {
    id: 35, type: "ranking", layer: "personality", paths: allPaths, dimensionKey: "agreeableness",
    text: "Rank what matters most to you in a team environment:",
    items: [
      { text: "Everyone gets along and supports each other", scores: { agreeableness: 1 } },
      { text: "Clear roles and everyone pulling their weight", scores: { conscientiousness: 1 } },
      { text: "Open, honest feedback — even when it's uncomfortable", scores: { openness: 1, integrity: 1 } },
      { text: "A strong leader who makes clear decisions", scores: { leadership: 1 } },
    ],
  },

  // Q36 — Emotional Stability (MC)
  {
    id: 36, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "emotionalStability",
    text: "Three things go wrong in 10 minutes: a guest complaint, a spilled tray, and a no-show colleague. Internally you feel:",
    options: [
      { label: "A", text: "Calm focus — this is what the job is, I handle each one in order", scores: { emotionalStability: 9, concentration: 5 } },
      { label: "B", text: "A spike of stress, but I channel it into action", scores: { emotionalStability: 7, adaptability: 5 } },
      { label: "C", text: "Overwhelmed — I need a moment to collect myself before I can respond", scores: { emotionalStability: 4 } },
      { label: "D", text: "Flustered and frustrated — I might snap at someone", scores: { emotionalStability: 2 } },
    ],
  },

  // Q37 — Emotional Stability (Slider)
  {
    id: 37, type: "slider", layer: "personality", paths: allPaths, dimensionKey: "emotionalStability",
    text: "You receive critical feedback from your manager after a shift you thought went well. How does it affect you?",
    leftLabel: "It ruins my evening — I replay it in my head for days",
    rightLabel: "I take it on board, process it, and move on fairly quickly",
    leftScores: { emotionalStability: 2 },
    rightScores: { emotionalStability: 9, openness: 4 },
  },

  // === LAYER 3: PERSONALITY — BIG 5 continued (Q38-Q47) — ALL paths ===

  // Q38 — Extraversion (MC)
  {
    id: 38, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "extraversion",
    text: "You're asked to give a short welcome speech to a group of 40 new seasonal staff. Your honest reaction:",
    options: [
      { label: "A", text: "Brilliant — I'll wing it, feed off the crowd's energy, and make it memorable", scores: { extraversion: 9, leadership: 5 } },
      { label: "B", text: "Happy to do it, but I'd like to prepare a few bullet points first", scores: { extraversion: 7, conscientiousness: 4 } },
      { label: "C", text: "I'd do it if asked, but I'd be counting down the seconds until it's over", scores: { extraversion: 4 } },
      { label: "D", text: "I'd find a way to delegate it to someone who enjoys that sort of thing", scores: { extraversion: 2, autonomy: 4 } },
    ],
  },

  // Q39 — Extraversion (MC)
  {
    id: 39, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "extraversion",
    text: "During a quiet midweek shift, you find yourself with 20 minutes of downtime. You naturally gravitate towards:",
    options: [
      { label: "A", text: "Finding a colleague to chat with — silence makes me restless", scores: { extraversion: 9 } },
      { label: "B", text: "Checking in with tables or guests — I'll create conversation", scores: { extraversion: 8, collaboration: 4 } },
      { label: "C", text: "Restocking, cleaning, or organising something quietly", scores: { extraversion: 3, conscientiousness: 5 } },
      { label: "D", text: "Enjoying the calm — peace and quiet is rare in this job", scores: { extraversion: 1 } },
    ],
  },

  // Q40 — Conscientiousness (MC)
  {
    id: 40, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "conscientiousness",
    text: "Your manager asks you to train a new starter on closing procedures. How do you approach it?",
    options: [
      { label: "A", text: "Write a step-by-step checklist, walk them through it twice, then observe them doing it solo", scores: { conscientiousness: 9, leadership: 5, attentionToDetail: 5 } },
      { label: "B", text: "Show them once thoroughly and tell them to ask if they're stuck", scores: { conscientiousness: 6, leadership: 3 } },
      { label: "C", text: "Walk through it together casually — they'll pick it up", scores: { conscientiousness: 4 } },
      { label: "D", text: "Tell them to shadow someone else who's been doing it longer", scores: { conscientiousness: 2 } },
    ],
  },

  // Q41 — Conscientiousness (Slider)
  {
    id: 41, type: "slider", layer: "personality", paths: allPaths, dimensionKey: "conscientiousness",
    text: "A task has been assigned to you with a deadline of Friday. It's now Tuesday. When do you start?",
    leftLabel: "Friday morning — I work best under pressure",
    rightLabel: "Tuesday afternoon — I like to get ahead of deadlines",
    leftScores: { conscientiousness: 2, adaptability: 4 },
    rightScores: { conscientiousness: 9 },
  },

  // Q42 — Openness (Slider)
  {
    id: 42, type: "slider", layer: "personality", paths: allPaths, dimensionKey: "openness",
    text: "Your hotel launches a cultural exchange programme with a sister property in Dubai. Staff can swap for 3 months. How interested are you?",
    leftLabel: "Not for me — I'm happy where I am",
    rightLabel: "I'd be first to sign up — what an experience",
    leftScores: { openness: 2 },
    rightScores: { openness: 9, adaptability: 6 },
  },

  // Q43 — Openness (MC)
  {
    id: 43, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "openness",
    text: "A guest asks for a recommendation you've never been asked before — 'Where can I do something truly unique in the area that no tourist would know about?' You:",
    options: [
      { label: "A", text: "Love this challenge — I'd think creatively, maybe suggest a local farmer's market, a hidden walking trail, or a traditional music session in a nearby pub", scores: { openness: 9, problemSolving: 5 } },
      { label: "B", text: "Check our concierge book and suggest the top-rated local experiences", scores: { openness: 5, conscientiousness: 4 } },
      { label: "C", text: "Suggest the usual tourist attractions — they're popular for a reason", scores: { openness: 3 } },
      { label: "D", text: "Refer them to the concierge or front desk — that's their expertise", scores: { openness: 1 } },
    ],
  },

  // Q44 — Agreeableness (MC)
  {
    id: 44, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "agreeableness",
    text: "During a team meeting, a colleague suggests an idea you think is genuinely bad. It would create more work and worse guest experience. You:",
    options: [
      { label: "A", text: "Say nothing in the meeting, then raise your concerns privately with the manager afterwards", scores: { agreeableness: 7, selfRegulation: 5 } },
      { label: "B", text: "Respectfully disagree in the meeting, explain your reasoning, and suggest an alternative", scores: { agreeableness: 5, leadership: 6, openness: 4 } },
      { label: "C", text: "Go along with it — keeping the peace matters more than being right", scores: { agreeableness: 9 } },
      { label: "D", text: "Directly say it won't work and explain why — the team needs honest feedback", scores: { agreeableness: 3, integrity: 6 } },
    ],
  },

  // Q45 — Agreeableness (Slider)
  {
    id: 45, type: "slider", layer: "personality", paths: allPaths, dimensionKey: "agreeableness",
    text: "A guest makes a request that's technically against policy but wouldn't cause any real harm. How far do you bend?",
    leftLabel: "Policy is policy — I explain why I can't and offer alternatives",
    rightLabel: "I make it happen — happy guests matter more than rigid rules",
    leftScores: { agreeableness: 3, ruleFollowing: 8 },
    rightScores: { agreeableness: 9, ruleFollowing: 2 },
  },

  // Q46 — Emotional Stability (MC)
  {
    id: 46, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "emotionalStability",
    text: "You make a visible mistake during a busy service — wrong dish to the wrong table, and the entire section noticed. Immediately after fixing it, you:",
    options: [
      { label: "A", text: "Shake it off quickly — mistakes happen, I'll be sharper for the rest of the shift", scores: { emotionalStability: 9, adaptability: 5 } },
      { label: "B", text: "Feel embarrassed for a few minutes but refocus before it affects the next table", scores: { emotionalStability: 7 } },
      { label: "C", text: "Replay it in my head for the rest of the shift — it rattles my confidence", scores: { emotionalStability: 3 } },
      { label: "D", text: "Get frustrated with myself and it starts affecting my other tables", scores: { emotionalStability: 1 } },
    ],
  },

  // Q47 — Emotional Stability (MC)
  {
    id: 47, type: "mc", layer: "personality", paths: allPaths, dimensionKey: "emotionalStability",
    text: "Your roster gets changed last minute — your day off is cancelled because a colleague called in sick. You:",
    options: [
      { label: "A", text: "Annoying, but I understand — I come in and make the best of it", scores: { emotionalStability: 8, agreeableness: 5, dependability: 6 } },
      { label: "B", text: "Come in but make sure the manager knows this can't keep happening", scores: { emotionalStability: 7, selfRegulation: 5, leadership: 3 } },
      { label: "C", text: "It throws off my whole week — I come in but I'm visibly frustrated", scores: { emotionalStability: 4 } },
      { label: "D", text: "I say no — my day off is my day off, roster changes need proper notice", scores: { emotionalStability: 5, autonomy: 7, ruleFollowing: 4 } },
    ],
  },

  // === LAYER 4: EMOTIONAL INTELLIGENCE (Q48-Q62) — experienced & executive ONLY ===

  // Q48 — Reading Others (MC)
  {
    id: 48, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "readingOthers",
    text: "A regular guest arrives for dinner. They smile and say 'lovely to be back' but their body language is tense and they keep checking their phone. You:",
    options: [
      { label: "A", text: "Seat them at their favourite table, but give them space — something's clearly on their mind. Check in gently after they've settled", scores: { readingOthers: 9, empathy: 5 } },
      { label: "B", text: "Engage them in warm conversation to lift their mood", scores: { readingOthers: 5, extraversion: 5 } },
      { label: "C", text: "Take their words at face value — they said they're happy to be here", scores: { readingOthers: 2 } },
      { label: "D", text: "Seat them quickly and efficiently — don't overthink it", scores: { readingOthers: 1 } },
    ],
  },

  // Q49 — Reading Others (Slider)
  {
    id: 49, type: "slider", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "readingOthers",
    text: "How quickly can you usually tell if a colleague is having a bad day, even if they haven't said anything?",
    leftLabel: "I don't usually notice unless they tell me directly",
    rightLabel: "I pick it up within minutes from their tone, pace, or body language",
    leftScores: { readingOthers: 2 },
    rightScores: { readingOthers: 9, empathy: 4 },
  },

  // Q50 — Reading Others (MC)
  {
    id: 50, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "readingOthers",
    text: "During a team briefing, your manager announces a new policy. Most of the team nods along, but you notice two colleagues exchanging a look. You:",
    options: [
      { label: "A", text: "Make a mental note — they clearly have concerns. I'll check in with them privately after", scores: { readingOthers: 9, socialAwareness: 6 } },
      { label: "B", text: "Raise it in the meeting: 'Does anyone have questions or concerns about this?'", scores: { readingOthers: 7, leadership: 5 } },
      { label: "C", text: "Ignore it — if they have a problem, they'll speak up", scores: { readingOthers: 3 } },
      { label: "D", text: "I wouldn't have noticed the look", scores: { readingOthers: 1 } },
    ],
  },

  // Q51 — Reading Others (MC)
  {
    id: 51, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "readingOthers",
    text: "A guest couple is celebrating an anniversary. The partner who booked is enthusiastic, but the other seems distracted and disengaged. How do you handle service?",
    options: [
      { label: "A", text: "Subtly adjust — make the quieter partner feel included without forcing it. Maybe address a question directly to them, or recommend something based on their order", scores: { readingOthers: 9, empathy: 7, socialAwareness: 5 } },
      { label: "B", text: "Focus on matching the booker's enthusiasm — they're the one who planned it", scores: { readingOthers: 4, extraversion: 3 } },
      { label: "C", text: "Treat them both the same — standard anniversary service", scores: { readingOthers: 3 } },
      { label: "D", text: "Not my place to read into their relationship — just deliver great service", scores: { readingOthers: 2 } },
    ],
  },

  // Q52 — Empathy (MC)
  {
    id: 52, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "empathy",
    text: "A new team member makes the same mistake for the third time. They look deflated. You:",
    options: [
      { label: "A", text: "Pull them aside privately. Acknowledge it's tough, ask what's tripping them up, and offer to walk through it differently this time", scores: { empathy: 9, leadership: 5, readingOthers: 4 } },
      { label: "B", text: "Encourage them — 'Everyone struggles with this at first, you'll get it'", scores: { empathy: 7 } },
      { label: "C", text: "Show them the correct way again, firmly but fairly", scores: { empathy: 4, conscientiousness: 5 } },
      { label: "D", text: "Report it to the supervisor — three times is a pattern", scores: { empathy: 2, ruleFollowing: 5 } },
    ],
  },

  // Q53 — Empathy (Slider)
  {
    id: 53, type: "slider", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "empathy",
    text: "A colleague tells you they're thinking of leaving the industry entirely. They seem burned out. How much does this affect you?",
    leftLabel: "It's their decision — I wouldn't take it personally",
    rightLabel: "I'd feel it deeply — I'd want to understand what's going wrong and if I can help",
    leftScores: { empathy: 2 },
    rightScores: { empathy: 9, collaboration: 4 },
  },

  // Q54 — Empathy (MC)
  {
    id: 54, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "empathy",
    text: "A guest breaks down in tears at their table — you don't know why. Your instinct:",
    options: [
      { label: "A", text: "Quietly approach, offer a glass of water or a tissue, and let them know you're there if they need anything — no pressure, no fuss", scores: { empathy: 9, selfRegulation: 6, readingOthers: 5 } },
      { label: "B", text: "Give them space and privacy — don't draw attention to it", scores: { empathy: 6, socialAwareness: 5 } },
      { label: "C", text: "Ask if everything is okay with the meal or service", scores: { empathy: 3 } },
      { label: "D", text: "Alert the manager to handle it", scores: { empathy: 2 } },
    ],
  },

  // Q55 — Empathy (MC)
  {
    id: 55, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "empathy",
    text: "A colleague from a different culture handles guest complaints very differently than you would. Their approach seems cold to you, but their guests leave satisfied. You:",
    options: [
      { label: "A", text: "Recognise that empathy looks different across cultures — their style works for them and their guests. I learn from it", scores: { empathy: 8, socialAwareness: 9, openness: 6 } },
      { label: "B", text: "Appreciate the result but gently share my approach in case it helps", scores: { empathy: 6, socialAwareness: 5 } },
      { label: "C", text: "Stick to my own approach — I know what works", scores: { empathy: 3, socialAwareness: 2 } },
      { label: "D", text: "Raise it with management — consistency matters", scores: { empathy: 2, ruleFollowing: 5 } },
    ],
  },

  // Q56 — Self-Regulation (MC)
  {
    id: 56, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "selfRegulation",
    text: "A guest loudly accuses you of overcharging them — in front of other diners. You know the bill is correct. You:",
    options: [
      { label: "A", text: "Stay completely calm, lower your voice, and walk them through the bill line by line in a private area. Kill them with professionalism", scores: { selfRegulation: 9, emotionalStability: 7, readingOthers: 4 } },
      { label: "B", text: "Stay calm, explain the charges at the table, and offer to get a manager if they'd like a second opinion", scores: { selfRegulation: 7, emotionalStability: 5 } },
      { label: "C", text: "Get the manager immediately — I don't need to be publicly accused", scores: { selfRegulation: 5 } },
      { label: "D", text: "I'd stay professional but they'd see I'm annoyed — I'm human", scores: { selfRegulation: 3 } },
    ],
  },

  // Q57 — Self-Regulation (Slider)
  {
    id: 57, type: "slider", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "selfRegulation",
    text: "After a confrontation with a difficult guest, how quickly can you reset emotionally before your next interaction?",
    leftLabel: "It stays with me for the rest of the shift",
    rightLabel: "I can reset within a minute or two and give the next guest 100%",
    leftScores: { selfRegulation: 2, emotionalStability: 2 },
    rightScores: { selfRegulation: 9, emotionalStability: 7 },
  },

  // Q58 — Self-Regulation (MC)
  {
    id: 58, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "selfRegulation",
    text: "You overhear a colleague gossiping about you to another team member. It's inaccurate and unfair. You:",
    options: [
      { label: "A", text: "Wait until I've cooled down, then have a direct, private conversation with them about what I heard", scores: { selfRegulation: 9, integrity: 6, emotionalStability: 5 } },
      { label: "B", text: "Address it immediately — I'd calmly say 'I overheard that, can we talk?'", scores: { selfRegulation: 7, extraversion: 5 } },
      { label: "C", text: "Vent to a different colleague about it first, then decide what to do", scores: { selfRegulation: 4 } },
      { label: "D", text: "Confront them on the spot — they shouldn't get away with it", scores: { selfRegulation: 2, emotionalStability: 2 } },
    ],
  },

  // Q59 — Self-Regulation (MC)
  {
    id: 59, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "selfRegulation",
    text: "You're exhausted at the end of a double shift. Your last table of the night is demanding and sends food back twice. Your internal state vs external behaviour:",
    options: [
      { label: "A", text: "Inside: drained. Outside: they'd never know — same energy and care as my first table", scores: { selfRegulation: 9, dependability: 6, emotionalStability: 5 } },
      { label: "B", text: "Inside: frustrated. Outside: polite and professional, but maybe a little less warmth than usual", scores: { selfRegulation: 6 } },
      { label: "C", text: "Inside: angry. Outside: I'm trying but my patience is visibly thinner", scores: { selfRegulation: 3 } },
      { label: "D", text: "Inside and outside match — if I'm done, I'm done", scores: { selfRegulation: 1 } },
    ],
  },

  // Q60 — Social Awareness (MC)
  {
    id: 60, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "socialAwareness",
    text: "A group of guests from the Middle East arrive at your hotel. You know cultural norms around hospitality differ from Irish norms. You:",
    options: [
      { label: "A", text: "Adjust naturally — more formal greeting, anticipate dietary needs, be mindful of gender dynamics in service, and ensure privacy standards are elevated", scores: { socialAwareness: 9, readingOthers: 5, openness: 5 } },
      { label: "B", text: "Treat them the same as any guest — everyone gets our best standard of service", scores: { socialAwareness: 4 } },
      { label: "C", text: "Ask them directly if there's anything culturally specific I should be aware of", scores: { socialAwareness: 6, empathy: 5 } },
      { label: "D", text: "Flag it to management and follow whatever guidance they give", scores: { socialAwareness: 3 } },
    ],
  },

  // Q61 — Social Awareness (MC)
  {
    id: 61, type: "mc", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "socialAwareness",
    text: "You notice that a junior colleague is being spoken to harshly by a senior team member — not bullying exactly, but the power dynamic is uncomfortable. You:",
    options: [
      { label: "A", text: "Find a natural moment to check in with the junior privately, and if it's a pattern, raise it with management discreetly", scores: { socialAwareness: 9, empathy: 6, integrity: 5 } },
      { label: "B", text: "Step in casually to diffuse the situation — redirect the conversation", scores: { socialAwareness: 7, selfRegulation: 5 } },
      { label: "C", text: "Not my business unless it crosses a clear line", scores: { socialAwareness: 3 } },
      { label: "D", text: "Report it immediately to HR", scores: { socialAwareness: 4, ruleFollowing: 6 } },
    ],
  },

  // Q62 — Social Awareness (Ranking)
  {
    id: 62, type: "ranking", layer: "eq", paths: ["experienced", "executive"], dimensionKey: "socialAwareness",
    text: "Rank these from most important to least important when working with an international team:",
    items: [
      { text: "Understanding different communication styles (direct vs indirect)", scores: { socialAwareness: 1 } },
      { text: "Adapting your humour and tone to the room", scores: { socialAwareness: 1, readingOthers: 1 } },
      { text: "Being aware of religious or cultural observances", scores: { socialAwareness: 1, empathy: 1 } },
      { text: "Treating everyone exactly the same regardless of background", scores: { agreeableness: 1 } },
    ],
  },

  // ===== LAYER 5: RELIABILITY & RISK (Q63-Q77) — Experienced path ONLY =====

  // Q63 — Integrity (MC)
  {
    id: 63, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "integrity",
    text: "You find a guest's wallet on the floor of the restaurant. It has €300 cash inside. No one is watching. You:",
    options: [
      { label: "A", text: "Hand it to reception immediately with the cash untouched and log it in the lost property book", scores: { integrity: 10, ruleFollowing: 6, dependability: 4 } },
      { label: "B", text: "Try to find the guest first — check recent reservations, ask nearby tables", scores: { integrity: 8, problemSolving: 5 } },
      { label: "C", text: "Hand it in but don't bother logging it — it'll find its way back", scores: { integrity: 5, conscientiousness: 2 } },
      { label: "D", text: "Take the cash and hand in the wallet — they'd assume it was already missing", scores: { integrity: 1 } },
    ],
  },

  // Q64 — Integrity (MC)
  {
    id: 64, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "integrity",
    text: "Your manager asks you to mark a food delivery as 'received in full' even though 3 items were missing. They say they'll sort it out later. You:",
    options: [
      { label: "A", text: "Refuse politely — I'll note what was actually received and let them handle the supplier", scores: { integrity: 9, ruleFollowing: 7 } },
      { label: "B", text: "Sign it but send an email to the manager documenting what was actually missing — paper trail", scores: { integrity: 7, selfRegulation: 4 } },
      { label: "C", text: "Sign it — the manager knows what they're doing", scores: { integrity: 3, agreeableness: 5 } },
      { label: "D", text: "Sign it but mention it to another manager quietly", scores: { integrity: 5, socialAwareness: 4 } },
    ],
  },

  // Q65 — Integrity (Slider)
  {
    id: 65, type: "slider", layer: "reliability", paths: ["experienced"], dimensionKey: "integrity",
    text: "You accidentally break a wine glass backstage — no one saw it. How likely are you to report it?",
    leftLabel: "Sweep it up and move on — it's just a glass",
    rightLabel: "Report it immediately — stock counts matter and someone could get cut",
    leftScores: { integrity: 2, safetyConsciousness: 1 },
    rightScores: { integrity: 9, safetyConsciousness: 7, dependability: 4 },
  },

  // Q66 — Integrity (MC)
  {
    id: 66, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "integrity",
    text: "A colleague regularly takes leftover food home without permission. It would otherwise be thrown away. A new manager asks if anyone does this. You:",
    options: [
      { label: "A", text: "Be honest about what you've observed — it's a fair question and the manager deserves a straight answer", scores: { integrity: 8, ruleFollowing: 5 } },
      { label: "B", text: "Suggest the property creates a formal leftover policy instead of singling anyone out", scores: { integrity: 7, socialAwareness: 6, leadership: 4 } },
      { label: "C", text: "Stay quiet — I'm not going to get a colleague in trouble over food waste", scores: { integrity: 3, agreeableness: 6 } },
      { label: "D", text: "Deny any knowledge — it's not my problem to solve", scores: { integrity: 1 } },
    ],
  },

  // Q67 — Rule-Following (MC)
  {
    id: 67, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "ruleFollowing",
    text: "Your hotel's check-in procedure requires verifying photo ID for every guest. A clearly elderly couple arrives, exhausted after a long journey. They can't find their passports in their bags. You:",
    options: [
      { label: "A", text: "Follow procedure — help them search, offer to hold their bags, but I can't check them in without ID. It's policy for a reason", scores: { ruleFollowing: 9, empathy: 5 } },
      { label: "B", text: "Check them in with a note to verify ID in the morning — use common sense", scores: { ruleFollowing: 4, empathy: 7, agreeableness: 5 } },
      { label: "C", text: "Call the manager and let them make the call", scores: { ruleFollowing: 6 } },
      { label: "D", text: "Check them in — they're clearly who they say they are", scores: { ruleFollowing: 2, empathy: 4 } },
    ],
  },

  // Q68 — Rule-Following (Slider)
  {
    id: 68, type: "slider", layer: "reliability", paths: ["experienced"], dimensionKey: "ruleFollowing",
    text: "When you think a workplace rule or procedure is outdated or inefficient, what do you do?",
    leftLabel: "I find my own way around it — results matter more than process",
    rightLabel: "I follow it exactly while raising the issue through proper channels",
    leftScores: { ruleFollowing: 2, autonomy: 7 },
    rightScores: { ruleFollowing: 9, integrity: 5 },
  },

  // Q69 — Rule-Following (MC)
  {
    id: 69, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "ruleFollowing",
    text: "Health & Safety requires you to wear non-slip shoes in the kitchen. Yours are uncomfortable and you have a 12-hour shift. A colleague offers you their regular trainers that feel much better. You:",
    options: [
      { label: "A", text: "No — non-slip shoes are non-negotiable in a kitchen. I'll buy better ones tomorrow and push through today", scores: { ruleFollowing: 9, safetyConsciousness: 8 } },
      { label: "B", text: "Wear the trainers but stay extra careful on wet floors", scores: { ruleFollowing: 3, safetyConsciousness: 3 } },
      { label: "C", text: "Ask the manager if there's a spare pair in the right size", scores: { ruleFollowing: 7, problemSolving: 5 } },
      { label: "D", text: "Wear the trainers — the rule is overcautious anyway", scores: { ruleFollowing: 1, safetyConsciousness: 1 } },
    ],
  },

  // Q70 — Rule-Following (MC)
  {
    id: 70, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "ruleFollowing",
    text: "A VIP guest asks you to serve alcohol to their 16-year-old at a private dinner. 'In our country it's perfectly normal,' they explain. You:",
    options: [
      { label: "A", text: "Decline respectfully — Irish law is clear, regardless of the guest's home customs. Offer non-alcoholic alternatives", scores: { ruleFollowing: 10, integrity: 8, socialAwareness: 5 } },
      { label: "B", text: "Check with the manager before deciding", scores: { ruleFollowing: 6 } },
      { label: "C", text: "Serve it discreetly — the guest is VIP and it's a private dinner", scores: { ruleFollowing: 1, integrity: 1 } },
      { label: "D", text: "Explain the law but suggest the parent could order and share at their own discretion", scores: { ruleFollowing: 4, socialAwareness: 4 } },
    ],
  },

  // Q71 — Safety Consciousness (MC)
  {
    id: 71, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "safetyConsciousness",
    text: "You notice a small water leak from a pipe above the walk-in fridge. It's not urgent — just a slow drip. You:",
    options: [
      { label: "A", text: "Report it immediately to maintenance, put a bucket underneath, and flag it in the handover notes for the next shift", scores: { safetyConsciousness: 9, attentionToDetail: 6, dependability: 5 } },
      { label: "B", text: "Report it to maintenance — they'll prioritise it", scores: { safetyConsciousness: 7 } },
      { label: "C", text: "Put a bucket under it and mention it when I next see maintenance", scores: { safetyConsciousness: 4 } },
      { label: "D", text: "It's a slow drip — someone else will notice and handle it", scores: { safetyConsciousness: 1 } },
    ],
  },

  // Q72 — Safety Consciousness (MC)
  {
    id: 72, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "safetyConsciousness",
    text: "A guest with a severe nut allergy asks if the chocolate dessert is safe. The kitchen says yes, but you notice 'may contain traces of nuts' on the garnish packaging. You:",
    options: [
      { label: "A", text: "Stop. Tell the guest you need to double-check. Go back to the kitchen with the packaging and get absolute confirmation before serving", scores: { safetyConsciousness: 10, integrity: 7, attentionToDetail: 7 } },
      { label: "B", text: "Mention the packaging to the kitchen and let them decide", scores: { safetyConsciousness: 6 } },
      { label: "C", text: "Trust the kitchen — they know their ingredients better than I do", scores: { safetyConsciousness: 3 } },
      { label: "D", text: "Serve it — 'may contain traces' isn't the same as 'contains nuts'", scores: { safetyConsciousness: 1 } },
    ],
  },

  // Q73 — Safety Consciousness (Slider)
  {
    id: 73, type: "slider", layer: "reliability", paths: ["experienced"], dimensionKey: "safetyConsciousness",
    text: "You see a fire exit partially blocked by stacked chairs. The corridor is still passable. How urgently do you act?",
    leftLabel: "It's passable — I'll mention it when I get a chance",
    rightLabel: "I clear it immediately — fire exits must be completely unobstructed, no exceptions",
    leftScores: { safetyConsciousness: 2, ruleFollowing: 2 },
    rightScores: { safetyConsciousness: 10, ruleFollowing: 8 },
  },

  // Q74 — Safety Consciousness (MC)
  {
    id: 74, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "safetyConsciousness",
    text: "During a heatwave, the kitchen temperature is dangerously high. Staff are uncomfortable but service must continue. You:",
    options: [
      { label: "A", text: "Flag it formally — request additional breaks, portable fans, cold water stations. Document the temperature in case it becomes an H&S issue", scores: { safetyConsciousness: 9, leadership: 6, integrity: 5 } },
      { label: "B", text: "Set up water stations and encourage the team to take breaks", scores: { safetyConsciousness: 7, empathy: 5 } },
      { label: "C", text: "Push through — it's a heatwave, everyone's dealing with it", scores: { safetyConsciousness: 3 } },
      { label: "D", text: "Complain but keep working — what else can you do?", scores: { safetyConsciousness: 2 } },
    ],
  },

  // Q75 — Dependability (MC)
  {
    id: 75, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "dependability",
    text: "You're feeling genuinely unwell — not life-threatening, but you'd rather be in bed. You're rostered for a busy Saturday night and the team is already short-staffed. You:",
    options: [
      { label: "A", text: "Go in — the team needs me. I'll power through and rest tomorrow", scores: { dependability: 9, collaboration: 5 } },
      { label: "B", text: "Go in but tell the manager I'm not 100%, so they can adjust if needed", scores: { dependability: 8, integrity: 5 } },
      { label: "C", text: "Call in sick — my health comes first and I don't want to underperform", scores: { dependability: 4, autonomy: 5 } },
      { label: "D", text: "Call in sick — Saturday nights aren't my problem if I'm unwell", scores: { dependability: 2 } },
    ],
  },

  // Q76 — Dependability (Slider)
  {
    id: 76, type: "slider", layer: "reliability", paths: ["experienced"], dimensionKey: "dependability",
    text: "How often are you the person who arrives before the shift starts and stays until everything is properly finished?",
    leftLabel: "I arrive on time and leave on time — boundaries matter",
    rightLabel: "Almost always — I'm typically first in and last out",
    leftScores: { dependability: 4, autonomy: 5 },
    rightScores: { dependability: 9, conscientiousness: 6 },
  },

  // Q77 — Dependability (MC)
  {
    id: 77, type: "mc", layer: "reliability", paths: ["experienced"], dimensionKey: "dependability",
    text: "You promised a colleague you'd cover their Tuesday shift. On Monday, a friend offers you concert tickets for Tuesday night. You:",
    options: [
      { label: "A", text: "I made a commitment — I'll cover the shift. The concert will come around again", scores: { dependability: 10, integrity: 7 } },
      { label: "B", text: "Try to find someone else to cover, and only go to the concert if I find a replacement", scores: { dependability: 7, problemSolving: 4 } },
      { label: "C", text: "Ask my colleague if they can find their own cover — I really want to go", scores: { dependability: 3 } },
      { label: "D", text: "Go to the concert — my colleague will understand", scores: { dependability: 1, integrity: 1 } },
    ],
  },

  // ============================================================
  // LAYER 6: CAREER COMPASS — SHARED (Q78-Q87) — ALL paths
  // ============================================================

  // Q78 — Career Aspirations (MC)
  {
    id: 78, type: "mc", layer: "career", paths: allPaths, dimensionKey: "careerAspiration",
    text: "Where do you honestly see yourself in hospitality 3 years from now?",
    options: [
      { label: "A", text: "Running my own department or property — I want to lead", scores: { leadership: 7, autonomy: 6 } },
      { label: "B", text: "Becoming a specialist — mastering my craft at the highest level", scores: { precision: 7, conscientiousness: 5 } },
      { label: "C", text: "Growing steadily — better roles, better properties, better pay", scores: { adaptability: 5, dependability: 4 } },
      { label: "D", text: "I'm not sure yet — I'm still figuring out my path", scores: { openness: 5, adaptability: 4 } },
    ],
  },

  // Q79 — Career Aspirations (MC)
  {
    id: 79, type: "mc", layer: "career", paths: allPaths, dimensionKey: "careerAspiration",
    text: "What would make you leave a hospitality job you otherwise liked?",
    options: [
      { label: "A", text: "No growth — if I can't see a path upward, I'll find one elsewhere", scores: { leadership: 5, autonomy: 6 } },
      { label: "B", text: "Toxic culture — no amount of money makes up for a bad team", scores: { collaboration: 7, emotionalStability: 4 } },
      { label: "C", text: "Pay — I need to earn what I'm worth", scores: { autonomy: 4 } },
      { label: "D", text: "Burnout — if the hours or pressure become unsustainable", scores: { emotionalStability: 3, adaptability: 3 } },
    ],
  },

  // Q80 — Work-Life Balance (Slider)
  {
    id: 80, type: "slider", layer: "career", paths: allPaths, dimensionKey: "workLifeBalance",
    text: "How important is work-life balance to you versus career progression?",
    leftLabel: "Career comes first — I'll sacrifice personal time to get ahead",
    rightLabel: "Balance is non-negotiable — I work to live, not live to work",
    leftScores: { leadership: 5, conscientiousness: 4 },
    rightScores: { emotionalStability: 5, adaptability: 4 },
  },

  // Q81 — Geographic Flexibility (MC)
  {
    id: 81, type: "mc", layer: "career", paths: allPaths, dimensionKey: "geographicFlexibility",
    text: "If the perfect role came up but required relocating to another country, you would:",
    options: [
      { label: "A", text: "Go without hesitation — my career is global", scores: { adaptability: 8, openness: 7 } },
      { label: "B", text: "Seriously consider it — depends on the country and the role", scores: { adaptability: 6, openness: 5 } },
      { label: "C", text: "Only within Europe — I want to stay close to home", scores: { adaptability: 4 } },
      { label: "D", text: "No — I'm rooted here and not willing to relocate", scores: { adaptability: 2 } },
    ],
  },

  // Q82 — Learning Preference (MC)
  {
    id: 82, type: "mc", layer: "career", paths: allPaths, dimensionKey: "learningPreference",
    text: "How do you prefer to develop your professional skills?",
    options: [
      { label: "A", text: "On the job — shadowing, mentoring, real-world experience", scores: { learningSpeed: 6, collaboration: 5 } },
      { label: "B", text: "Structured courses — online certifications, classroom training", scores: { conscientiousness: 6, learningSpeed: 5 } },
      { label: "C", text: "Self-directed — books, podcasts, YouTube, industry blogs", scores: { autonomy: 7, learningSpeed: 5 } },
      { label: "D", text: "Mix of everything — whatever gets results fastest", scores: { adaptability: 6, openness: 5 } },
    ],
  },

  // Q83 — Sector Preference (Ranking)
  {
    id: 83, type: "ranking", layer: "career", paths: allPaths, dimensionKey: "sectorPreference",
    text: "Rank these hospitality sectors from most to least appealing to you:",
    items: [
      { text: "Luxury Hotels & Resorts", scores: { precision: 1, conscientiousness: 1 } },
      { text: "Restaurants & Fine Dining", scores: { adaptability: 1, extraversion: 1 } },
      { text: "Events & Conferences", scores: { collaboration: 1, openness: 1 } },
      { text: "Private Members' Clubs", scores: { empathy: 1, socialAwareness: 1 } },
    ],
  },

  // Q84 — Role Satisfaction (Slider)
  {
    id: 84, type: "slider", layer: "career", paths: allPaths, dimensionKey: "roleSatisfaction",
    text: "In your current or most recent role, how fulfilled do you feel professionally?",
    leftLabel: "Deeply unfulfilled — I know I'm capable of much more",
    rightLabel: "Very fulfilled — I'm in the right place doing the right work",
    leftScores: { autonomy: 5, leadership: 4 },
    rightScores: { emotionalStability: 5, conscientiousness: 4 },
  },

  // Q85 — Motivation (MC)
  {
    id: 85, type: "mc", layer: "career", paths: allPaths, dimensionKey: "motivation",
    text: "What motivates you most in your day-to-day work?",
    options: [
      { label: "A", text: "Making guests genuinely happy — that look on their face when you nail it", scores: { empathy: 7, extraversion: 4 } },
      { label: "B", text: "Building and leading a team that works brilliantly together", scores: { leadership: 7, collaboration: 5 } },
      { label: "C", text: "Personal mastery — getting better at my craft every single day", scores: { precision: 6, conscientiousness: 5 } },
      { label: "D", text: "Career progression — every role is a stepping stone to where I'm going", scores: { autonomy: 6, leadership: 4 } },
    ],
  },

  // Q86 — Challenge Tolerance (MC)
  {
    id: 86, type: "mc", layer: "career", paths: allPaths, dimensionKey: "challengeTolerance",
    text: "How do you feel about working weekends, bank holidays, and late nights — the reality of hospitality hours?",
    options: [
      { label: "A", text: "It's part of the deal — I knew what I signed up for and I genuinely don't mind", scores: { dependability: 7, adaptability: 6 } },
      { label: "B", text: "I accept it but I need a fair roster — predictability matters to me", scores: { dependability: 5, conscientiousness: 5, ruleFollowing: 4 } },
      { label: "C", text: "I tolerate it for now but I'm working toward a role with more normal hours", scores: { autonomy: 5 } },
      { label: "D", text: "It's the worst part of the job and I'd leave if I could find something with regular hours", scores: { adaptability: 2 } },
    ],
  },

  // Q87 — Industry Commitment (Slider)
  {
    id: 87, type: "slider", layer: "career", paths: allPaths, dimensionKey: "industryCommitment",
    text: "How likely are you to still be in the hospitality industry in 5 years?",
    leftLabel: "Unlikely — I'm exploring my options",
    rightLabel: "Certain — hospitality is my career, not just a job",
    leftScores: { adaptability: 4 },
    rightScores: { dependability: 6, conscientiousness: 5 },
  },

  // ============================================================
  // CAREER DEVELOPMENT — EXPERIENCED ONLY (Q88-Q95)
  // ============================================================

  // Q88 — Skill Gap Awareness (MC)
  {
    id: 88, type: "mc", layer: "career", paths: ["experienced"], dimensionKey: "skillGapAwareness",
    text: "What's the biggest skill gap holding you back from your next career step?",
    options: [
      { label: "A", text: "Financial management — P&L, budgeting, revenue optimisation", scores: { precision: 5, problemSolving: 4 } },
      { label: "B", text: "People management — hiring, coaching, having difficult conversations", scores: { leadership: 5, empathy: 4 } },
      { label: "C", text: "Technical systems — PMS, POS, analytics tools", scores: { learningSpeed: 5, attentionToDetail: 4 } },
      { label: "D", text: "I honestly don't know what I don't know — I need guidance", scores: { openness: 5 } },
    ],
  },

  // Q89 — Management Readiness (Slider)
  {
    id: 89, type: "slider", layer: "career", paths: ["experienced"], dimensionKey: "managementReadiness",
    text: "How ready do you feel to manage a team of 10+ people?",
    leftLabel: "Not ready — I need more experience and training first",
    rightLabel: "Fully ready — I could step into that role tomorrow",
    leftScores: { conscientiousness: 5, openness: 4 },
    rightScores: { leadership: 8, autonomy: 6 },
  },

  // Q90 — Mentorship (MC)
  {
    id: 90, type: "mc", layer: "career", paths: ["experienced"], dimensionKey: "mentorship",
    text: "Do you currently have a mentor or someone you look up to in the industry?",
    options: [
      { label: "A", text: "Yes — a formal or informal mentor who actively guides my career", scores: { collaboration: 6, openness: 5 } },
      { label: "B", text: "Sort of — I admire certain leaders but we don't have a formal relationship", scores: { openness: 4 } },
      { label: "C", text: "No, but I'd love one — I just don't know how to find the right person", scores: { openness: 5, collaboration: 3 } },
      { label: "D", text: "No — I prefer to figure things out on my own", scores: { autonomy: 7 } },
    ],
  },

  // Q91 — Cross-Department Experience (MC)
  {
    id: 91, type: "mc", layer: "career", paths: ["experienced"], dimensionKey: "crossDepartment",
    text: "How many different departments have you worked in during your hospitality career?",
    options: [
      { label: "A", text: "4 or more — I've worked across the house", scores: { adaptability: 8, openness: 6 } },
      { label: "B", text: "2-3 — I've moved around a bit", scores: { adaptability: 6 } },
      { label: "C", text: "Mostly one department — I've deepened my expertise", scores: { precision: 6, conscientiousness: 5 } },
      { label: "D", text: "Just one — I haven't had the opportunity to move", scores: { adaptability: 3 } },
    ],
  },

  // Q92 — Revenue Awareness (MC)
  {
    id: 92, type: "mc", layer: "career", paths: ["experienced"], dimensionKey: "revenueAwareness",
    text: "How well do you understand the commercial side of your property — revenue, occupancy rates, average spend per head?",
    options: [
      { label: "A", text: "Very well — I actively track numbers and understand how my role impacts them", scores: { patternRecognition: 7, problemSolving: 5, leadership: 4 } },
      { label: "B", text: "Somewhat — I know the basics but don't track them myself", scores: { patternRecognition: 4 } },
      { label: "C", text: "Barely — that's management's concern, not mine", scores: { patternRecognition: 2 } },
      { label: "D", text: "Not at all — I focus on service, not numbers", scores: { patternRecognition: 1 } },
    ],
  },

  // Q93 — Conflict Resolution Style (MC)
  {
    id: 93, type: "mc", layer: "career", paths: ["experienced"], dimensionKey: "conflictResolution",
    text: "Two members of your team are in an ongoing disagreement that's affecting service. As the senior on shift, you:",
    options: [
      { label: "A", text: "Speak to each privately first to understand both sides, then facilitate a direct conversation between them", scores: { leadership: 8, empathy: 6, selfRegulation: 5 } },
      { label: "B", text: "Pull them both aside together and make it clear the behaviour needs to stop", scores: { leadership: 6, selfRegulation: 4 } },
      { label: "C", text: "Escalate to the manager — conflict resolution is above my pay grade", scores: { leadership: 2 } },
      { label: "D", text: "Separate them on the floor and hope it resolves itself", scores: { leadership: 1, adaptability: 3 } },
    ],
  },

  // Q94 — Training Others (Slider)
  {
    id: 94, type: "slider", layer: "career", paths: ["experienced"], dimensionKey: "trainingOthers",
    text: "How much do you enjoy training and developing less experienced team members?",
    leftLabel: "Not my strength — I'd rather focus on my own performance",
    rightLabel: "I love it — watching someone grow because of my guidance is incredibly rewarding",
    leftScores: { autonomy: 5 },
    rightScores: { leadership: 7, empathy: 5, collaboration: 4 },
  },

  // Q95 — Career Ceiling (MC)
  {
    id: 95, type: "mc", layer: "career", paths: ["experienced"], dimensionKey: "careerCeiling",
    text: "What's your ultimate career goal in hospitality?",
    options: [
      { label: "A", text: "General Manager of a flagship property", scores: { leadership: 9, autonomy: 7 } },
      { label: "B", text: "Regional or multi-property leadership", scores: { leadership: 8, patternRecognition: 5 } },
      { label: "C", text: "Head of Department — I want depth, not breadth", scores: { precision: 7, conscientiousness: 6 } },
      { label: "D", text: "I want to stay operational — I love being on the floor with guests", scores: { extraversion: 6, empathy: 5 } },
    ],
  },

  // ============================================================
  // EXECUTIVE LEADERSHIP — EXECUTIVE ONLY (Q96-Q98)
  // ============================================================

  // Q96 — Strategic Vision (MC)
  {
    id: 96, type: "mc", layer: "career", paths: ["executive"], dimensionKey: "strategicVision",
    text: "Your ownership group asks you to present a 3-year vision for the property. Your approach:",
    options: [
      { label: "A", text: "Start with data — market analysis, competitor benchmarking, revenue trends — then build the vision from evidence", scores: { patternRecognition: 8, problemSolving: 7, precision: 5 } },
      { label: "B", text: "Start with the guest experience I want to create, then work backwards to the numbers", scores: { openness: 7, empathy: 5 } },
      { label: "C", text: "Consult the senior team first — a vision without buy-in is just a slide deck", scores: { collaboration: 8, leadership: 5, socialAwareness: 5 } },
      { label: "D", text: "Focus on quick wins first — show results in year one, build trust for years two and three", scores: { adaptability: 6, problemSolving: 5 } },
    ],
  },

  // Q97 — Influence Style (Slider)
  {
    id: 97, type: "slider", layer: "career", paths: ["executive"], dimensionKey: "influenceStyle",
    text: "When you need your team to embrace a major change, how do you lead it?",
    leftLabel: "I decide, communicate clearly, and expect follow-through",
    rightLabel: "I involve the team early, co-create the plan, and build consensus",
    leftScores: { autonomy: 7, leadership: 6 },
    rightScores: { collaboration: 7, empathy: 5, socialAwareness: 5 },
  },

  // Q98 — Legacy Thinking (MC)
  {
    id: 98, type: "mc", layer: "career", paths: ["executive"], dimensionKey: "legacyThinking",
    text: "What do you want your professional legacy to be?",
    options: [
      { label: "A", text: "The leader who built something that outlasted them — systems, culture, and people who thrived", scores: { leadership: 9, collaboration: 5, integrity: 5 } },
      { label: "B", text: "The innovator who changed how things were done in the industry", scores: { openness: 8, autonomy: 6 } },
      { label: "C", text: "The mentor who developed the next generation of hospitality leaders", scores: { empathy: 7, leadership: 6, collaboration: 5 } },
      { label: "D", text: "The operator who consistently delivered exceptional results", scores: { precision: 7, conscientiousness: 6, dependability: 5 } },
    ],
  },

  // ============================================================
  // ENTRY GROWTH MINDSET — ENTRY ONLY (Q99-Q101)
  // ============================================================

  // Q99 — Growth Ambition (MC)
  {
    id: 99, type: "mc", layer: "career", paths: ["entry"], dimensionKey: "growthAmbition",
    text: "What excites you most about starting your career?",
    options: [
      { label: "A", text: "The variety — every day is different and I'll never be bored", scores: { adaptability: 7, openness: 6 } },
      { label: "B", text: "The people — I love meeting new faces and building connections", scores: { extraversion: 7, collaboration: 5 } },
      { label: "C", text: "The career ladder — I can progress from entry level to leadership quickly", scores: { leadership: 5, autonomy: 5 } },
      { label: "D", text: "The transferability — the skills I learn will work anywhere in the world", scores: { openness: 7, adaptability: 6 } },
    ],
  },

  // Q100 — Feedback Reception (Slider)
  {
    id: 100, type: "slider", layer: "career", paths: ["entry"], dimensionKey: "feedbackReception",
    text: "When a more experienced colleague corrects your work, how do you feel?",
    leftLabel: "Defensive — I feel criticised even when I know they're right",
    rightLabel: "Grateful — every correction makes me better at my job",
    leftScores: { emotionalStability: 2 },
    rightScores: { emotionalStability: 7, openness: 6, learningSpeed: 5 },
  },

  // Q101 — First Job Priorities (Ranking)
  {
    id: 101, type: "ranking", layer: "career", paths: ["entry"], dimensionKey: "firstJobPriorities",
    text: "Rank what matters most to you in your first professional role:",
    items: [
      { text: "Good training and mentorship", scores: { learningSpeed: 1, openness: 1 } },
      { text: "Friendly, supportive team", scores: { collaboration: 1, agreeableness: 1 } },
      { text: "Clear path to promotion", scores: { leadership: 1, autonomy: 1 } },
      { text: "Decent pay and fair hours", scores: { dependability: 1, emotionalStability: 1 } },
    ],
  },
];

import { entryOverrides } from "./entryOverrides";

/** Get the filtered question list for a given experience path */
export function getQuestionsForPath(path: ExperiencePath): BranchedQuestion[] {
  const filtered = questionBank.filter(q => q.paths.includes(path));
  if (path === 'entry') {
    return filtered.map(q => {
      const override = entryOverrides[q.id];
      if (override) {
        return {
          ...q,
          text: override.text,
          ...(override.options ? { options: override.options } : {}),
          ...(override.leftLabel ? { leftLabel: override.leftLabel } : {}),
          ...(override.rightLabel ? { rightLabel: override.rightLabel } : {}),
          ...(override.items ? { items: override.items } : {}),
        };
      }
      return q;
    });
  }
  return filtered;
}

/** Get a human-readable label for the current question's layer */
export function getLayerLabel(layer: LayerType): string {
  switch (layer) {
    case 'archetype': return 'Section 1 of 5: Your Thinking Style';
    case 'cognitive': return 'Section 2 of 5: Your Cognitive Strengths';
    case 'personality': return 'Section 3 of 5: Your Work Style';
    case 'eq': return 'Section 4 of 5: Your Emotional Intelligence';
    case 'reliability': return 'Section 5 of 5: Your Values & Reliability';
    case 'career': return 'Your Career Compass';
    default: return '';
  }
}
