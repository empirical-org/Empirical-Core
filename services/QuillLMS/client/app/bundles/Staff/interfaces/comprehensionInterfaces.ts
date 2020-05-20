export interface ActivityRouteProps { 
  activityId: string 
}

export interface ActivityRuleSetInterface {
  id?: number,
	name: string,
  feedback: string,
  rules?: RegexRuleInterface[],
  prompts?: {
    id: number,
    conjunction: string,
  }[],
  prompt_ids?: number[]
}

export interface ActivityInterface {
  activity_id?: string,
  title: string,
  flag: string,
  passages: string[],
  prompts: PromptInterface[]
}

export interface PromptInterface {
  prompt_id?: number,
  conjunction: string,
  text: string,
  max_attempts: number,
  max_attempts_feedback: string
}

export interface RegexRuleInterface {
  id?: number;
  regex_text: string;
  case_sensitive: boolean;
}

export interface FlagInterface {
  label: string,
  value: {}
}
