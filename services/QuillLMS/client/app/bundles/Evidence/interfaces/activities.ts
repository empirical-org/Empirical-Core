import { Settings } from "http2";

export interface Activity {
  activity_id: number;
  title: string;
  passages: Array<Passage>
  prompts: Array<Prompt>;
}

export interface Prompt {
  id: number;
  text: string;
  conjunction: string;
  max_attempts: number;
  max_attempts_feedback: string;
}

export interface Passage {
  id: number,
  text: string,
  image_link?: string,
  image_alt_text?: string,
  image_caption?: string,
  image_attribution?: string,
  highlight_prompt?: string,
  essential_knowledge_text?: string
}
