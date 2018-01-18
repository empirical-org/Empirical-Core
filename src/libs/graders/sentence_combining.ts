import {Response, IncorrectSequence, FocusPoint, GradingObject} from '../../interfaces'
import {exactMatch} from '../matchers/exact_match';
import {punctuationInsensitiveMatch} from '../matchers/punctuation_insensitive_match';
export function checkAnswer(
  response: string, 
  responses: Array<Response>, 
  focusPoints: Array<FocusPoint>|null, 
  incorrectSequences: Array<IncorrectSequence>|null
): Response {
  let next;
  const gen = firstPassMatchers({
    response, 
    responses,
    focusPoints,
    incorrectSequences,
  })
  while (!(next = gen.next()).value) {
    console.log("Next", next)
  }
  return next.value
}

function* firstPassMatchers(data: GradingObject) {
  yield exactMatch(data.response, data.responses)
  yield punctuationInsensitiveMatch(data.response, data.responses)
}

