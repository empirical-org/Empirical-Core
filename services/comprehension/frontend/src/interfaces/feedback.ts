export interface FeedbackObject {
  feedback: string,
  feedback_type: string,
  optimal: boolean,
  response_id: string,
  entry: string,
  highlight: Highlight[],
  labels?: string
}

export interface Highlight {
  type: string;
  text: string
  id?: number;
  category: string;
  character?: number;
}
