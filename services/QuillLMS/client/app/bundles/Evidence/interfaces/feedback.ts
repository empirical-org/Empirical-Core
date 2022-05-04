export interface FeedbackObject {
  concept_uid: string,
  feedback: string,
  feedback_type: string,
  optimal: boolean,
  response_id?: string,
  entry: string,
  highlight: Highlight[],
  hint?: Hint,
  labels?: string
}

export interface Highlight {
  type: string;
  text: string
  id?: number;
  category: string;
  character?: number;
}

export interface Hint {
  id: number;
  image_alt_text: string;
  image_link: string;
  explanation: string;
}
