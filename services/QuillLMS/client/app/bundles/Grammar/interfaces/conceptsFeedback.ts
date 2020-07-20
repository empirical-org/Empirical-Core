export interface ConceptFeedback {
  description: string;
  leftBox: string;
  rightBox: string;
}

export interface ConceptFeedbackCollection {
  [key: string]: ConceptFeedback
}
