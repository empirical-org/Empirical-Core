import { ConceptResult, Response } from 'quill-marking-logic';

export type ResponseAttempt = Response & { conceptResults: { [key: string]: ConceptResult } }

export interface Questions {
  [key: string]: Question
}

export interface Question {
  answers: Answer[];
  concept_uid: string;
  instructions: string;
  prompt: string;
  rule_description: string;
  uid: string;
  attempts?: ResponseAttempt[];
  modelConceptUID?: string;
  focusPoints?: Array<FocusPoint>;
  incorrectSequences?: Array<IncorrectSequence>;
  key?: string;
  flag?: string;
  cues?: Array<string>;
  cuesLabel?: string;
}

export interface Answer {
  text: string;
}

export interface IncorrectSequence {
  text: string;
  feedback: string;
  conceptResults: {
    [key:string]: {
      correct: boolean;
      name: string;
      conceptUID: string;
    }
  }
}

export interface FocusPoint {
  text: string;
  feedback: string;
  conceptResults: {
    [key:string]: {
      correct: boolean;
      name: string;
      conceptUID: string;
    }
  }
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
