import { Questions } from './questions';

export interface GrammarActivities {
  [key: string]: GrammarActivity
}

export interface GrammarActivity {
  description: string;
  title: string;
  questions?: Questions;
  concepts?: Concepts;
  flag?: string;
}

export interface Concepts {
  [key: string]: Concept
}

export interface Concept {
  quantity: number;
}
