export interface GrammarActivity {
  concepts: Concepts;
  description: string;
  title: string;
}

export interface Concepts {
  [key:string]: Concept
}

export interface Concept {
  quantity: number;
}
