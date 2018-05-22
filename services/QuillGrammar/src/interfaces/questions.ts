export interface Question {
  answers: Array<Answer>;
  concept_uid: string;
  instructions: string;
  prompt: string;
  rule_description: string;
  attempts?: string;
  uid: string;
}

export interface Answer {
  text: string;
}
