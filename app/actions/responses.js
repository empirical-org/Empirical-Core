const C = require("../constants").default
import rootRef from "../libs/firebase"
var	responsesRef = rootRef.child("responses")

export function deleteStatus(questionId) {
  return {type: C.DELETE_RESPONSE_STATUS, data: {questionId}}
}

export function loadResponseData(questionId) {
  return (dispatch, getState) => {
    dispatch(updateStatus(questionId, "LOADING"))
    responsesRef.orderByChild('questionUID').equalTo(questionId).once("value", (snapshot) => {
      dispatch(updateData(questionId, snapshot.val()))
      dispatch(updateStatus(questionId, "LOADED"))
    })
  }
}

export function updateStatus(questionId, status) {
  return {type: C.UPDATE_RESPONSE_STATUS, data: {questionId, status}}
}

export function updateData(questionId, responses) {
  return {type: C.UPDATE_RESPONSE_DATA, data: {questionId, responses}}
}
