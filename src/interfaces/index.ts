export interface Response {
  text: string,
  feedback?: string|null,
  conceptResults?: ConceptResults|null,
  author?: string|null,
  count: number,
  first_attempt_count?: number|null,
  child_count?: number|null,
  weak?: Boolean|null,
  optimal?: Boolean|null,
  question_uid: string,
  parent_uid?: string|null,
  parent_id?: number|null,
  parentId?: number|null,
  id?: number,
  uid?: string|null,
  key?: string,
  created_at?: string,
  updated_at?: string,
  sortOrder?: number,
  statusCode?: number
}

export interface ConceptResults {
 [key:string]: Boolean
}

export interface FocusPoint {
  text: string,
  feedback: string
}

export interface IncorrectSequence {
  text: string,
  feedback: string
}
