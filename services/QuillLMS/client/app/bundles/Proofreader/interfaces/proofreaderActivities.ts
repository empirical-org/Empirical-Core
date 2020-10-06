export interface ProofreaderActivities {
  [key: string]: ProofreaderActivity;
}

export interface ProofreaderActivity {
  description: string;
  title: string;
  passage: string;
  standard: Standard;
  standardLevel: StandardLevel;
  standardCategory: StandardCategory;
  underlineErrorsInProofreader: boolean;
  flag?: string;
}

export interface Standard {
  name: string;
  uid: string;
}

export interface StandardLevel {
  name: string;
  uid: string;
}

export interface StandardCategory {
  name: string;
  uid: string;
}

export interface ConceptResultObject {
  metadata: ConceptResultMetadata,
  concept_uid: string,
  question_type: "passage-proofreader"
}

export interface ConceptResultMetadata {
  answer: string,
  correct: 0|1,
  instructions: string,
  prompt: string,
  questionNumber: number,
  unchanged: boolean,
}

export interface Concepts {
  [key: string]: Concept
}

export interface Concept {
  quantity: number;
}

export interface WordObject {
  originalText: string;
  currentText: string;
  correctText: string;
  underlined: Boolean;
  wordIndex: number;
  paragraphIndex: number;
  necessaryEditIndex?: number;
  conceptUID?: string;
}
