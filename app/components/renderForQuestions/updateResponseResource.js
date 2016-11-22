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

export default function updateResponseResource (response, props, getErrorsForAttempt, playQuestion) {
  var qid = (playQuestion==="play") ? props.params.questionID : props.question.key

  var previousAttempt;
  const responses = hashToCollection(getQuestion(props, playQuestion).responses);

  const preAtt = getLatestAttempt(props.question.attempts)
  if (preAtt) {previousAttempt = _.find(responses, {text: getLatestAttempt(props.question.attempts).submitted}) }
  const prid = previousAttempt ? previousAttempt.key : undefined

  if (response.found) {
    var errors = _.keys(getErrorsForAttempt(response))
    if (errors.length === 0) {
      props.dispatch(
        incrementResponseCount(qid, response.response.key, prid)
      )
    } else {
      var newErrorResp = {
        text: response.submitted,
        count: 1,
        parentID: response.response.key,
        author: response.author,
        feedback: generateFeedbackString(response),
        questionUID: qid
      }
      // console.log("newErrorResp.feedback: " + playQuestion, newErrorResp.feedback)
      props.dispatch(
        submitNewResponse(newErrorResp, prid)
      )
    }
  } else {
    var newResp = {
      text: response.submitted,
      count: 1,
      questionUID: qid
    }
    props.dispatch(
      submitNewResponse(newResp, prid)
    )
  }
}
