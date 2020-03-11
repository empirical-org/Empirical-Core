const C = require('../constants').default;

import { requestDelete, requestGet, requestPost, requestPut } from '../utils/request';
import { ApiConstants } from '../utils/api';

const moment = require('moment');

import request from 'request';
import _ from 'lodash';
import { push } from 'react-router-redux';
import pathwaysActions from './pathways';
import { submitResponse } from './responses';
import {
  FocusPointApi,
  IncorrectSequenceApi,
  QuestionApi,
  FRAGMENTS_QUESTION_TYPE
} from './questions'

function loadSentenceFragments() {
  return (dispatch, getState) => {
    QuestionApi.getAll(FRAGMENTS_QUESTION_TYPE).then((questions) => {
      dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: questions, });
    });
  };
}

function loadSpecifiedSentenceFragments(uids) {
  return (dispatch, getState) => {
    const requestPromises: Promise<any>[] = [];
    uids.forEach((uid) => {
      requestPromises.push(QuestionApi.get(uid));
    });
    const allPromises = Promise.all(requestPromises);
    const questionData = {};
    allPromises.then((results) => {
      results.forEach((result, index) => {
        questionData[uids[index]] = result;
      });
      dispatch({ type: C.RECEIVE_SENTENCE_FRAGMENTS_DATA, data: questionData, });
    });
  }
}

function startSentenceFragmentEdit(sfid) {
  return { type: C.START_SENTENCE_FRAGMENT_EDIT, sfid, };
}

function cancelSentenceFragmentEdit(sfid) {
  return { type: C.FINISH_SENTENCE_FRAGMENT_EDIT, sfid, };
}

function submitSentenceFragmentEdit(qid, content) {
  alert("submitted")
  return (dispatch, getState) => {
    dispatch({ type: C.SUBMIT_SENTENCE_FRAGMENT_EDIT, qid, });
    QuestionApi.update(qid, content).then( () => {
      dispatch({ type: C.FINISH_SENTENCE_FRAGMENT_EDIT, qid, });
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
    }, (error) => {
      dispatch({ type: C.FINISH_SENTENCE_FRAGMENT_EDIT, qid, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    });
  };
}

function submitNewIncorrectSequence(qid, data) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.create(qid, data).then(() => {},
    (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

export default {
  loadSentenceFragments,
  loadSpecifiedSentenceFragments,
  startSentenceFragmentEdit,
  cancelSentenceFragmentEdit,
  submitSentenceFragmentEdit,
  submitNewIncorrectSequence
}





