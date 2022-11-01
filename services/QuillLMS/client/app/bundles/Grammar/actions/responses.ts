/* eslint-env browser*/
import _ from 'underscore';
import * as moment from 'moment'
import { Response, ConceptResult } from 'quill-marking-logic'

import { ActionTypes } from './actionTypes'

import objectWithSnakeKeysFromCamel from '../libs/objectWithSnakeKeysFromCamel';
import { requestGet, requestPut, requestPost, requestDelete, } from '../../../modules/request/index'

export function deleteStatus(questionId: string) {
  return { type: ActionTypes.DELETE_RESPONSE_STATUS, data: { questionId, }, };
}

export function updateStatus(questionId: string, status: string) {
  return { type: ActionTypes.UPDATE_RESPONSE_STATUS, data: { questionId, status, }, };
}

export function updateData(questionId: string, responses: Response[]) {
  return { type: ActionTypes.UPDATE_RESPONSE_DATA, data: { questionId, responses, }, };
}


export function submitResponse(content: Response, prid: string, isFirstAttempt: boolean) {
  delete content.gradeIndex;
  const rubyConvertedResponse: Response & { created_at: string, first_attempt_count: number, is_first_attempt: boolean} = objectWithSnakeKeysFromCamel(content);
  rubyConvertedResponse.created_at = moment().format('x');
  rubyConvertedResponse.first_attempt_count = isFirstAttempt ? 1 : 0;
  rubyConvertedResponse.is_first_attempt = isFirstAttempt;
  return (dispatch: Function) => {
    requestPost(
      `${process.env.QUILL_CMS}/responses/create_or_increment`,
      { response: rubyConvertedResponse, },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
      },
    );
  };
}

export function submitMassEditFeedback(ids: string[], properties, qid: string) {
  return (dispatch: Function) => {
    const updatedAttribute = properties;
    requestPut(
      `${process.env.QUILL_CMS}/responses/mass_edit/edit_many`,
      { ids, updated_attribute: updatedAttribute, },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
      },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
      },
    );
  };
}

export function submitMassEditConceptResults(ids: string[], conceptResults: ConceptResult[], qid: string) {
  return (dispatch: Function) => {
    const updatedAttribute = {
      concept_results: conceptResults,
    };
    requestPut(
      `${process.env.QUILL_CMS}/responses/mass_edit/edit_many`,
      { ids, updated_attribute: updatedAttribute, },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
      },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
      },
    );
  };
}

export function massEditDeleteResponses(ids: string[], qid: string) {
  return (dispatch: Function) => {
    requestPost(
      `${process.env.QUILL_CMS}/responses/mass_edit/delete_many`,
      { ids, },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
      },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
      },
    );
  };
}

export function submitResponseEdit(rid: string, content: Response & { concept_results: any }, qid: string) {
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content);
  return (dispatch: Function) => {
    requestPut(
      `${process.env.QUILL_CMS}/responses/${rid}`,
      { response: rubyConvertedResponse, },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
      },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
      },
    );
  };
}

export function updateConceptResults(rid, content, qid) {
  const rubyConvertedResponse = objectWithSnakeKeysFromCamel(content, false);
  return (dispatch) => {
    requestPut(
      `${process.env.QUILL_CMS}/responses/${rid}`,
      { response: rubyConvertedResponse, },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
        dispatch({ type: ActionTypes.START_RESPONSE_EDIT, qid, rid, });
      },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
      },
    );

  };
}

export function deleteConceptResult(rid, content, qid) {
  const updatedResponse = objectWithSnakeKeysFromCamel(content, false);
  return (dispatch) => {
    requestPut(
      `${process.env.QUILL_CMS}/responses/${rid}`,
      { response: updatedResponse, },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
        dispatch({ type: ActionTypes.START_RESPONSE_EDIT, qid, rid, });
      },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
      },
    );
  };
}

export function deleteResponse(qid, rid) {
  return (dispatch) => {
    requestDelete(
      `${process.env.QUILL_CMS}/responses/${rid}`,
      null,
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
        dispatch({ type: ActionTypes.SHOULD_RELOAD_RESPONSES, qid, });
      },
      (body) => {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${body}`, });
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
  requestGet(`${process.env.QUILL_CMS}/questions/${questionID}/responses`,
    (body) => {
      const bodyToObj = {};
      body.forEach((resp) => {
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
  )
}

export function getGradedResponsesWithoutCallback(questionID) {
  requestGet(
    `${process.env.QUILL_CMS}/questions/${questionID}/responses`,
    (body) => {
      const bodyToObj = {};
      body.forEach((resp) => {
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
  );
}
