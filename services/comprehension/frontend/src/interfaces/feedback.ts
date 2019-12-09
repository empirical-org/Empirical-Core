export interface FeedbackObject {
  feedback: string,
  feedback_type: string,
  optimal: boolean,
  response_id: string,
  highlight?: Array<Highlight>
}

export interface Highlight {
  type: string;
  text: string
  id?: number;
}
