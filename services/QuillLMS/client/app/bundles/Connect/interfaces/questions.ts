import { ConceptResult, Response } from 'quill-marking-logic';

// TODO: add/remove/update all interfaces to accurately reflect full data shape

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

export interface SentenceFragmentQuestion {
  attempts?: ResponseAttempt[];
  conceptID: string;
  flag: string;
  instructions: string;
  isFragment: boolean;
  key: string;
  modelConceptUID: string;
  needsIdentification: boolean;
  optimalResponseText: string;
  prompt: string;
  type: string;
  wordCountChange: {
    max: number;
    min: number;
  }
  identified?: boolean;
  ignoreCaseAndPunc?: boolean;
  incorrectSequences?: any;
  focusPoints?: any;
  concept_uid?: string;
}

export interface FillInBlankQuestion {
  attempts?: ResponseAttempt[];
  blankAllowed: boolean;
  caseInsensitive?: boolean;
  conceptID: string;
  cues: string[];
  cuesLabel: string;
  flag: string;
  instructions: string;
  itemLevel: string;
  key: string;
  mediaAlt?: string;
  mediaURL?: string;
  modelConceptUID?: string;
  prompt: string;
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
