import { type Archetype } from "./scoring";

export interface ArchetypeData {
  name: string;
  emoji: string;
  tagline: string;
  color: string;
  traits: string[];
  strengths: string[];
  workStyle: string;
  thrivesWhen: string[];
  challenges: string[];
  careerPaths: string[];
  welcomeMessage: string;
  prompts: string[];
}

export const archetypeData: Record<Archetype, ArchetypeData> = {
  lion: {
    name: "Lion",
    emoji: "🦁",
    tagline: "The Autonomous Leader",
    color: "hsl(38 92% 50%)",
    traits: ["Decisive", "Independent", "Visionary"],
    strengths: [
      "Takes ownership and drives results without hand-holding",
      "Makes confident decisions under pressure",
      "Inspires others through bold action",
      "Sets ambitious goals and pursues them relentlessly",
      "Naturally gravitates toward leadership positions",
    ],
    workStyle:
      "Lions prefer environments where they have full autonomy to make decisions and drive outcomes. They work best when given a clear mission and the freedom to execute it their way. They're energized by challenges and thrive under pressure.",
    thrivesWhen: [
      "Given full ownership of projects or initiatives",
      "Facing ambitious, high-stakes challenges",
      "Leading teams toward a compelling vision",
    ],
    challenges: [
      "Your drive for speed means you may move past team input — the trade-off of decisive leadership",
      "Highly structured, process-heavy environments feel less energising for you",
      "You naturally take on more responsibility than most — channelling that is your superpower",
    ],
    careerPaths: [
      "General Manager",
      "Hospitality Entrepreneur",
      "Head of Operations",
      "Executive Chef",
      "Regional Director",
      "Area Director",
    ],
    welcomeMessage: "Lions thrive with ownership. Let's find roles where you can lead.",
    prompts: [
      "What role would give you full ownership?",
      "Where do you want to lead in 3 years?",
      "What's your ultimate career ambition?",
    ],
  },
  whale: {
    name: "Whale",
    emoji: "🐋",
    tagline: "The Collaborative Anchor",
    color: "hsl(200 80% 50%)",
    traits: ["Empathetic", "Supportive", "Adaptive"],
    strengths: [
      "Builds deep, lasting relationships across teams",
      "Creates inclusive environments where everyone contributes",
      "Adapts quickly to changing circumstances and needs",
      "Brings calm stability during turbulent times",
      "Excels at mentoring and developing others",
    ],
    workStyle:
      "Whales are the glue that holds teams together. They thrive in collaborative environments where relationships matter. They bring emotional intelligence and adaptability, making them invaluable during change. They prioritize team success over individual recognition.",
    thrivesWhen: [
      "Working in tight-knit, supportive team environments",
      "Helping others grow and reach their potential",
      "Navigating change alongside trusted colleagues",
    ],
    challenges: [
      "Your preference for harmony means you approach conflict differently — navigating it is your growth edge",
      "You naturally prioritise relationships, which can mean efficiency takes a different path",
      "You tend to credit others before yourself — recognising your own impact is the opportunity",
    ],
    careerPaths: [
      "People & Culture Director",
      "Team Lead",
      "Learning & Development Manager",
      "Guest Relations Manager",
      "Guest Experience Manager",
      "Spa & Wellness Manager",
    ],
    welcomeMessage: "Whales excel in teams. Let's map collaborative paths.",
    prompts: [
      "What collaborative environment excites you?",
      "How do you want to support others' growth?",
      "What team culture matters most to you?",
    ],
  },
  falcon: {
    name: "Falcon",
    emoji: "🦅",
    tagline: "The Precision Specialist",
    color: "hsl(160 84% 39%)",
    traits: ["Detail-oriented", "Systematic", "Expert"],
    strengths: [
      "Delivers consistently flawless work with meticulous attention",
      "Creates and optimizes systems that improve efficiency",
      "Builds deep expertise that others rely on",
      "Identifies problems before they escalate",
      "Maintains high standards even under pressure",
    ],
    workStyle:
      "Falcons are precision-driven professionals who value expertise and systematic approaches. They build reliable processes and maintain the highest standards. They prefer clear expectations and structured environments where their attention to detail is an asset.",
    thrivesWhen: [
      "Working within clear systems and expectations",
      "Applying deep expertise to complex challenges",
      "Optimizing processes for peak efficiency",
    ],
    challenges: [
      "Your commitment to proven methods means rapid change feels less energising — you trade novelty for depth",
      "Your high standards mean you notice when others don't meet them — channelling that constructively is the skill",
      "Highly ambiguous environments draw less on your natural strengths — you're optimised for clarity and structure",
    ],
    careerPaths: [
      "Quality Assurance Manager",
      "Head Sommelier",
      "Financial Controller",
      "Revenue Manager",
      "Events & Catering Manager",
      "Concierge Manager",
    ],
    welcomeMessage: "Falcons shine in structured roles. Let's plan your precision career.",
    prompts: [
      "What systems do you want to master?",
      "Where can you apply your precision skills?",
      "What certifications or expertise do you want?",
    ],
  },
};
