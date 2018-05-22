import { Response } from 'quill-marking-logic'

export interface Question {
  answers: Array<Answer>;
  concept_uid: string;
  instructions: string;
  prompt: string;
  rule_description: string;
  attempts?: Array<Response>;
  uid: string;
}

export interface Answer {
  text: string;
}
