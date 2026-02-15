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
      "May overlook team input in pursuit of speed",
      "Can struggle with highly structured, process-heavy environments",
      "Might take on too much responsibility alone",
    ],
    careerPaths: [
      "General Manager",
      "Startup Founder",
      "Head of Operations",
      "Executive Chef",
      "Regional Director",
      "Entrepreneur",
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
      "May avoid necessary conflict or difficult decisions",
      "Can prioritize harmony over efficiency",
      "Might undervalue their own contributions",
    ],
    careerPaths: [
      "HR Director",
      "Team Lead",
      "Training Manager",
      "Guest Relations Manager",
      "People & Culture Head",
      "Community Manager",
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
      "May resist change if processes are already working",
      "Can be overly critical of work that doesn't meet their standards",
      "Might struggle in highly ambiguous, unstructured environments",
    ],
    careerPaths: [
      "Quality Assurance Manager",
      "Head Sommelier",
      "Financial Controller",
      "Revenue Manager",
      "Compliance Director",
      "Technical Specialist",
    ],
    welcomeMessage: "Falcons shine in structured roles. Let's plan your precision career.",
    prompts: [
      "What systems do you want to master?",
      "Where can you apply your precision skills?",
      "What certifications or expertise do you want?",
    ],
  },
};
