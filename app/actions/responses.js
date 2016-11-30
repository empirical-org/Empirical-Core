/* eslint-env browser*/
import _ from 'underscore';
import pathwaysActions from './pathways';
import rootRef from '../libs/firebase';

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

export function loadResponseData(questionId) {
  return (dispatch) => {
    dispatch(updateStatus(questionId, 'LOADING'));
    responsesForQuestionRef(questionId).once('value', (snapshot) => {
      dispatch(updateData(questionId, snapshot.val()));
      dispatch(updateStatus(questionId, 'LOADED'));
    });
  };
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

export function submitNewResponse(content, prid) {
  const newResponse = Object.assign({}, content,
    {
      createdAt: moment().format('x'),
    }
  );
  return (dispatch) => {
    dispatch({ type: C.AWAIT_NEW_QUESTION_RESPONSE, });
    const newRef = responsesRef.push(newResponse, (error) => {
      dispatch({ type: C.RECEIVE_NEW_QUESTION_RESPONSE, });
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

export function incrementResponseCount(qid, rid, prid) {
  return (dispatch) => {
    console.log('Incrementing: ', qid, rid, prid);
    const responseRef = responsesRef.child(rid);
    responseRef.child('/count').transaction(currentCount => currentCount + 1, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `increment failed! ${error}`, });
      } else {
        dispatch(pathwaysActions.submitNewPathway(rid, prid, qid));
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Response successfully incremented!', });
      }
    });
    responseRef.child('parentID').once('value', (snap) => {
      if (snap.val()) {
        dispatch(this.incrementChildResponseCount(snap.val()));
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
