import { Response } from "quill-marking-logic";

export interface Attempt {
  response: Response
}

function getAnswerState(attempt: Attempt|undefined): boolean {
  if (attempt) {
    return !!(attempt.response.optimal)
  }
  return false
}

export default getAnswerState;