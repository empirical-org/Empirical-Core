import {Response, IncorrectSequence, FocusPoint, GradingObject} from '../../interfaces'
import {exactMatch} from '../matchers/exact_match';
import {getOptimalResponses} from '../sharedResponseFunctions'
import {punctuationInsensitiveMatch} from '../matchers/punctuation_insensitive_match';
import {correctSentenceFromSamples} from 'quill-spellchecker'
export function checkAnswer(
  response: string, 
  responses: Array<Response>, 
  focusPoints: Array<FocusPoint>|null, 
  incorrectSequences: Array<IncorrectSequence>|null
): Response {
  const data = {
    response, 
    responses,
    focusPoints,
    incorrectSequences,
  }
  const firstPass = firstPassOriginalResponse(data)
  if (firstPass) {
    return firstPass
  }
  // Correct the spelling and try again.
  const spellingPass = firstPassOriginalResponse(prepareSpellingData(data))

  if (spellingPass) {
    return spellingPass
  }
  
}

function* firstPassMatchers(data: GradingObject) {
  yield exactMatch(data.response, data.responses)
  yield punctuationInsensitiveMatch(data.response, data.responses)
}

function firstPassOriginalResponse(data: GradingObject) {
  const gen = firstPassMatchers(data)
  let next = gen.next();
  console.log(next)
  while (true) {
    if (next.value || next.done) {
      break
    }
    next = gen.next()
    console.log(next)
  }
  if (next.value) {
    return next.value
  }

}


function prepareSpellingData(data: GradingObject) {
  const spellingData = Object.assign({}, data)
  const optimalAnswerStrings = getOptimalResponses(data.responses).map(resp => resp.text)
  spellingData.response = correctSentenceFromSamples(optimalAnswerStrings,data.response,true)
  return spellingData 
}
