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
    text: "Rank these from easiest to hardest for you to maintain focus on:",
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
];

/** Get the filtered question list for a given experience path */
export function getQuestionsForPath(path: ExperiencePath): BranchedQuestion[] {
  return questionBank.filter(q => q.paths.includes(path));
}

/** Get a human-readable label for the current question's layer */
export function getLayerLabel(layer: LayerType): string {
  switch (layer) {
    case 'archetype': return 'Discovering your archetype...';
    case 'cognitive': return 'Testing your cognitive strengths...';
    case 'personality': return 'Exploring your personality...';
    case 'eq': return 'Measuring emotional intelligence...';
    case 'reliability': return 'Assessing reliability & values...';
    case 'career': return 'Mapping career drivers...';
    default: return '';
  }
}
