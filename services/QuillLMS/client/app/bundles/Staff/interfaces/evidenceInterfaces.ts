export interface ActivityRouteProps {
  activityId: string,
  type?: string,
  promptConjunction?: string
}

export interface InvalidHighlight {
  rule_id: number,
  rule_type: string,
  prompt_id?: number
}

export interface ActivityInterface {
  id?: string,
  parent_activity_id?: string,
  flag?: string,
  title: string,
  notes: string,
  scored_level?: string,
  target_level?: number,
  version: number,
  passages?: PassagesInterface[],
  prompts?: PromptInterface[],
  passage_attributes?: PassagesInterface[],
  prompt_attributes?: PromptInterface[],
  invalid_highlights?: InvalidHighlight[]
}

export interface PromptInterface {
  id?: number,
  conjunction: string,
  text: string,
  max_attempts: number,
  max_attempts_feedback: string,
  first_strong_example: string,
  second_strong_example: string
}

export interface RegexRuleInterface {
  id?: number,
  rule_id?: number,
  regex_text: string,
  case_sensitive: boolean,
  sequence_type: string,
  conditional: boolean,
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
  image_alt_text?: string,
  image_caption?: string,
  image_attribution?: string,
  highlight_prompt?: string,
  essential_knowledge_text?: string
}

export interface PlagiarismText {
  id?: number,
  rule_id?: number,
  text: string
}

export interface RuleInterface {
  id?: number,
  uid?: string,
  name: string,
  note?: string,
  universal: boolean,
  rule_type: string,
  optimal: boolean,
  suborder: number,
  concept_uid: string,
  prompt_ids?: number[],
  state: string,
  conditional?: boolean,
  hint?: {
    id: number,
    image_link: string,
    explanation: string
  },
  label?: {
    id: number,
    name: string
  },
  plagiarism_texts?: PlagiarismText[],
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

export interface ActivitySessionInterface {
  activity_id: number,
  because_attempts: number,
  but_attempts: number,
  complete: boolean,
  flags: string[],
  scored_count: number,
  session_uid: string,
  so_attempts: number,
  start_date: string,
  strong_count: number,
  weak_count: number
}

export interface ActivitySessionsInterface {
  current_page: number,
  total_pages: number,
  activity_sessions: ActivitySessionInterface[]
}

export interface DropdownObjectInterface {
  value: any,
  label: string
}

export interface PromptHealthInterface {
  session_count: number,
  total_responses: number,
  display_name: number,
  num_final_attempt_optimal: number,
  num_final_attempt_not_optimal: number,
  avg_attempts: number,
  num_sessions_with_consecutive_repeated_rule: number,
  num_sessions_with_non_consecutive_repeated_rule: number,
  num_first_attempt_optimal: number,
  num_first_attempt_not_optimal: number
}

export type InputEvent = React.ChangeEvent<HTMLInputElement>;
export type TextAreaEvent = React.ChangeEvent<HTMLTextAreaElement>;
export type ClickEvent = React.MouseEvent<HTMLElement>;
