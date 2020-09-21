/* eslint-env browser*/
import _ from 'underscore';
import pathwaysActions from './pathways';
import rootRef from '../libs/firebase';
import request from 'request';
import objectWithSnakeKeysFromCamel from '../libs/objectWithSnakeKeysFromCamel';

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

export function submitResponse(content, prid, isFirstAttempt) {
  delete content.gradeIndex;
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content);
  rubyConvertedResponse.created_at = moment().format('x');
  rubyConvertedResponse.first_attempt_count = isFirstAttempt ? 1 : 0;
  rubyConvertedResponse.is_first_attempt = isFirstAttempt;
  return (dispatch) => {
    request.post({
      url: `${process.env.QUILL_CMS}/responses/create_or_increment`,
      form: { response: rubyConvertedResponse, }, },
      (error, httpStatus, body) => {
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        }
      },
    );
  };
}

export function submitMassEditFeedback(ids, properties, qid) {
  return (dispatch) => {
    const updated_attribute = properties;
    request.put({
      url: `${process.env.QUILL_CMS}/responses/mass_edit/edit_many`,
      json: { ids, updated_attribute, }, },
      (error, httpStatus, body) => {
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          dispatch({ type: C.SHOULD_RELOAD_RESPONSES, qid, });
        }
      });
  };
}

export function submitMassEditConceptResults(ids, conceptResults, qid) {
  return (dispatch) => {
    const updated_attribute = {
      concept_results: conceptResults,
    };
    request.put({
      url: `${process.env.QUILL_CMS}/responses/mass_edit/edit_many`,
      json: { ids, updated_attribute, }, },
      (error, httpStatus, body) => {
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          dispatch({ type: C.SHOULD_RELOAD_RESPONSES, qid, });
        }
      });
  };
}

export function massEditDeleteResponses(ids, qid) {
  return (dispatch) => {
    request.post({
      url: `${process.env.QUILL_CMS}/responses/mass_edit/delete_many`,
      json: { ids, }, },
      (error, httpStatus, body) => {
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          dispatch({ type: C.SHOULD_RELOAD_RESPONSES, qid, });
        }
      });
  };
}

export function submitResponseEdit(rid, content, qid) {
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content, false);
  return (dispatch) => {
    request.put({
      url: `${process.env.QUILL_CMS}/responses/${rid}`,
      form: { response: rubyConvertedResponse, }, },
      (error, httpStatus, body) => {
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          dispatch({ type: C.SHOULD_RELOAD_RESPONSES, qid, });
        }
      });
  };
}

export function updateConceptResults(rid, content, qid) {
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content, false);
  return (dispatch) => {
    request.put({
      url: `${process.env.QUILL_CMS}/responses/${rid}`,
      json: { response: rubyConvertedResponse, }, },
      (error, httpStatus, body) => {
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          dispatch({ type: C.SHOULD_RELOAD_RESPONSES, qid, });
          dispatch({ type: C.START_RESPONSE_EDIT, qid, rid, });
        }
      });
  };
}

export function deleteConceptResult(rid, content, qid) {
  const updatedResponse = objectWithSnakeKeysFromCamel(content, false);
  return (dispatch) => {
    request.put({
      url: `${process.env.QUILL_CMS}/responses/${rid}`,
      form: { response: updatedResponse, }, },
      (error, httpStatus, body) => {
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          dispatch({ type: C.SHOULD_RELOAD_RESPONSES, qid, });
          dispatch({ type: C.START_RESPONSE_EDIT, qid, rid, });
        }
      });
  };
}

export function deleteResponse(qid, rid) {
  return (dispatch) => {
    request.delete(
      `${process.env.QUILL_CMS}/responses/${rid}`,
      (error, httpStatus, body) => {
        if (error) {
          dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
          dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          dispatch({ type: C.SHOULD_RELOAD_RESPONSES, qid, });
        }
      },
    );
  };
}

export function setUpdatedResponse(rid, content) {
  alert('This is being called');
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

export function incrementFirstAttemptCount(rid) {
  alert('This is being called');
  return (dispatch) => {
    responsesRef.child(`${rid}/firstAttemptCount`).transaction(currentCount => currentCount + 1, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `increment failed! ${error}`, });
      } else {
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'first attempt count successfully incremented!', });
      }
    });
  };
}

export function incrementResponseCount(qid, rid, prid, isFirstAttempt) {
  alert('This is being called');
  return (dispatch) => {
    const responseRef = responsesRef.child(rid);
    responseRef.child('/count').transaction(currentCount => currentCount + 1, (error) => {
      if (error) {
        dispatch({ type: C.DISPLAY_ERROR, error: `increment failed! ${error}`, });
      } else {
        dispatch(pathwaysActions.submitNewPathway(rid, prid, qid));
        dispatch({ type: C.DISPLAY_MESSAGE, message: 'Response successfully incremented!', });
        if (isFirstAttempt) {
          dispatch(incrementFirstAttemptCount(rid));
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
  alert('This is being called');
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
  alert('This is being called');
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

function makeIterator(array) {
    let nextIndex = 0;

    return {
       next: function() {
           let nextVal = null;
           if (nextIndex < array.length) {
               nextVal = {value: array[nextIndex], done: false};
               nextIndex += 1;
           }
           else {
               nextVal = {done: true};
           }
           return nextVal;
       }
    };
}

export function getResponsesWithCallback(questionID, callback) {
  responsesForQuestionRef(questionID).once('value', (snapshot) => {
    callback(snapshot.val());
  });
}

export function listenToResponsesWithCallback(questionID, callback) {
  responsesForQuestionRef(questionID).on('value', (snapshot) => {
    callback(snapshot.val());
  });
}

function gradedResponsesForQuestionRef(questionId) {
  return responsesRef.orderByChild('gradeIndex').equalTo(`human${questionId}`);
}

export function getGradedResponsesWithCallback(questionID, callback) {
  request(`${process.env.QUILL_CMS}/questions/${questionID}/responses`, (error, response, body) => {
    if (error) {
      // to do, use Sentry to capture error
    } else {
      const bodyToObj = {};
      JSON.parse(body).forEach((resp) => {
        bodyToObj[resp.id] = resp;
        if (typeof resp.concept_results === 'string') {
          resp.concept_results = JSON.parse(resp.concept_results);
        }
        for (const cr in resp.concept_results) {
          const formatted_cr = {};
          formatted_cr.conceptUID = cr;
          formatted_cr.correct = resp.concept_results[cr];
          resp.concept_results[cr] = formatted_cr;
        }
        resp.conceptResults = resp.concept_results;
        delete resp.concept_results;
      });
      callback(bodyToObj);
    }
  });
}

export function getGradedResponsesWithoutCallback(questionID) {
  request(`${process.env.QUILL_CMS}/questions/${questionID}/responses`, (error, response, body) => {
    if (error) {
      // to do, use Sentry to capture error
    } else {
      const bodyToObj = {};
      JSON.parse(body).forEach((resp) => {
        bodyToObj[resp.id] = resp;
        if (typeof resp.concept_results === 'string') {
          resp.concept_results = JSON.parse(resp.concept_results);
        }
        for (const cr in resp.concept_results) {
          const formatted_cr = {};
          formatted_cr.conceptUID = cr;
          formatted_cr.correct = resp.concept_results[cr];
          resp.concept_results[cr] = formatted_cr;
        }
        resp.conceptResults = resp.concept_results;
        delete resp.concept_results;
      });
      return bodyToObj;
    }
  });
}

export function convertConceptNamesToIds(responses, concepts) {
  const conceptData = concepts.data["0"];
  const convertedResponses = responses.map((response) => {
    const concepts = response.concepts.map((c) => {
      const concept = conceptData.find((cd) => { return cd.displayName === c })
      if (!concept) {
        alert(`The concept ${c} doesn't exist! Check your spelling.`)
        throw new Error("Concept not found.")
      }
      return { conceptUID: concept.uid, correct: true, }
    })
    return { "text": response.text, "concepts": concepts }
  })
  return convertedResponses
}

export function submitOptimalResponses(qid, conceptUID, responses, concepts) {
  const convertedResponses = convertConceptNamesToIds(responses, concepts)
  return (dispatch) => {
    convertedResponses.forEach((obj) => {
      const defaultConcept = [{ conceptUID, correct: true}]
      const response = {
        text: obj.text,
        feedback: "That's a strong sentence!",
        optimal: true,
        questionUID: qid,
        gradeIndex: `human${qid}`,
        count: 1,
        conceptResults: _.isEmpty(obj.concepts) ? defaultConcept : obj.concepts,
      }
      dispatch(submitResponse(response))
    })
  }
}
