import type { ExperiencePath } from "./questions";

export interface Chapter {
  id: number;
  name: string;
  subtitle: string;
  questionRange: { start: number; end: number };
  timeEstimate: string;
  unlockDescription: string;
  emoji: string;
  paths: ExperiencePath[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    name: "Let's Find Your Tribe",
    subtitle: "Discover whether you're a Lion, Whale, or Falcon",
    questionRange: { start: 1, end: 12 },
    timeEstimate: "~3 min",
    unlockDescription: "Your Archetype + personality radar chart",
    emoji: "🧬",
    paths: ['entry', 'experienced', 'executive'],
  },
  {
    id: 2,
    name: "How Does Your Brain Work?",
    subtitle: "Explore your cognitive strengths and problem-solving style",
    questionRange: { start: 13, end: 27 },
    timeEstimate: "~4 min",
    unlockDescription: "Your Cognitive Profile + sector hints",
    emoji: "🧠",
    paths: ['entry', 'experienced', 'executive'],
  },
  {
    id: 3,
    name: "What Do People See?",
    subtitle: "Uncover your personality signature and how others experience you",
    questionRange: { start: 28, end: 47 },
    timeEstimate: "~5 min",
    unlockDescription: "Your Personality Map + sector & department matches",
    emoji: "👤",
    paths: ['entry', 'experienced', 'executive'],
  },
  {
    id: 4,
    name: "Can You Read a Room?",
    subtitle: "Test your emotional intelligence and people instincts",
    questionRange: { start: 48, end: 62 },
    timeEstimate: "~4 min",
    unlockDescription: "Your EQ Profile + geography matching",
    emoji: "👁️",
    paths: ['experienced', 'executive'],
  },
  {
    id: 5,
    name: "What's Your Backbone?",
    subtitle: "Explore your integrity, dependability, and safety instincts",
    questionRange: { start: 63, end: 77 },
    timeEstimate: "~4 min",
    unlockDescription: "Your full 23-dimension profile",
    emoji: "🦴",
    paths: ['experienced'],
  },
  {
    id: 6,
    name: "Where Are You Going?",
    subtitle: "Map your career aspirations and find your direction",
    questionRange: { start: 78, end: 101 },
    timeEstimate: "~4 min",
    unlockDescription: "Your Career Pathway + complete DNA results",
    emoji: "🧭",
    paths: ['entry', 'experienced', 'executive'],
  },
];

/** Get chapters applicable to a specific experience path */
export function getChaptersForPath(path: ExperiencePath): Chapter[] {
  return CHAPTERS.filter(ch => ch.paths.includes(path));
}

/** Find which chapter a question ID belongs to */
export function getChapterForQuestion(questionId: number): Chapter | undefined {
  return CHAPTERS.find(
    ch => questionId >= ch.questionRange.start && questionId <= ch.questionRange.end
  );
}

/** Get the question's position within its chapter, relative to the user's actual path questions */
export function getQuestionInChapter(
  questionId: number,
  chapter: Chapter,
  pathQuestionIds: number[]
): { current: number; total: number } {
  const chapterQuestionIds = pathQuestionIds.filter(
    qId => qId >= chapter.questionRange.start && qId <= chapter.questionRange.end
  );
  const current = chapterQuestionIds.indexOf(questionId) + 1;
  return { current, total: chapterQuestionIds.length };
}
