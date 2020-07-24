export interface ConceptFeedbackCollection {
  [key: string]: ConceptFeedback
}

export interface ConceptFeedback {
  description: string;
  leftBox: string;
  rightBox: string;
}
