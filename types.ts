
export interface CoreConcept {
  concept: string;
  explanation: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface StudyGuide {
  topic: string;
  summary: string;
  core_concepts: CoreConcept[];
  key_terms: KeyTerm[];
}

export type Language = 'en' | 'th';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
}

export type Quiz = QuizQuestion[];

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface BookChapter {
  title: string;
  content: string;
}

export interface GlossaryTerm {
    term: string;
    definition: string;
}

export interface FullBook {
  title: string;
  summary: string;
  chapters: BookChapter[];
  glossary: GlossaryTerm[];
}