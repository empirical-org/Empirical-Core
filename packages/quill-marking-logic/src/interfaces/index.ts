export interface Response {
  author?: string|null,
  feedback?: string|null,
  first_attempt_count?: number|null,
  child_count?: number|null,
  concept_results?: Array<ConceptResult>|null,
  conceptResults?: Array<ConceptResult>|null,
  count: number,
  created_at?: string,
  id?: number,
  key?: string,
  misspelled_words?: Array<string>;
  optimal?: Boolean|null,
  parent_uid?: string|null,
  parent_id?: number|string|null,
  parentId?: number|string|null,
  question_uid: string,
  sortOrder?: number,
  statusCode?: number
  uid?: string|null,
  updated_at?: string,
  text: string,
  weak?: Boolean|null,
  spelling_error?: Boolean|null,
}

export interface PartialResponse {
  author?: string|null,
  feedback?: string|null,
  first_attempt_count?: number|null,
  child_count?: number|null,
  concept_results?: Array<ConceptResult>|null,
  conceptResults?: Array<ConceptResult>|null,
  created_at?: string,
  id?: number,
  key?: string,
  misspelled_words?: Array<string>;
  optimal?: Boolean|null,
  parent_uid?: string|null,
  parent_id?: number|string|null,
  parentId?: number|string|null,
  sortOrder?: number,
  statusCode?: number
  uid?: string|null,
  updated_at?: string,
  weak?: Boolean|null,
  errorType?: string,
}


export interface ConceptResult {
 correct: Boolean,
 conceptUID: string,
 name?: string,
 key?: string
}

export interface FocusPoint {
  text: string,
  feedback: string,
  concept_uid?: string,
  concept_results?: Array<ConceptResult>,
  conceptResults?: Array<ConceptResult>,
  key?: string
}

export interface IncorrectSequence {
  text: string,
  feedback: string,
  concept_results?: Array<ConceptResult>,
  conceptResults?: Array<ConceptResult>,
  caseInsensitive?: boolean|null
}

export interface FeedbackObject {
  feedback: string
}

export interface GradingObject {
  response: string,
  responses: Array<Response>,
  focusPoints?: Array<FocusPoint>,
  incorrectSequences?: Array<IncorrectSequence>,
  spellCorrectedResponse?: string
}

export interface WordCountChange {
  min?: number,
  max?: number
}
