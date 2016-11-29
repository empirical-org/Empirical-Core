import {hashToCollection} from '../../libs/hashToCollection'
import _ from 'underscore'
import generateFeedbackString from './generateFeedbackString.js'
import {
  incrementResponseCount,
  submitNewResponse
} from "../../actions/responses.js"


const getLatestAttempt = function (attempts = []) {
  const lastIndex = attempts.length - 1;
  return attempts[lastIndex]
}

function getQuestion(props, playQuestion) {
  //// console.log("Inside getQuestion in module, playQuestion: ", playQuestiond)
  if(playQuestion==="play") {
    const {data} = props.questions, {questionID} = props.params;
    return (data[questionID])
  } else {
    return props.question
  }
}

export default function updateResponseResource (returnValue, props, getErrorsForAttempt, playQuestion) {
  var qid = (playQuestion==="play") ? props.params.questionID : props.question.key

  var previousAttempt;
  const responses = hashToCollection(getQuestion(props, playQuestion).responses);

  const preAtt = getLatestAttempt(props.question.attempts)
  if (preAtt) {previousAttempt = _.find(responses, {text: getLatestAttempt(props.question.attempts).submitted}) }
  const prid = previousAttempt ? previousAttempt.key : undefined

  if (returnValue.found && returnValue.response.key) {
    props.dispatch(
      incrementResponseCount(qid, returnValue.response.key, prid)
    )
  } else {
    props.dispatch(
      submitNewResponse(returnValue.response, prid)
    )
  }
}
