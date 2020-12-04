export interface Activity {
  activity_id: number;
  title: string;
  passages: Array<Passage>
  prompts: Array<Prompt>;
}

export interface Prompt {
  prompt_id: number;
  text: string;
  max_attempts: number;
  max_attempts_feedback: string;
}

export interface Passage {
  id: number,
  text: string
}
