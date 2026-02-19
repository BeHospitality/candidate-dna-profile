import type { ExperiencePath } from "@/data/questions";

export type EntryMode = "public" | "candidate" | "team";

export interface EntryInfo {
  mode: EntryMode;
  token?: string;
  orgCode?: string;
  candidateEmail?: string;
  candidateName?: string;
}

const KEYS = {
  mode: "dna-entry-mode",
  answers: "dna-answers",
  results: "dna-results",
  milestones: "dna-milestones",
  motivators: "dna-motivators",
  assessmentId: "dna-assessment-id",
  experiencePath: "dna_experience_path",
} as const;

export const storage = {
  setEntryMode: (info: EntryInfo) => localStorage.setItem(KEYS.mode, JSON.stringify(info)),
  getEntryMode: (): EntryInfo => {
    try { return JSON.parse(localStorage.getItem(KEYS.mode) || '{"mode":"public"}'); }
    catch { return { mode: "public" }; }
  },

  setAnswers: (answers: Record<number, any>) => localStorage.setItem(KEYS.answers, JSON.stringify(answers)),
  getAnswers: (): Record<number, any> => {
    try { return JSON.parse(localStorage.getItem(KEYS.answers) || "{}"); }
    catch { return {}; }
  },

  setResults: (results: any) => localStorage.setItem(KEYS.results, JSON.stringify(results)),
  getResults: () => {
    try { return JSON.parse(localStorage.getItem(KEYS.results) || "null"); }
    catch { return null; }
  },

  setMilestones: (milestones: any[]) => localStorage.setItem(KEYS.milestones, JSON.stringify(milestones)),
  getMilestones: (): any[] => {
    try { return JSON.parse(localStorage.getItem(KEYS.milestones) || "[]"); }
    catch { return []; }
  },

  setMotivators: (motivators: Record<string, string>) => localStorage.setItem(KEYS.motivators, JSON.stringify(motivators)),
  getMotivators: (): Record<string, string> => {
    try { return JSON.parse(localStorage.getItem(KEYS.motivators) || "{}"); }
    catch { return {}; }
  },

  setAssessmentId: (id: string) => localStorage.setItem(KEYS.assessmentId, id),
  getAssessmentId: (): string | null => localStorage.getItem(KEYS.assessmentId),

  setExperiencePath: (path: ExperiencePath) => localStorage.setItem(KEYS.experiencePath, path),
  getExperiencePath: (): ExperiencePath | null => localStorage.getItem(KEYS.experiencePath) as ExperiencePath | null,

  clear: () => Object.values(KEYS).forEach((k) => localStorage.removeItem(k)),
};
