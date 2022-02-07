/* eslint-env browser*/
import _ from 'underscore';
import * as request from 'request';
import objectWithSnakeKeysFromCamel from '../libs/objectWithSnakeKeysFromCamel';
import { Response, ConceptResult } from 'quill-marking-logic'

import { ActionTypes } from './actionTypes'
import * as moment from 'moment'

export function deleteStatus(questionId: string) {
  return { type: ActionTypes.DELETE_RESPONSE_STATUS, data: { questionId, }, };
}

export function updateStatus(questionId: string, status: string) {
  return { type: ActionTypes.UPDATE_RESPONSE_STATUS, data: { questionId, status, }, };
}

export function updateData(questionId: string, responses: Response[]) {
  return { type: ActionTypes.UPDATE_RESPONSE_DATA, data: { questionId, responses, }, };
}


function getQuestionLoadedStatusForGroupedResponses(groupedResponses) {
  const questionsKeys = _.keys(groupedResponses);
  const statuses = {};
  questionsKeys.forEach((key: string) => {
    statuses[key] = 'LOADED';
  });
  return statuses;
}

export function submitResponse(content: Response, prid: string, isFirstAttempt: boolean) {
  delete content.gradeIndex;
  const rubyConvertedResponse: Response & { created_at: string, first_attempt_count: number, is_first_attempt: boolean} = objectWithSnakeKeysFromCamel(content);
  rubyConvertedResponse.created_at = moment().format('x');
  rubyConvertedResponse.first_attempt_count = isFirstAttempt ? 1 : 0;
  rubyConvertedResponse.is_first_attempt = isFirstAttempt;
  return (dispatch: Function) => {
    request.post({
      url: `${process.env.QUILL_CMS}/responses/create_or_increment`,
      form: { response: rubyConvertedResponse, }, },
    (error, httpStatus, body) => {
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      } else {
        // to do - do something with this body
      }
    },
    );
  };
}

export function submitMassEditFeedback(ids: string[], properties, qid: string) {
  return (dispatch: Function) => {
    const updatedAttribute = properties;
    request.put({
      url: `${process.env.QUILL_CMS}/responses/mass_edit/edit_many`,
      json: { ids, updated_attribute: updatedAttribute, }, },
    (error, httpStatus, body) => {
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
      } else {
        // to do - do something with this error
      }
    });
  };
}

export function submitMassEditConceptResults(ids: string[], conceptResults: ConceptResult[], qid: string) {
  return (dispatch: Function) => {
    const updatedAttribute = {
      concept_results: conceptResults,
    };
    request.put({
      url: `${process.env.QUILL_CMS}/responses/mass_edit/edit_many`,
      json: { ids, updated_attribute: updatedAttribute, }, },
    (error, httpStatus, body) => {
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
      } else {
        // to do - do something with this error
      }
    });
  };
}

export function massEditDeleteResponses(ids: string[], qid: string) {
  return (dispatch: Function) => {
    request.post({
      url: `${process.env.QUILL_CMS}/responses/mass_edit/delete_many`,
      json: { ids, }, },
    (error, httpStatus, body) => {
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
      } else {
        // to do - do something with this error
      }
    });
  };
}

export function submitResponseEdit(rid: string, content: Response & { concept_results: any }, qid: string) {
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content);
  return (dispatch: Function) => {
    request.put({
      url: `${process.env.QUILL_CMS}/responses/${rid}`,
      form: { response: rubyConvertedResponse, }, },
    (error, httpStatus, body) => {
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
      } else {
        // to do - do something with this error
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
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
        dispatch({ type: ActionTypes.START_RESPONSE_EDIT, qid, rid, });
      } else {
        // to do - do something with this error
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
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
        dispatch({ type: ActionTypes.START_RESPONSE_EDIT, qid, rid, });
      } else {
        // to do - do something with this error
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
          dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
        } else if (httpStatus.statusCode === 204 || httpStatus.statusCode === 200) {
          dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
          dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
        } else {
          // to do - do something with this body
        }
      },
    );
  };
}

function makeIterator(array) {
  let nextIndex = 0;

  return {
    next() {
      return nextIndex < array.length ?
        { value: array[nextIndex+=1], done: false, } :
        { done: true, };
    },
  };
}

export function getGradedResponsesWithCallback(questionID, callback) {
  request(`${process.env.QUILL_CMS}/questions/${questionID}/responses`, (error, response, body) => {
    if (error) {
      // to do - do something with this error
    }
    const bodyToObj = {};
    JSON.parse(body).forEach((resp) => {
      bodyToObj[resp.id] = resp;
      if (typeof resp.concept_results === 'string') {
        resp.concept_results = JSON.parse(resp.concept_results);
      }
      for (const cr in resp.concept_results) {
        if (resp.concept_results.hasOwnProperty(cr)) {
          const formattedCr = {};
          formattedCr.conceptUID = cr;
          formattedCr.correct = resp.concept_results[cr];
          resp.concept_results[cr] = formattedCr;
        }
      }
      resp.conceptResults = resp.concept_results;
      delete resp.concept_results;
    });
    callback(bodyToObj);
  });
}

export function getGradedResponsesWithoutCallback(questionID) {
  request(`${process.env.QUILL_CMS}/questions/${questionID}/responses`, (error, response, body) => {
    if (error) {
      // to do - do something with this error
    }
    const bodyToObj = {};
    JSON.parse(body).forEach((resp) => {
      bodyToObj[resp.id] = resp;
      if (typeof resp.concept_results === 'string') {
        resp.concept_results = JSON.parse(resp.concept_results);
      }
      for (const cr in resp.concept_results) {
        if (resp.concept_results.hasOwnProperty(cr)) {

          const formattedCr = {};
          formattedCr.conceptUID = cr;
          formattedCr.correct = resp.concept_results[cr];
          resp.concept_results[cr] = formattedCr;
        }
      }
      resp.conceptResults = resp.concept_results;
      delete resp.concept_results;
    });
    return bodyToObj;
  });
}
