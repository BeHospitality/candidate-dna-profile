export type NarrativeLevel = {
  label: string;
  headline: string;
  detail: string;
  hospitality_context: string;
};

export type DimensionNarrative = {
  high: NarrativeLevel;
  mid: NarrativeLevel;
  low: NarrativeLevel;
};

export const dimensionNarratives: Record<string, DimensionNarrative> = {
  // LAYER 1: ARCHETYPE FOUNDATION
  autonomy: {
    high: {
      label: "Self-Directed",
      headline: "You don't need a script — you write your own.",
      detail: "You figure things out independently, take initiative without being asked, and find micromanagement genuinely painful. You're at your best when given a problem and space to solve it.",
      hospitality_context: "In a department manager or solo-opening role you thrive — in a tightly controlled operation, you'll quietly plan your exit.",
    },
    mid: {
      label: "Adaptive Independence",
      headline: "You work well alone and better with the right team around you.",
      detail: "You don't need hand-holding but you're not a lone wolf. You know when to go solo and when to bring people in — which is a skill most people never develop.",
      hospitality_context: "You're valuable in environments that mix independent work with collaborative service — F&B, events, multi-outlet properties.",
    },
    low: {
      label: "Collaborative by Nature",
      headline: "Your best work happens when you're part of something bigger.",
      detail: "You draw energy from working alongside others, not in spite of them. Shared goals, shared accountability, shared wins — that's your environment.",
      hospitality_context: "Front-of-house team roles, collaborative kitchen environments, and guest-facing roles with strong team dynamics are where you shine.",
    },
  },
  collaboration: {
    high: {
      label: "Team Architecture",
      headline: "You don't just work with people — you make the whole team work better.",
      detail: "You naturally share information, credit, and load. You notice when someone's struggling before they say so. The teams you're part of have something the others don't, and everyone feels it.",
      hospitality_context: "In any multi-department property you're the person connecting FOH and BOH, kitchen and service, management and line staff.",
    },
    mid: {
      label: "Strategic Collaborator",
      headline: "You collaborate with intention — you choose when team is the answer.",
      detail: "You don't collaborate for the sake of it. You bring people in when it genuinely improves the outcome and work independently when that's faster. That judgement is rare.",
      hospitality_context: "You're effective in hybrid roles — department leads, senior supervisors, event coordinators — where you balance individual output with team delivery.",
    },
    low: {
      label: "The Focused Specialist",
      headline: "You do your best work when the brief is clear and the lane is yours.",
      detail: "You're not anti-social — you're outcome-focused. Too many cooks, consensus-by-committee, and group decisions that ignore expertise frustrate you. You'd rather be trusted and left to it.",
      hospitality_context: "Specialist roles — head sommelier, executive pastry, revenue manager — where depth of craft matters more than consensus are your natural home.",
    },
  },
  precision: {
    high: {
      label: "The Standard Setter",
      headline: "You notice the thing that's 2% wrong when everyone else sees 100% fine.",
      detail: "Your standards are high — for yourself more than anyone else. You catch errors before they become problems and you're the reason guests never see the cracks.",
      hospitality_context: "In quality control, FOH management, or fine dining, your precision is what separates a good operation from an exceptional one.",
    },
    mid: {
      label: "Measured Accuracy",
      headline: "You care about quality without being paralysed by perfection.",
      detail: "You get things right without losing momentum. You know the difference between 'good enough to ship' and 'not good enough to serve' — and you make that call quickly.",
      hospitality_context: "You operate effectively in high-volume, quality-conscious environments — branded hotels, catered events, managed F&B outlets.",
    },
    low: {
      label: "The Fast Mover",
      headline: "You trade perfection for speed — and in hospitality, that's often the right call.",
      detail: "You're not careless — you're prioritised. You understand that a 90% solution now beats a 100% solution too late. You keep service moving when others are still deliberating.",
      hospitality_context: "In QSR, high-volume bars, or anything that runs on pace, your ability to move without overthinking is exactly what the operation needs.",
    },
  },
  leadership: {
    high: {
      label: "Natural Command",
      headline: "You don't take charge — rooms just reorganise around you.",
      detail: "You read what a situation needs and move before anyone asks. People follow you not because of a title but because you make better decisions faster than anyone else in the room.",
      hospitality_context: "In a busy service environment you're the person the team looks to when things go sideways — and you already have a plan.",
    },
    mid: {
      label: "Situational Leader",
      headline: "You lead when it matters and step back when it doesn't.",
      detail: "You're not competing for the spotlight but you're not invisible either. You pick your moments — and when you lead, people notice and follow.",
      hospitality_context: "You're the team member who quietly takes ownership without needing a formal promotion to justify it.",
    },
    low: {
      label: "The Force Multiplier",
      headline: "You make every leader around you better without needing the title.",
      detail: "You're not driven by hierarchy — you're driven by getting things done well. The people who lead with you outperform those who lead without you every time.",
      hospitality_context: "In hospitality, the best teams are built around people like you — deeply skilled, deeply reliable, and no ego about who gets the credit.",
    },
  },
  adaptability: {
    high: {
      label: "Built for Change",
      headline: "You don't adapt to disruption — you were designed for it.",
      detail: "When plans change, you don't grieve the original — you're already building the new one. You're not just comfortable with uncertainty, you're energised by it in a way most people simply aren't.",
      hospitality_context: "Openings, turnarounds, seasonal peaks, and any property that runs on controlled chaos — you're in your element.",
    },
    mid: {
      label: "Steady Under Pressure",
      headline: "You bend when you need to but you don't break.",
      detail: "You have routines and preferences but you hold them loosely. When something has to change you change with it — not always happily, but always effectively.",
      hospitality_context: "You perform consistently across roles and environments — reliable in stable periods, capable when things are disrupted.",
    },
    low: {
      label: "The Anchor",
      headline: "Every operation needs someone who keeps the standard when everything else is moving.",
      detail: "Constant change doesn't energise you — it costs you. You do your best work in structured, consistent environments where craft and routine compound over time.",
      hospitality_context: "Long-tenure roles in established properties, process-driven departments, and quality-focused environments are where your consistency becomes a genuine superpower.",
    },
  },

  // LAYER 2: COGNITIVE APTITUDE
  problemSolving: {
    high: {
      label: "The Solution Finder",
      headline: "You don't bring problems — you bring problems and solutions.",
      detail: "You see through complexity to the actual issue, generate options fast, and commit to a path without needing consensus. In environments that move quickly, this is the single most valuable cognitive skill.",
      hospitality_context: "Operations, senior FOH, and any management role benefits from someone who treats obstacles as puzzles rather than emergencies.",
    },
    mid: {
      label: "Practical Problem Solver",
      headline: "You work through problems methodically — and you usually find the answer.",
      detail: "You approach challenges pragmatically, gather what you need, and deliver a workable solution fast enough to matter. Not always elegant — always effective.",
      hospitality_context: "You handle the daily problem-solving demands of hospitality without escalating what doesn't need escalating — that's exactly what makes supervisors promotable.",
    },
    low: {
      label: "The Collaborative Solver",
      headline: "You find better answers when you have the right people around you.",
      detail: "Solo problem-solving isn't your strongest mode — but in teams, with input, you contribute strong solutions. The skill to develop: trusting your own judgement first before opening it to the group.",
      hospitality_context: "In well-structured teams with clear escalation paths you perform reliably. Building confidence in independent problem-solving will unlock your next level.",
    },
  },
  attentionToDetail: {
    high: {
      label: "Nothing Gets Past You",
      headline: "You catch what everyone else walks past.",
      detail: "You hold the big picture and the small details simultaneously. Errors don't survive long around you — you find them before they become guest experiences.",
      hospitality_context: "Pre-opening checklists, service standards, quality control, and any department where getting it right first time matters — you're the safeguard.",
    },
    mid: {
      label: "Focused When It Counts",
      headline: "You dial up your detail focus when the stakes are high.",
      detail: "You're not detail-obsessed every minute, but when something matters you shift gears. You know the difference between a detail worth catching and one worth letting go.",
      hospitality_context: "You manage the balance between pace and precision well — effective in most hospitality environments without getting bogged down in perfectionism.",
    },
    low: {
      label: "The Big Picture Thinker",
      headline: "You see the whole, not just the parts — and that's a different kind of intelligence.",
      detail: "Fine details don't hold your attention naturally, but strategy, momentum, and overall experience do. Paired with a detail-focused team member, you're a powerful combination.",
      hospitality_context: "Leadership and concept roles that need vision over execution are where you create most value — a strong supporting team turns your big picture into operational reality.",
    },
  },
  learningSpeed: {
    high: {
      label: "Fast Adapter",
      headline: "You pick up new skills, systems, and environments faster than almost anyone.",
      detail: "You don't need things explained twice. New PMS systems, new menus, new properties — you absorb them quickly and start contributing before most people have found their feet.",
      hospitality_context: "In an industry that moves fast and changes often, your learning speed is a genuine competitive advantage — properties value people who don't slow the operation down.",
    },
    mid: {
      label: "Steady Learner",
      headline: "You learn thoroughly — which means it sticks.",
      detail: "You may not be the fastest to pick up new information, but once you have it, it's solid. You ask the right questions and don't pretend to understand things you don't.",
      hospitality_context: "Your learning style suits structured onboarding and properties with clear training programmes — you reward investment in good training with strong long-term performance.",
    },
    low: {
      label: "The Deep Learner",
      headline: "You take longer to learn — and longer to forget.",
      detail: "Speed isn't your learning style, but retention is. Once something is genuinely understood, you own it completely. Environments that rush onboarding misread you entirely.",
      hospitality_context: "Properties that invest in proper onboarding and allow time to bed in will get exceptional, durable performance from you — not a quick start followed by drift.",
    },
  },
  patternRecognition: {
    high: {
      label: "Pattern Hunter",
      headline: "You see connections and trends before they become obvious to everyone else.",
      detail: "Your brain looks for patterns naturally — in guest behaviour, team dynamics, operational flow. You notice when something is about to go wrong, or right, before it actually happens.",
      hospitality_context: "Revenue management, operational analysis, service recovery anticipation — your pattern recognition is a strategic asset that compounds with experience.",
    },
    mid: {
      label: "Perceptive Observer",
      headline: "You notice patterns when you're paying attention — and you usually are.",
      detail: "You pick up on recurring themes and signals, especially in areas you know well. Your pattern recognition sharpens significantly with experience in a specific environment.",
      hospitality_context: "You get better at your job the longer you're in it — your pattern recognition compounds with familiarity, making tenure in a single property particularly valuable.",
    },
    low: {
      label: "The Present-Focused Professional",
      headline: "You deal with what's in front of you — thoroughly and effectively.",
      detail: "Abstract pattern-spotting isn't your natural strength, but responding to clear, concrete situations with full attention is. You're effective in the moment rather than in the anticipation of it.",
      hospitality_context: "Roles that reward consistent high-quality execution over predictive thinking — skilled service, technical craft, operational delivery — suit your strengths well.",
    },
  },
  concentration: {
    high: {
      label: "Deep Focus",
      headline: "When you're in, you're fully in — and the quality shows.",
      detail: "You sustain attention through complex tasks, long service periods, and detailed work without losing your thread. Distractions don't derail you — you re-engage fast and completely.",
      hospitality_context: "Fine dining service, complex events, detailed financial or operational work — anything requiring sustained quality of attention is where your concentration becomes a differentiator.",
    },
    mid: {
      label: "Selective Concentration",
      headline: "You focus well when it matters and switch off when it doesn't.",
      detail: "You manage your concentration deliberately — you don't waste it on low-stakes tasks and you dial it up for high-stakes ones. That calibration is more sophisticated than it sounds.",
      hospitality_context: "You perform effectively across most hospitality roles, with particular strength in environments that have clear rhythms of high and low intensity.",
    },
    low: {
      label: "The Multi-Tracker",
      headline: "You're built for environments that never slow down.",
      detail: "Sustained single-task focus isn't your natural mode — but managing multiple priorities, switching between tasks, and staying across many things at once is. That's a different and equally valuable capability.",
      hospitality_context: "High-volume operations, multi-outlet management, and front desk environments that demand constant task-switching are where your distributed attention is an asset, not a liability.",
    },
  },

  // LAYER 3: PERSONALITY / BIG 5
  extraversion: {
    high: {
      label: "Social Energy",
      headline: "You fill a room — and guests feel it before you've said a word.",
      detail: "You draw energy from people, not from time away from them. Interaction doesn't drain you — it fuels you. You're naturally engaging, memorable, and at ease in any crowd.",
      hospitality_context: "Guest-facing roles, sales, events, and anything front-of-house is your natural environment — you make people feel welcome without trying.",
    },
    mid: {
      label: "Selective Presence",
      headline: "You bring energy when it matters and recharge when you need to.",
      detail: "You're comfortable in social environments and equally comfortable stepping back. You don't need to be 'on' all the time — which means when you are on, it lands with more impact.",
      hospitality_context: "You're effective across a wide range of hospitality roles — you adapt your energy level to the environment rather than fighting it.",
    },
    low: {
      label: "The Depth Player",
      headline: "You'd rather have one real conversation than twenty surface ones.",
      detail: "You conserve social energy deliberately, which means when you engage it's genuine. Guests and colleagues often describe you as someone who really listens — because you actually do.",
      hospitality_context: "Fine dining, butler service, private events, and any role where meaningful guest interaction matters more than high-volume social output — these are where you shine.",
    },
  },
  conscientiousness: {
    high: {
      label: "The Architect",
      headline: "If you're responsible for something, it's going to be done right.",
      detail: "You plan before you act, follow through on everything, and your word means something. You're the person who notices what was supposed to happen and flags it clearly when it doesn't.",
      hospitality_context: "Operations, opening checklists, SOP ownership, and compliance roles — you're the reason standards are maintained even when ownership changes.",
    },
    mid: {
      label: "Purposeful Diligence",
      headline: "You finish what you start without needing perfect conditions to begin.",
      detail: "You're organised without being rigid. You plan but adapt the plan. You're reliable without being inflexible — which makes you both trustworthy and genuinely effective.",
      hospitality_context: "You perform consistently across most hospitality departments, with particular strength in roles that mix operational reliability with guest interaction.",
    },
    low: {
      label: "The Chaos Commander",
      headline: "You don't need a plan. You ARE the plan.",
      detail: "You were never married to the original brief, which means when it falls apart you're already three steps ahead on the new one. Structured people rely on you more than they ever admit.",
      hospitality_context: "Crisis management, event pivots, opening week chaos, and anything that runs on improvisation and speed — you're who they call when the plan stops working.",
    },
  },
  openness: {
    high: {
      label: "The Curious One",
      headline: "You're always asking why — and hospitality is richer for it.",
      detail: "You're drawn to new ideas, new approaches, and new ways of seeing familiar problems. You don't just do your job — you interrogate it, improve it, and make it genuinely interesting.",
      hospitality_context: "Innovation, concept development, training design, and any role where the status quo should be questioned — your curiosity is the engine of improvement.",
    },
    mid: {
      label: "Practical Innovator",
      headline: "You embrace new ideas when they make things better.",
      detail: "You're not resistant to change and not addicted to novelty. You evaluate new approaches on their merit — when something better comes along, you adopt it without drama.",
      hospitality_context: "You're effective in evolving environments — rebrands, concept shifts, technology adoption — without needing everything to change to feel engaged.",
    },
    low: {
      label: "The Proven Path",
      headline: "You trust what works — and in hospitality, that's the foundation everything else is built on.",
      detail: "You're not opposed to change — you're evidence-based about it. You'd rather improve what exists than experiment for the sake of it. That discipline protects quality and consistency.",
      hospitality_context: "In established operations, heritage properties, and quality-first environments, your commitment to proven standards is what guests experience as excellence.",
    },
  },
  agreeableness: {
    high: {
      label: "The Harmoniser",
      headline: "Teams work better when you're in them — and they can't always explain why.",
      detail: "You prioritise the relationship alongside the result. You smooth conflict, find common ground, and make working together feel less like work. That's not softness — that's social architecture.",
      hospitality_context: "Multi-department coordination, team development, and guest recovery situations — you make even difficult interactions land well.",
    },
    mid: {
      label: "Principled Flexibility",
      headline: "You cooperate without surrendering what matters.",
      detail: "You're collaborative but not a pushover. You pick your battles — when it matters you hold your position, when it doesn't you let it go. That calibration is rarer than you think.",
      hospitality_context: "Senior roles requiring both team leadership and upward management benefit from exactly this balance — cooperative enough to build trust, firm enough to maintain standards.",
    },
    low: {
      label: "The Honest Voice",
      headline: "You say the uncomfortable thing because someone has to — and you're usually right.",
      detail: "You don't manage upward, don't tell people what they want to hear, and don't pretend a bad plan is a good one. That makes you difficult in low-stakes situations and invaluable in high-stakes ones.",
      hospitality_context: "Operations leadership, kitchen management, and any role where honest feedback prevents expensive mistakes — your directness is what protects quality.",
    },
  },
  emotionalStability: {
    high: {
      label: "The Constant",
      headline: "When everything is moving, you're the thing that stays still.",
      detail: "You don't get rattled. Pressure doesn't change your judgement. You're the person others look at in a crisis to gauge how worried they should be — and your answer is always: not very.",
      hospitality_context: "Senior FOH, crisis response, busy service periods, and any high-pressure environment — your stability is a resource your whole team draws on without realising it.",
    },
    mid: {
      label: "Grounded Resilience",
      headline: "You feel the pressure and perform anyway.",
      detail: "You're not immune to stress — you just don't let it run the show. You manage your reaction, deliver what's needed, and process the rest afterwards. That's not suppression. That's professionalism.",
      hospitality_context: "You handle the rhythms of hospitality — the rushes, the complaints, the understaffed shifts — without lasting damage. You recover fast.",
    },
    low: {
      label: "The Feeling Leader",
      headline: "You feel things deeply — and that depth is also your greatest professional asset.",
      detail: "You're highly attuned to the emotional temperature of a room, a team, a situation. That sensitivity can be intense, but it's also why you read guests and colleagues better than almost anyone.",
      hospitality_context: "With the right support structure, your attunement makes you exceptional in guest relations, training, and any role that rewards genuine human connection.",
    },
  },

  // LAYER 4: EMOTIONAL INTELLIGENCE
  readingOthers: {
    high: {
      label: "The Room Reader",
      headline: "You notice when someone's pretending to be fine. That's rare.",
      detail: "You pick up on what's not being said — the guest who's disappointed but won't complain, the team member who's struggling but won't ask. You act before you're asked to.",
      hospitality_context: "Guest relations, concierge, training, and leadership roles all benefit enormously from someone who genuinely reads what a room is feeling beneath the surface.",
    },
    mid: {
      label: "Perceptive Listener",
      headline: "You pick up on signals when you're paying attention — and mostly you are.",
      detail: "You notice emotional cues in clear or familiar situations. In high-pressure moments or with people you don't know well, subtler signals may slip past — but you're attuned enough to matter.",
      hospitality_context: "You handle most guest and team interactions effectively, with particular strength in situations you've encountered before.",
    },
    low: {
      label: "The Direct Communicator",
      headline: "You respond to what people say, not what you think they mean — and there's real clarity in that.",
      detail: "Reading between the lines isn't your natural mode. You take people at their word and communicate directly. In fast-paced environments that value clear signals over subtle ones, that's efficient.",
      hospitality_context: "Operational and back-of-house roles where clear communication matters more than emotional reading are well-suited to your direct and efficient style.",
    },
  },
  empathy: {
    high: {
      label: "Deeply Human",
      headline: "People feel genuinely understood around you — and that changes everything.",
      detail: "Your empathy runs deep. You don't just acknowledge someone's experience — you actually feel it. That makes you exceptional at guest recovery, team support, and building trust quickly.",
      hospitality_context: "Any role involving guest distress, team welfare, or building long-term loyalty draws directly on your empathy — it's not soft, it's strategic.",
    },
    mid: {
      label: "Grounded Empathy",
      headline: "You understand people without losing yourself in their problems.",
      detail: "You care — genuinely — but you maintain perspective. You can acknowledge someone's difficulty without absorbing it. That balance is what makes you effective, not just kind.",
      hospitality_context: "You handle guest complaints, team conflicts, and difficult conversations without either dismissing them or being derailed by them.",
    },
    low: {
      label: "The Straight Talker",
      headline: "You say what needs to be said — and teams respect that more than they'll admit.",
      detail: "You communicate clearly, directly, and without the softening that sometimes obscures the actual message. In environments that run on speed and clarity, you cut through the noise.",
      hospitality_context: "In kitchens, operations management, and high-pressure service environments, clear and direct communication saves service — that's exactly what you bring.",
    },
  },
  selfRegulation: {
    high: {
      label: "Pressure-Proof",
      headline: "You choose your response — even when everything is pulling you toward a reaction.",
      detail: "You have genuine control over how you respond under pressure. Frustration, provocation, and stress don't hijack your behaviour. That consistency makes you deeply trustworthy in difficult situations.",
      hospitality_context: "Guest-facing roles, team leadership, and high-pressure service environments all demand this — you have it, and teams feel the difference it makes.",
    },
    mid: {
      label: "Managed Composure",
      headline: "You keep it together when it counts — which is what matters.",
      detail: "You experience stress and frustration but manage them well enough that they rarely show. You may need a moment to reset, but you come back composed. That's a professional skill.",
      hospitality_context: "You perform reliably in most hospitality situations — the occasional slip under extreme pressure is human, and you recover quickly.",
    },
    low: {
      label: "The Authentic Reactor",
      headline: "You feel things in the moment — developing your pause changes everything.",
      detail: "Your emotional responses are immediate and genuine. The opportunity is the space between stimulus and response — a short pause that keeps your authenticity while protecting your professionalism.",
      hospitality_context: "Investing in your self-regulation — even small daily habits — will unlock roles and responsibilities that are currently just out of reach. It's the highest-ROI development area in your profile.",
    },
  },
  socialAwareness: {
    high: {
      label: "Reads the Room",
      headline: "You know what's happening in a group before anyone has said a word.",
      detail: "You pick up on group dynamics, unspoken tensions, and shifting atmospheres naturally. You adjust your approach in real time — not because you're calculating, but because you're genuinely attuned.",
      hospitality_context: "Guest events, team briefings, difficult group situations — any environment where reading the collective mood shapes the outcome, you make it look effortless.",
    },
    mid: {
      label: "Socially Calibrated",
      headline: "You read social situations well in environments you know.",
      detail: "In familiar contexts you pick up on group dynamics reliably. In unfamiliar ones, you take a little longer to calibrate — but once you have the read, you act on it effectively.",
      hospitality_context: "You perform well in standard hospitality social contexts with particular strength in environments you know — your social awareness compounds with familiarity.",
    },
    low: {
      label: "The Individual Connector",
      headline: "You connect better one-on-one than in groups — and that's a real depth of relationship.",
      detail: "Group dynamics and collective emotional states are harder for you to read than individual ones. You're at your best in direct, personal interactions rather than managing room energy.",
      hospitality_context: "Roles that emphasise one-to-one guest interaction — butler service, account management, personalised concierge — play to your interpersonal strengths over group dynamics.",
    },
  },

  // LAYER 5: RELIABILITY & RISK
  integrity: {
    high: {
      label: "The Standard Bearer",
      headline: "You do the right thing even when nobody's watching. Especially then.",
      detail: "Your ethics aren't situational. You don't cut corners, don't pass blame, and hold yourself to the same standard you hold others. That consistency is what trust is actually built from.",
      hospitality_context: "Leadership roles, guest-facing positions of trust, and any department where standards are maintained by example — your integrity sets the tone for everyone.",
    },
    mid: {
      label: "Principled Pragmatist",
      headline: "You operate with integrity without being rigid about it.",
      detail: "You have clear ethical lines and you don't cross them. You also understand context, pressure, and the difference between compromise and capitulation. You navigate both with judgement.",
      hospitality_context: "You're trusted because you've shown good judgement in ambiguous situations — not because you've never faced them.",
    },
    low: {
      label: "The Pragmatist",
      headline: "You get things done in the real world, not the ideal one.",
      detail: "You operate in the grey space where most decisions actually live. Results matter to you. Where this needs attention: the long game — shortcuts that work today can undermine a reputation that takes years to build.",
      hospitality_context: "Refining your approach to integrity — especially in guest situations and team management — will unlock doors that results alone simply can't open.",
    },
  },
  ruleFollowing: {
    high: {
      label: "The Compliance Anchor",
      headline: "Standards exist for a reason — and you're the reason they're maintained.",
      detail: "You follow protocols, apply standards consistently, and don't look for workarounds. In regulated, safety-critical, or brand-standard environments, you're the person operations rely on completely.",
      hospitality_context: "Food safety, licensing compliance, brand standards, and any environment where the rules protect the guest and the business — you're the safeguard.",
    },
    mid: {
      label: "Standards-Aware",
      headline: "You follow the rules that matter and apply judgement to the ones that don't.",
      detail: "You're not blindly compliant, but you're not cavalier about standards either. You understand why most rules exist and follow them — while knowing when context genuinely requires a different call.",
      hospitality_context: "You perform well in most hospitality environments, bringing the right balance of compliance and operational pragmatism that management trusts.",
    },
    low: {
      label: "The Independent Thinker",
      headline: "You question rules before you follow them — which makes you either an innovator or a risk, depending on context.",
      detail: "You don't follow protocols automatically — you evaluate them first. In creative environments that's valuable. In regulated ones, it needs careful management and self-awareness.",
      hospitality_context: "In conceptual or entrepreneurial hospitality roles your rule-questioning drives genuine improvement. In compliance-heavy environments, developing rule-discipline is the key professional investment.",
    },
  },
  safetyConsciousness: {
    high: {
      label: "Safety First, Always",
      headline: "You see hazards before they become incidents — and you act on them.",
      detail: "Safety isn't a checklist for you — it's a mindset. You notice risks others walk past, report what needs reporting, and create environments where incidents simply don't happen.",
      hospitality_context: "In any F&B, kitchen, accommodation, or public-facing environment, your safety consciousness reduces liability and protects the people in your care.",
    },
    mid: {
      label: "Safety Aware",
      headline: "You take safety seriously without letting it slow operations unnecessarily.",
      detail: "You follow safety protocols reliably and respond to clear hazards. Your safety awareness is solid — not hypervigilant, not dismissive — which is the practical standard most operations need.",
      hospitality_context: "You meet the safety requirements of most hospitality environments comfortably, with the practical judgement to balance safety with service pace.",
    },
    low: {
      label: "The Pace-First Operator",
      headline: "You move fast — and safety consciousness is the investment that protects that pace long-term.",
      detail: "Safety hazards don't automatically register in your attention. In fast-moving environments this can create risk. The good news: safety awareness is a learnable discipline, and operations that invest in it run faster, not slower.",
      hospitality_context: "Any role involving food preparation, guest accommodation, or public spaces requires active attention to safety. Developing this habit will remove a ceiling from your career progression.",
    },
  },
  dependability: {
    high: {
      label: "The Guarantee",
      headline: "If you said you'd do it, consider it done.",
      detail: "Your word is your contract. You follow through, don't make excuses, and flag problems before they become other people's emergencies. Teams build their planning around people like you.",
      hospitality_context: "In hospitality, where every shift is a live performance with no second takes, your dependability is the foundation the whole operation stands on.",
    },
    mid: {
      label: "Reliable by Default",
      headline: "People can count on you — not because you're perfect, but because you're consistent.",
      detail: "You show up, you deliver, and when something goes wrong you own it and fix it. That's more valuable than flawless performance with no accountability whatsoever.",
      hospitality_context: "Consistent dependability at this level builds the reputation that opens doors — within properties and across the wider industry.",
    },
    low: {
      label: "The Variable",
      headline: "Your best days are exceptional — now it's about making more of them.",
      detail: "Dependability is a skill, not just a trait. When you're engaged and energised, you're outstanding. The opportunity is bringing that standard to more days, not just the ones that feel right.",
      hospitality_context: "Properties that find what genuinely engages you and keep you in that zone will unlock consistent performance that surprises both of you.",
    },
  },
};

export function getNarrativeForScore(
  dimension: string,
  score: number
): NarrativeLevel | null {
  const narrative = dimensionNarratives[dimension];
  if (!narrative) return null;
  if (score >= 70) return narrative.high;
  if (score >= 40) return narrative.mid;
  return narrative.low;
}
