import {Response} from "quill-marking-logic"

interface Attempt {
  response: Response
}

function getAnswerState(attempt): boolean {
  return (attempt.response.optimal && attempt.response.author === undefined && attempt.author === undefined)
}

export default getAnswerState;