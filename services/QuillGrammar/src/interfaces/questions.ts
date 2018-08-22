import { Response } from 'quill-marking-logic'

export interface Questions {
  [key:string]: Question
}

export interface Question {
  answers: Answer[];
  concept_uid: string;
  instructions: string;
  prompt: string;
  rule_description: string;
  attempts?: Response[];
  uid: string;
  key?: string;
  flag?: string;
}

export interface Answer {
  text: string;
}

export interface FormattedConceptResult {
  metadata: ConceptResultMetadata;
  concept_uid: string;
  question_type: string;
}

export interface ConceptResultMetadata {
  answer: string;
  correct: number;
  directions: string;
  prompt: string;
  questionNumber?: number;
  questionScore?: number;
  question_uid: string;
}
