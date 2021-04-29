export interface ActivityRouteProps {
  activityId: string,
  type?: string
}

export interface ActivityInterface {
  id?: string,
  parent_activity_id?: string,
  title: string,
  name: string,
  // flag: string,
  scored_level: string,
  target_level: number,
  passages?: PassagesInterface[],
  prompts?: PromptInterface[],
  passage_attributes?: PassagesInterface[],
  prompt_attributes?: PromptInterface[]
}

export interface PromptInterface {
  id?: number,
  conjunction: string,
  text: string,
  max_attempts: number,
  max_attempts_feedback: string
}

export interface RegexRuleInterface {
  id?: number,
  rule_id?: number,
  regex_text: string,
  case_sensitive: boolean,
  sequence_type: string
}

export interface FlagInterface {
  label: string,
  value: {}
}

export interface ActivityRuleSetPrompt {
  id?: number,
  conjunction: string
}

export interface TurkSessionInterface {
  id: number
  activity_id: number,
  expires_at: string,
  expired: boolean
}

export interface PassagesInterface {
  id?: number,
  text: string,
  image_link?: string,
  image_alt_text?: string
}

export interface RuleInterface {
  id?: number,
  uid?: string,
  name: string,
  description?: string,
  universal: boolean,
  rule_type: string,
  optimal: boolean,
  suborder: number,
  concept_uid: string,
  prompt_ids?: number[],
  state: string,
  label?: {
    id: number,
    name: string
  },
  plagiarism_text?: {
    id?: number,
    rule_id?: number,
    text: string
  }
  regex_rules?: RegexRuleInterface[]
  regex_rules_attributes?: RegexRuleInterface[]
  feedbacks?: {
    id?: number,
    rule_id?: number,
    text: string,
    description?: string,
    order: number,
    highlights?: any[]
    highlights_attributes?: any[]
  }[]
}

export interface RuleFeedbackInterface {
  description?: string,
  highlights?: any[],
  highlights_attributes?: any[],
  id?: number,
  order?: number,
  rule_id?: number,
  text: string
}

export interface DropdownObjectInterface {
  value: string,
  label: string
}

export type InputEvent = React.ChangeEvent<HTMLInputElement>;
export type ClickEvent = React.MouseEvent<HTMLElement>;
