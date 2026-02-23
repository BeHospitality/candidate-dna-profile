/**
 * Entry-level question text overrides.
 * Replaces hospitality-specific scenarios with universal life scenarios
 * while keeping IDENTICAL scoring weights per answer option.
 */
import type { BranchedMCOption, BranchedRankingItem } from "./questions";

export interface EntryOverride {
  text: string;
  options?: BranchedMCOption[];
  leftLabel?: string;
  rightLabel?: string;
  items?: BranchedRankingItem[];
}

export const entryOverrides: Record<number, EntryOverride> = {
  // === COGNITIVE (Q13-Q27) ===

  // Q13 — Problem Solving
  13: {
    text: "You're helping at a community event and someone reports the main entrance door is jammed. The organisers are all busy. What's your first move?",
    options: [
      { label: "A", text: "Check the door yourself to see if it's a simple fix", scores: { problemSolving: 8, attentionToDetail: 4 } },
      { label: "B", text: "Find another entrance and redirect people there", scores: { problemSolving: 5, attentionToDetail: 2 } },
      { label: "C", text: "Call the building caretaker to come check it", scores: { problemSolving: 3, attentionToDetail: 3 } },
      { label: "D", text: "Let people know and ask them to wait until an organiser is free", scores: { problemSolving: 2, attentionToDetail: 1 } },
    ],
  },

  // Q14 — Problem Solving
  14: {
    text: "You're setting up for a school event and realise you're 10 chairs short. The event starts in 30 minutes. You:",
    options: [
      { label: "A", text: "Check nearby classrooms and borrow chairs immediately", scores: { problemSolving: 9, adaptability: 6 } },
      { label: "B", text: "Tell a teacher and ask what to do", scores: { problemSolving: 3, adaptability: 2 } },
      { label: "C", text: "Rearrange the layout so fewer chairs are needed", scores: { problemSolving: 8, adaptability: 8 } },
      { label: "D", text: "Wait for someone else to notice and handle it", scores: { problemSolving: 1, adaptability: 1 } },
    ],
  },

  // Q15 — Problem Solving
  15: {
    text: "Two groups have both been told they can use the same room for a meeting at the same time. You need to resolve this. You:",
    options: [
      { label: "A", text: "Check who booked first and honour that, then find a comparable alternative for the other group with an apology", scores: { problemSolving: 9, readingOthers: 5 } },
      { label: "B", text: "Ask both groups if they'd mind waiting 15 minutes", scores: { problemSolving: 5, readingOthers: 3 } },
      { label: "C", text: "Immediately escalate to whoever's in charge", scores: { problemSolving: 3, readingOthers: 2 } },
      { label: "D", text: "Give the room to whoever arrives first", scores: { problemSolving: 4, readingOthers: 1 } },
    ],
  },

  // Q16 — Attention to Detail
  16: {
    text: "You're checking a community event setup against the plan. What do you pay most attention to?",
    options: [
      { label: "A", text: "Every single detail: signage placement, seating arrangement, equipment, printed materials", scores: { attentionToDetail: 9, precision: 6 } },
      { label: "B", text: "The big things: table count, chair count, tech setup", scores: { attentionToDetail: 5, precision: 4 } },
      { label: "C", text: "Whatever the organiser specifically mentioned", scores: { attentionToDetail: 6, precision: 3 } },
      { label: "D", text: "As long as it looks good overall, the details will sort themselves", scores: { attentionToDetail: 2, precision: 1 } },
    ],
  },

  // Q17 — Attention to Detail (Slider)
  17: {
    text: "A classmate's name is spelled unusually — 'Siobhán' instead of what you might expect. How carefully do you check the spelling before writing it anywhere?",
    leftLabel: "I'd spell it how it sounds — close enough",
    rightLabel: "I triple-check every letter, every time",
  },

  // Q18 — Attention to Detail
  18: {
    text: "You're reviewing a checklist for tomorrow's fundraiser. You notice the allergy information for the food stall isn't listed. You:",
    options: [
      { label: "A", text: "Add it immediately — allergy labelling is critical for everyone's safety", scores: { attentionToDetail: 10, safetyConsciousness: 8 } },
      { label: "B", text: "Make a note to mention it to whoever's running the food stall", scores: { attentionToDetail: 6, safetyConsciousness: 4 } },
      { label: "C", text: "Assume the food team will handle their own labels", scores: { attentionToDetail: 3, safetyConsciousness: 2 } },
      { label: "D", text: "Only worry about it if someone asks", scores: { attentionToDetail: 1, safetyConsciousness: 1 } },
    ],
  },

  // Q19 — Learning Speed (Slider)
  19: {
    text: "Your school or workplace introduces a completely new software system. Everyone gets a 2-hour training session. After the training, how confident are you using it on your own?",
    leftLabel: "I'd need a lot more practice and support",
    rightLabel: "I'd be comfortable navigating it solo",
  },

  // Q20 — Learning Speed
  20: {
    text: "You're shown how to do a new task once — like using a till system or setting up equipment. How many times do you need to do it before you've got it memorised?",
    options: [
      { label: "A", text: "Once or twice — I pick things up fast", scores: { learningSpeed: 9 } },
      { label: "B", text: "Three to five times — practice makes perfect", scores: { learningSpeed: 6 } },
      { label: "C", text: "I'd want the instructions nearby for at least a week", scores: { learningSpeed: 4 } },
      { label: "D", text: "I'd keep the instructions permanently — why memorise?", scores: { learningSpeed: 2, precision: 4 } },
    ],
  },

  // Q21 — Learning Speed
  21: {
    text: "A new health and safety rule is announced at your school or workplace. It takes effect next month. You:",
    options: [
      { label: "A", text: "Read up on it immediately and share key points with your group", scores: { learningSpeed: 9, leadership: 5 } },
      { label: "B", text: "Wait for the official training or briefing session", scores: { learningSpeed: 5, ruleFollowing: 5 } },
      { label: "C", text: "Skim the summary and figure it out as you go", scores: { learningSpeed: 4, adaptability: 3 } },
      { label: "D", text: "Assume someone in charge will tell you what's changed", scores: { learningSpeed: 2 } },
    ],
  },

  // Q22 — Pattern Recognition
  22: {
    text: "You notice that every Friday afternoon, the same group of people in your class or workplace seem frustrated and unproductive. What's likely happening?",
    options: [
      { label: "A", text: "Friday's schedule is probably overloaded — check if workload or timing is the pattern", scores: { patternRecognition: 9, problemSolving: 6 } },
      { label: "B", text: "Those people might be in a distracting environment or position", scores: { patternRecognition: 7, attentionToDetail: 5 } },
      { label: "C", text: "They're probably just tired after a long week", scores: { patternRecognition: 3 } },
      { label: "D", text: "Random coincidence — I wouldn't read too much into it", scores: { patternRecognition: 1 } },
    ],
  },

  // Q23 — Pattern Recognition (Slider)
  23: {
    text: "When you see numbers — like grades, survey results, or weekly stats — do you naturally look for trends and patterns?",
    leftLabel: "Numbers are numbers, I focus on the day in front of me",
    rightLabel: "I instinctively look for what's rising, falling, or repeating",
  },

  // Q24 — Pattern Recognition
  24: {
    text: "Your school club's event attendance is down 15% this month but social media engagement is up 10%. What's your first theory?",
    options: [
      { label: "A", text: "People are interested online but something about the events isn't working — maybe timing or format?", scores: { patternRecognition: 9, problemSolving: 7 } },
      { label: "B", text: "The event organisers might have changed — quality dropped", scores: { patternRecognition: 6, problemSolving: 5 } },
      { label: "C", text: "Seasonal variation — probably nothing", scores: { patternRecognition: 3 } },
      { label: "D", text: "Not my area — I wouldn't think about it", scores: { patternRecognition: 1 } },
    ],
  },

  // Q25 — Concentration (Slider)
  25: {
    text: "During a busy group activity, someone asks you a question while you're in the middle of a complex task. How easily do you lose track?",
    leftLabel: "I'd completely lose my place and need to start over",
    rightLabel: "I can hold the task in my head, respond to them, and continue seamlessly",
  },

  // Q26 — Concentration
  26: {
    text: "You're doing a detailed count or inventory in a busy, noisy environment. People keep walking past and talking. You:",
    options: [
      { label: "A", text: "Stay locked in — distractions don't break my count", scores: { concentration: 9, precision: 5 } },
      { label: "B", text: "Pause, respond briefly, then pick up where I left off", scores: { concentration: 6, collaboration: 4 } },
      { label: "C", text: "Lose count often and have to restart sections", scores: { concentration: 3 } },
      { label: "D", text: "Ask someone else to do it — I can't focus in that environment", scores: { concentration: 1 } },
    ],
  },

  // Q27 — Concentration (Ranking)
  27: {
    text: "Rank these by how well you maintain focus on each:",
    items: [
      { text: "Repetitive tasks (sorting files, organising supplies)", scores: { concentration: 1 } },
      { text: "Long briefings or training sessions", scores: { concentration: 1 } },
      { text: "Detailed paperwork (spreadsheets, forms, records)", scores: { concentration: 1, attentionToDetail: 1 } },
      { text: "Multitasking during a busy period", scores: { concentration: 1, adaptability: 1 } },
    ],
  },

  // === PERSONALITY (Q28-Q47) ===

  // Q29 — Extraversion (Slider)
  29: {
    text: "After a long, people-heavy day, how do you recharge?",
    leftLabel: "Alone time — silence, no people, decompress",
    rightLabel: "More socialising — I go meet friends or stay out",
  },

  // Q37 — Emotional Stability (Slider)
  37: {
    text: "You receive critical feedback from your teacher or supervisor after a task you thought went well. How does it affect you?",
    leftLabel: "It ruins my evening — I replay it in my head for days",
    rightLabel: "I take it on board, process it, and move on fairly quickly",
  },

  // Q47 — Emotional Stability
  47: {
    text: "Your schedule gets changed last minute — your day off is cancelled because a teammate can't make it. You:",
    options: [
      { label: "A", text: "Annoying, but I understand — I come in and make the best of it", scores: { emotionalStability: 8, agreeableness: 5, dependability: 6 } },
      { label: "B", text: "Come in but make sure the person in charge knows this can't keep happening", scores: { emotionalStability: 7, selfRegulation: 5, leadership: 3 } },
      { label: "C", text: "It throws off my whole week — I come in but I'm visibly frustrated", scores: { emotionalStability: 4 } },
      { label: "D", text: "I say no — my day off is my day off, schedule changes need proper notice", scores: { emotionalStability: 5, autonomy: 7, ruleFollowing: 4 } },
    ],
  },


  // Q28 — Extraversion
  28: {
    text: "Your school or community group is hosting a big fundraiser tonight. Before the event, you feel:",
    options: [
      { label: "A", text: "Buzzing — I love the energy of big events and meeting new people", scores: { extraversion: 9 } },
      { label: "B", text: "Excited but pacing myself — I know it'll be draining", scores: { extraversion: 6 } },
      { label: "C", text: "A bit anxious — I prefer smaller, more intimate settings", scores: { extraversion: 3 } },
      { label: "D", text: "Dread — I'd rather help behind the scenes tonight", scores: { extraversion: 1 } },
    ],
  },

  // Q30 — Conscientiousness
  30: {
    text: "You're the last one tidying up after a group project session and it's late. You notice the recycling hasn't been separated — something someone would eventually catch in the morning. You:",
    options: [
      { label: "A", text: "Sort it now. It's part of a proper clean-up, regardless of who notices", scores: { conscientiousness: 9, integrity: 6 } },
      { label: "B", text: "Sort it now because I'd be embarrassed if someone saw it left like this", scores: { conscientiousness: 7, integrity: 3 } },
      { label: "C", text: "Leave it — it's not going to cause any harm overnight", scores: { conscientiousness: 3 } },
      { label: "D", text: "I wouldn't have noticed it", scores: { conscientiousness: 1, attentionToDetail: 1 } },
    ],
  },

  // Q31 — Conscientiousness (Slider)
  31: {
    text: "How organised is your personal workspace (desk, locker, bag) at the end of every day?",
    leftLabel: "Functional chaos — I know where things are, roughly",
    rightLabel: "Everything has a place and is in its place, every single time",
  },

  // Q32 — Openness
  32: {
    text: "Your teacher or group leader introduces a completely new project format using tools and methods you've never tried before. Your reaction:",
    options: [
      { label: "A", text: "Brilliant — I want to dive in and learn everything about it", scores: { openness: 9, learningSpeed: 5 } },
      { label: "B", text: "Interesting — I'll learn what I need to get through the project", scores: { openness: 6, learningSpeed: 4 } },
      { label: "C", text: "I preferred the old format — why fix what wasn't broken?", scores: { openness: 3 } },
      { label: "D", text: "I'll just follow the instructions and do the minimum", scores: { openness: 1 } },
    ],
  },

  // Q33 — Openness
  33: {
    text: "A friend asks you to suggest something 'completely different' to do this weekend — they want to be surprised. You:",
    options: [
      { label: "A", text: "Love this — I suggest something creative and unconventional that I'm genuinely excited about", scores: { openness: 9, extraversion: 4 } },
      { label: "B", text: "Suggest the most popular thing to do — it's popular for a reason", scores: { openness: 4, conscientiousness: 3 } },
      { label: "C", text: "Ask more questions first — 'different' means different things to different people", scores: { openness: 6, readingOthers: 6 } },
      { label: "D", text: "Feel uncomfortable — I prefer straightforward plans", scores: { openness: 2 } },
    ],
  },

  // Q34 — Agreeableness
  34: {
    text: "A classmate makes a mistake on a group presentation and the teacher points it out. Your classmate is visibly embarrassed. You:",
    options: [
      { label: "A", text: "Step in to help cover the moment AND check on your classmate afterwards", scores: { agreeableness: 9, empathy: 7 } },
      { label: "B", text: "Handle the immediate situation, but leave them to manage their own feelings", scores: { agreeableness: 5, problemSolving: 5 } },
      { label: "C", text: "Focus on your own section — they'll figure it out", scores: { agreeableness: 2 } },
      { label: "D", text: "Privately tell your classmate what they should have done differently", scores: { agreeableness: 3, leadership: 4 } },
    ],
  },

  // Q36 — Emotional Stability
  36: {
    text: "Three things go wrong in 10 minutes: a complaint about your work, a spilled drink on your notes, and a teammate who hasn't shown up. Internally you feel:",
    options: [
      { label: "A", text: "Calm focus — this is just life, I handle each one in order", scores: { emotionalStability: 9, concentration: 5 } },
      { label: "B", text: "A spike of stress, but I channel it into action", scores: { emotionalStability: 7, adaptability: 5 } },
      { label: "C", text: "Overwhelmed — I need a moment to collect myself before I can respond", scores: { emotionalStability: 4 } },
      { label: "D", text: "Flustered and frustrated — I might snap at someone", scores: { emotionalStability: 2 } },
    ],
  },

  // Q38 — Extraversion
  38: {
    text: "You're asked to give a short welcome speech to a group of 40 new students or volunteers. Your honest reaction:",
    options: [
      { label: "A", text: "Brilliant — I'll wing it, feed off the crowd's energy, and make it memorable", scores: { extraversion: 9, leadership: 5 } },
      { label: "B", text: "Happy to do it, but I'd like to prepare a few bullet points first", scores: { extraversion: 7, conscientiousness: 4 } },
      { label: "C", text: "I'd do it if asked, but I'd be counting down the seconds until it's over", scores: { extraversion: 4 } },
      { label: "D", text: "I'd find a way to pass it to someone who enjoys that sort of thing", scores: { extraversion: 2, autonomy: 4 } },
    ],
  },

  // Q39 — Extraversion
  39: {
    text: "During a quiet afternoon at your part-time job or study group, you find yourself with 20 minutes of free time. You naturally gravitate towards:",
    options: [
      { label: "A", text: "Finding someone to chat with — silence makes me restless", scores: { extraversion: 9 } },
      { label: "B", text: "Checking in with people around me — I'll start a conversation", scores: { extraversion: 8, collaboration: 4 } },
      { label: "C", text: "Organising something quietly — tidying, reviewing notes, getting ahead", scores: { extraversion: 3, conscientiousness: 5 } },
      { label: "D", text: "Enjoying the calm — peace and quiet is rare", scores: { extraversion: 1 } },
    ],
  },

  // Q40 — Conscientiousness
  40: {
    text: "Someone asks you to show a new person how to do the end-of-day clean-up routine. How do you approach it?",
    options: [
      { label: "A", text: "Write a step-by-step checklist, walk them through it twice, then watch them do it solo", scores: { conscientiousness: 9, leadership: 5, attentionToDetail: 5 } },
      { label: "B", text: "Show them once thoroughly and tell them to ask if they're stuck", scores: { conscientiousness: 6, leadership: 3 } },
      { label: "C", text: "Walk through it together casually — they'll pick it up", scores: { conscientiousness: 4 } },
      { label: "D", text: "Tell them to follow someone else who's been doing it longer", scores: { conscientiousness: 2 } },
    ],
  },

  // Q42 — Openness (Slider)
  42: {
    text: "Your school or workplace offers a 3-month exchange programme in another country. How interested are you?",
    leftLabel: "Not for me — I'm happy where I am",
    rightLabel: "I'd be first to sign up — what an experience",
  },

  // Q43 — Openness
  43: {
    text: "A friend asks for a suggestion for something 'truly unique' to do in your area that nobody would normally think of. You:",
    options: [
      { label: "A", text: "Love this challenge — I'd think creatively, maybe suggest a hidden local spot, an unusual activity, or something off the beaten track", scores: { openness: 9, problemSolving: 5 } },
      { label: "B", text: "Check social media and suggest the top-rated local experiences", scores: { openness: 5, conscientiousness: 4 } },
      { label: "C", text: "Suggest the usual popular spots — they're popular for a reason", scores: { openness: 3 } },
      { label: "D", text: "Say I'm not the right person to ask — I don't really explore much", scores: { openness: 1 } },
    ],
  },

  // Q44 — Agreeableness
  44: {
    text: "During a group meeting, someone suggests an idea you think is genuinely bad. It would create more work and a worse outcome. You:",
    options: [
      { label: "A", text: "Say nothing in the meeting, then raise your concerns privately afterwards", scores: { agreeableness: 7, selfRegulation: 5 } },
      { label: "B", text: "Respectfully disagree in the meeting, explain your reasoning, and suggest an alternative", scores: { agreeableness: 5, leadership: 6, openness: 4 } },
      { label: "C", text: "Go along with it — keeping the peace matters more than being right", scores: { agreeableness: 9 } },
      { label: "D", text: "Directly say it won't work and explain why — the group needs honest feedback", scores: { agreeableness: 3, integrity: 6 } },
    ],
  },

  // Q45 — Agreeableness (Slider)
  45: {
    text: "Someone asks you to bend a rule that technically applies but wouldn't cause any real harm. How far do you bend?",
    leftLabel: "A rule is a rule — I explain why I can't and offer alternatives",
    rightLabel: "I make it happen — people's needs matter more than rigid rules",
  },

  // Q46 — Emotional Stability
  46: {
    text: "You make a visible mistake during a group activity — everyone noticed. Immediately after fixing it, you:",
    options: [
      { label: "A", text: "Shake it off quickly — mistakes happen, I'll be sharper going forward", scores: { emotionalStability: 9, adaptability: 5 } },
      { label: "B", text: "Feel embarrassed for a few minutes but refocus before it affects the next task", scores: { emotionalStability: 7 } },
      { label: "C", text: "Replay it in my head for the rest of the day — it rattles my confidence", scores: { emotionalStability: 3 } },
      { label: "D", text: "Get frustrated with myself and it starts affecting my other work", scores: { emotionalStability: 1 } },
    ],
  },

  // === CAREER SHARED (Q78-Q87) ===

  // Q78 — Career Aspirations
  78: {
    text: "Where do you honestly see yourself in your career 3 years from now?",
    options: [
      { label: "A", text: "Running my own team or project — I want to lead", scores: { leadership: 7, autonomy: 6 } },
      { label: "B", text: "Becoming a specialist — mastering my craft at the highest level", scores: { precision: 7, conscientiousness: 5 } },
      { label: "C", text: "Growing steadily — better roles, better opportunities, better pay", scores: { adaptability: 5, dependability: 4 } },
      { label: "D", text: "I'm not sure yet — I'm still figuring out my path", scores: { openness: 5, adaptability: 4 } },
    ],
  },

  // Q79 — Career Aspirations
  79: {
    text: "What would make you leave a job you otherwise liked?",
    options: [
      { label: "A", text: "No growth — if I can't see a path upward, I'll find one elsewhere", scores: { leadership: 5, autonomy: 6 } },
      { label: "B", text: "Toxic culture — no amount of money makes up for a bad team", scores: { collaboration: 7, emotionalStability: 4 } },
      { label: "C", text: "Pay — I need to earn what I'm worth", scores: { autonomy: 4 } },
      { label: "D", text: "Burnout — if the hours or pressure become unsustainable", scores: { emotionalStability: 3, adaptability: 3 } },
    ],
  },

  // Q83 — Sector Preference (Ranking)
  83: {
    text: "Rank these work environments from most to least appealing to you:",
    items: [
      { text: "Premium brands and luxury experiences", scores: { precision: 1, conscientiousness: 1 } },
      { text: "Fast-paced food and drink environments", scores: { adaptability: 1, extraversion: 1 } },
      { text: "Events, festivals, and large gatherings", scores: { collaboration: 1, openness: 1 } },
      { text: "Exclusive, members-only settings", scores: { empathy: 1, socialAwareness: 1 } },
    ],
  },

  // Q85 — Motivation
  85: {
    text: "What motivates you most in your day-to-day work or studies?",
    options: [
      { label: "A", text: "Making people genuinely happy — that look on their face when you help them", scores: { empathy: 7, extraversion: 4 } },
      { label: "B", text: "Building and being part of a team that works brilliantly together", scores: { leadership: 7, collaboration: 5 } },
      { label: "C", text: "Personal mastery — getting better at what I do every single day", scores: { precision: 6, conscientiousness: 5 } },
      { label: "D", text: "Career progression — every step is a stepping stone to where I'm going", scores: { autonomy: 6, leadership: 4 } },
    ],
  },

  // Q86 — Challenge Tolerance
  86: {
    text: "How do you feel about working unsociable hours — evenings, weekends, and bank holidays — if the job requires it?",
    options: [
      { label: "A", text: "It's part of the deal — I'd accept it and genuinely wouldn't mind", scores: { dependability: 7, adaptability: 6 } },
      { label: "B", text: "I accept it but I need a fair schedule — predictability matters to me", scores: { dependability: 5, conscientiousness: 5, ruleFollowing: 4 } },
      { label: "C", text: "I tolerate it for now but I'm working toward something with more regular hours", scores: { autonomy: 5 } },
      { label: "D", text: "It's a dealbreaker — I need regular hours", scores: { adaptability: 2 } },
    ],
  },

  // Q87 — Industry Commitment (Slider)
  87: {
    text: "How committed are you to building a long-term career in your chosen field?",
    leftLabel: "Not very — I'm exploring my options",
    rightLabel: "Very — this is my career, not just a job",
  },
};
