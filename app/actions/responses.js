/* eslint-env browser*/
import _ from 'underscore';
import pathwaysActions from './pathways';
import rootRef from '../libs/firebase';
import { hashToCollection } from '../libs/hashToCollection.js';
import request from 'request';

const C = require('../constants').default;
const moment = require('moment');

const responsesRef = rootRef.child('responses');

export function deleteStatus(questionId) {
  return { type: C.DELETE_RESPONSE_STATUS, data: { questionId, }, };
}

export function updateStatus(questionId, status) {
  return { type: C.UPDATE_RESPONSE_STATUS, data: { questionId, status, }, };
}

export function updateData(questionId, responses) {
  return { type: C.UPDATE_RESPONSE_DATA, data: { questionId, responses, }, };
}

function responsesForQuestionRef(questionId) {
  return responsesRef.orderByChild('questionUID').equalTo(questionId);
}

function getQuestionLoadedStatusForGroupedResponses(groupedResponses) {
  const questionsKeys = _.keys(groupedResponses);
  const statuses = {};
  questionsKeys.forEach((key) => {
    statuses[key] = 'LOADED';
  });
  console.log(statuses);
  return statuses;
}

function groupResponsesByQuestion(snapshot) {
  const groupedResponses = {};
  for (const responseKey in snapshot) {
    if (snapshot.hasOwnProperty(responseKey)) {
      const response = snapshot[responseKey];
      if (response.questionUID) {
        if (groupedResponses[response.questionUID]) {
          groupedResponses[response.questionUID][responseKey] = response;
        } else {
          groupedResponses[response.questionUID] = {};
          groupedResponses[response.questionUID][responseKey] = response;
        }
      }
    }
  }
  return groupedResponses;
}

export function loadAllResponseData() {
  return (dispatch) => {
    responsesRef.once('value', (snapshot) => {
      const data = groupResponsesByQuestion(snapshot.val());
      const status = getQuestionLoadedStatusForGroupedResponses(data);
      dispatch({ type: 'BULK UPDATE', data: { data, status, }, });
    });
  };
}

export function loadResponseData(questionId) {
  return (dispatch) => {
    // dispatch(updateStatus(questionId, 'LOADING'));
    responsesForQuestionRef(questionId).once('value', (snapshot) => {
      dispatch(updateData(questionId, snapshot.val()));
      // dispatch(updateStatus(questionId, 'LOADED'));
    });
  };
}

export function loadMultipleResponses(arrayOfQuestionIDs, cb) {
  return (dispatch) => {
    const newValues = {};
    const it = makeIterator(arrayOfQuestionIDs);
    const firstID = it.next().value;
    const doneTask = (newResponseData) => {
      dispatch({ type: 'BULK UPDATE', data: { data: newResponseData, status: {}, }, });
      cb();
    };
    loadResponseDataAndCallback(firstID, newValues, it, doneTask);
  };
}

function loadResponseDataAndCallback(questionId, dataHash, iterator, cb) {
  if (questionId === undefined) {
    cb(dataHash);
  } else {
    responsesForQuestionRef(questionId).once('value', (snapshot) => {
      dataHash[questionId] = snapshot.val();
      loadResponseDataAndCallback(iterator.next().value, dataHash, iterator, cb);
    });
  }
}

export function loadResponseDataAndListen(questionId) {
  return (dispatch) => {
    dispatch(updateStatus(questionId, 'LOADING'));
    responsesForQuestionRef(questionId).on('value', (snapshot) => {
      dispatch(updateData(questionId, snapshot.val()));
      dispatch(updateStatus(questionId, 'LOADED'));
    });
  };
}

export function stopListeningToResponses(questionId) {
  return () => {
    responsesForQuestionRef(questionId).off('value');
  };
}

export function submitNewResponse(content, prid, isFirstAttempt) {
  const newResponse = Object.assign({}, content,
    {
      createdAt: moment().format('x'),
      firstAttemptCount: isFirstAttempt ? 1 : 0
    }
  );
  return (dispatch) => {
    // dispatch({ type: C.AWAIT_NEW_QUESTION_RESPONSE, });
    const newRef = responsesRef.push(newResponse, (error) => {
      // dispatch({ type: C.RECEIVE_NEW_QUESTION_RESPONSE, });
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else {
        dispatch(pathwaysActions.submitNewPathway(newRef.key, prid, newResponse.questionUID));
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      }
    });
  };
}

export function deleteResponse(qid, rid) {
  return (dispatch) => {
    responsesRef.child(rid).remove((error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
      } else {
        responsesForQuestionRef(qid).on('value', (data) => {
          const childResponseKeys = _.keys(data.val().responses).filter(
            key => data.val().responses[key].parentID === rid
          );
          childResponseKeys.forEach((childKey) => {
            dispatch(module.exports.deleteResponse(qid, childKey));
          });
        });
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Response successfully deleted!', });
      }
    });
  };
}

export function setUpdatedResponse(rid, content) {
  return (dispatch) => {
    responsesRef.child(rid).set(content, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      }
    });
  };
}

export function submitResponseEdit(rid, content) {
  return (dispatch) => {
    responsesRef.child(rid).update(content, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      }
    });
  };
}

export function incrementFirstAttemptCount(rid) {
  return (dispatch) => {
    responsesRef.child(`${rid}/firstAttemptCount`).transaction(currentCount => currentCount + 1, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `increment failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'first attempt count successfully incremented!', });
      }
    })
  }
}

export function incrementResponseCount(qid, rid, prid, isFirstAttempt) {
  return (dispatch) => {
    const responseRef = responsesRef.child(rid);
    responseRef.child('/count').transaction(currentCount => currentCount + 1, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `increment failed! ${error}`, });
      } else {
        dispatch(pathwaysActions.submitNewPathway(rid, prid, qid));
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Response successfully incremented!', });
        if (isFirstAttempt) {
          dispatch(incrementFirstAttemptCount(rid))
        }
      }
    });
    responseRef.child('parentID').once('value', (snap) => {
      if (snap.val()) {
        dispatch(incrementChildResponseCount(snap.val()));
      }
    });
  };
}

export function incrementChildResponseCount(rid) {
  return (dispatch) => {
    responsesRef.child(`${rid}/childCount`).transaction(currentCount => currentCount + 1, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `increment failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Child Response successfully incremented!', });
      }
    });
  };
}

export function removeLinkToParentID(rid) {
  return (dispatch) => {
    responsesRef.child(`${rid}/parentID`).remove((error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `Deletion failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Response successfully deleted!', });
      }
    });
  };
}

export function submitNewConceptResult(qid, rid, data) {
  return () => {
    responsesRef.child(`${rid}/conceptResults`).push(data, (error) => {
      if (error) {
        alert(`Submission failed! ${error}`);
      }
    });
  };
}

export function deleteConceptResult(qid, rid, crid) {
  return () => {
    responsesRef.child(`${rid}/conceptResults/${crid}`).remove((error) => {
      if (error) {
        alert(`Delete failed! ${error}`);
      }
    });
  };
}

function makeIterator(array) {
  let nextIndex = 0;

  return {
    next() {
      return nextIndex < array.length ?
               { value: array[nextIndex++], done: false, } :
               { done: true, };
    },
  };
}

export function getResponsesWithCallback(questionID, callback) {
  responsesForQuestionRef(questionID).once('value', (snapshot) => {
    callback(snapshot.val());
    console.log('Loaded responses for ', questionID);
  });
}

export function listenToResponsesWithCallback(questionID, callback) {
  responsesForQuestionRef(questionID).on('value', (snapshot) => {
    callback(snapshot.val());
    console.log('Listened to responses for ', questionID);
  });
}

function gradedResponsesForQuestionRef(questionId) {
  return responsesRef.orderByChild('gradeIndex').equalTo(`human${questionId}`);
}

export function getGradedResponsesWithCallback(questionID, callback) {
  const cmsUrl = 'http://localhost:3100/';
  request(`${cmsUrl}/questions/${questionID}/responses`, (error, response, body) => {
    if (error) {
      console.log('error:', error); // Print the error if one occurred
    }
    const bodyToObj = {};
    JSON.parse(body).forEach((resp) => {
      bodyToObj[resp.key] = resp;
    });
    callback(bodyToObj);
  });
}

export function findResponseByText(text, questionUID, cb) {
  responsesRef.orderByChild('text').equalTo(text).once('value', (snapshot) => {
    const response = _.findWhere(hashToCollection(snapshot.val()), { questionUID, });
    cb(response);
  });
}
