export interface Response {
  author?: string|null,
  feedback?: string|null,
  first_attempt_count?: number|null,
  child_count?: number|null,
  concept_results?: Array<ConceptResult>|null,
  count: number,
  created_at?: string,
  id?: number,
  key?: string,
  optimal?: Boolean|null,
  parent_uid?: string|null,
  parent_id?: number|null,
  parentId?: number|null,
  question_uid: string,
  sortOrder?: number,
  statusCode?: number
  uid?: string|null,
  updated_at?: string,
  text: string,
  weak?: Boolean|null,
}

export interface PartialResponse {
  author?: string|null,
  feedback?: string|null,
  first_attempt_count?: number|null,
  child_count?: number|null,
  concept_results?: Array<ConceptResult>|null,
  created_at?: string,
  id?: number,
  key?: string,
  optimal?: Boolean|null,
  parent_uid?: string|null,
  parent_id?: number|null,
  parentId?: number|null,
  sortOrder?: number,
  statusCode?: number
  uid?: string|null,
  updated_at?: string,
  weak?: Boolean|null,
}


export interface ConceptResult {
 correct: Boolean,
 conceptUID: string
}

export interface FocusPoint {
  text: string,
  feedback: string
}

export interface IncorrectSequence {
  text: string,
  feedback: string
}

export interface FeedbackObject {
  feedback: string
}

export interface GradingObject {
  response: string,
  responses: Array<Response>,
  focusPoints: Array<FocusPoint>,
  incorrectSequences: Array<IncorrectSequence>
}
