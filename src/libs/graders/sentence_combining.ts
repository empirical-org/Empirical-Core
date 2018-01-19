import {Response, IncorrectSequence, FocusPoint, GradingObject} from '../../interfaces'
import {exactMatch} from '../matchers/exact_match';
import {getOptimalResponses} from '../sharedResponseFunctions'
import {punctuationInsensitiveMatch} from '../matchers/punctuation_insensitive_match';
import {correctSentenceFromSamples} from 'quill-spellchecker'
export function checkAnswer(
  question_uid: string,
  response: string, 
  responses: Array<Response>, 
  focusPoints: Array<FocusPoint>|null, 
  incorrectSequences: Array<IncorrectSequence>|null
): Response {
  const responseTemplate = {
    text: response,
    question_uid,
    count: 1
  }
  const data = {
    response, 
    responses,
    focusPoints,
    incorrectSequences,
  }
  const firstPass = firstPassOriginalResponse(data)
  if (firstPass) {
    return Object.assign(responseTemplate, firstPass)
  }
  // Correct the spelling and try again.
  const spellingPass = firstPassOriginalResponse(prepareSpellingData(data))

  if (spellingPass) {
    // Update the indicate spelling is also needed.
    return Object.assign(responseTemplate, firstPass)
  }
  
}

function* firstPassMatchers(data: GradingObject) {
  yield exactMatch(data.response, data.responses)
  yield punctuationInsensitiveMatch(data.response, data.responses)
}

function firstPassOriginalResponse(data: GradingObject) {
  const gen = firstPassMatchers(data)
  let next = gen.next();
  while (true) {
    if (next.value || next.done) {
      break
    }
    next = gen.next()
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
