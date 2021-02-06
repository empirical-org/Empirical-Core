export interface ActivityRouteProps {
  activityId: string
}

export interface ActivityInterface {
  id?: string,
  parent_activity_id?: string,
  title: string,
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
  regex_text: string,
  case_sensitive: boolean
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
  text: string
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
  prompt_ids: number[],
  plagiarism_text_attributes?: {
    id: number,
    rule_id: number,
    text: string
  }[]
  regex_rules?: {
    id: number,
    rule_id: number,
    regex_text: string,
    case_sensitive: boolean
  }[]
  regex_rules_attributes?: {
    id: number,
    regex_text: string,
    case_sensitive: boolean
  }[]
  feedbacks?: {
    id: number,
    rule_id: number,
    text: string,
    description?: string,
    order: number,
    highlights: string[]
  }[]
}

export interface RuleFeedbackInterface {
  description?: string,
  highlights?: string[],
  id?: number,
  order?: number,
  rule_id?: number,
  text: string
}
