import { Response } from "../../../Shared/quill-marking-logic/src/main";

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
