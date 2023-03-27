const C = require('../constants').default;
const moment = require('moment');

import Pusher from 'pusher-js';
// Put 'pusher' on global window for TypeScript validation
declare global {
  interface Window { pusher: any }
}

import { push } from 'react-router-redux';
import _ from 'underscore';
import { requestPost } from '../../../modules/request/index';
import {
  FocusPointApi,
  IncorrectSequenceApi, QuestionApi, SENTENCE_COMBINING_TYPE
} from '../libs/questions_api';
import { submitResponse } from './responses';
import sessionActions from './sessions';

function loadQuestions() {
  return (dispatch, getState) => {
    QuestionApi.getAll(SENTENCE_COMBINING_TYPE).then((questions) => {
      dispatch({ type: C.RECEIVE_QUESTIONS_DATA, data: questions, });
    });
  };
}

// called when the app starts. this means we immediately download all questions, and
// then receive all questions again as soon as anyone changes anything.
function startListeningToQuestions() {
  return loadQuestions();
}

function loadQuestion(uid) {
  return (dispatch, getState) => {
    QuestionApi.get(uid).then((question) => {
      dispatch({ type: C.RECEIVE_QUESTION_DATA, uid: uid, data: question, });
    });
  }
}

function loadSpecifiedQuestions(uids) {
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
      sessionActions.populateQuestions("SC", questionData, true)
      dispatch({ type: C.RECEIVE_QUESTIONS_DATA, data: questionData, });
    }).catch((error) => {
      throw error;
    });
  }
}

function startQuestionEdit(qid) {
  return { type: C.START_QUESTION_EDIT, qid, };
}

function cancelQuestionEdit(qid) {
  return { type: C.FINISH_QUESTION_EDIT, qid, };
}

function submitQuestionEdit(qid, content) {
  return (dispatch, getState) => {
    dispatch({ type: C.SUBMIT_QUESTION_EDIT, qid, });
    QuestionApi.update(qid, content).then( () => {
      dispatch({ type: C.FINISH_QUESTION_EDIT, qid, });
      dispatch(loadQuestion(qid));
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
    }).catch((error) => {
      dispatch({ type: C.FINISH_QUESTION_EDIT, qid, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    });
  };
}

function toggleNewQuestionModal() {
  return { type: C.TOGGLE_NEW_QUESTION_MODAL, };
}

function submitNewQuestion(content, response) {
  return (dispatch, getState) => {
    dispatch({ type: C.AWAIT_NEW_QUESTION_RESPONSE, });
    QuestionApi.create(SENTENCE_COMBINING_TYPE, content).then((question) => {
      dispatch({ type: C.RECEIVE_NEW_QUESTION_RESPONSE, });
      response.questionUID = Object.keys(question)[0];
      response.gradeIndex = `human${response.questionUID}`;
      dispatch(submitResponse(response));
      dispatch(loadQuestion(response.questionUID));
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      const action = push(`/admin/questions/${response.questionUID}`);
      dispatch(action);
    }, (error) => {
      dispatch({ type: C.RECEIVE_NEW_QUESTION_RESPONSE, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
    });
  };
}

function submitNewFocusPoint(qid, data) {
  return (dispatch, getState) => {
    FocusPointApi.create(qid, data).then(() => {
      dispatch(loadQuestion(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  }
}

function submitEditedFocusPoint(qid, data, fpid) {
  return (dispatch, getState) => {
    FocusPointApi.update(qid, fpid, data).then(() => {
      dispatch(loadQuestion(qid));
    }).catch((error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function submitBatchEditedFocusPoint(qid, data) {
  return (dispatch, getState) => {
    FocusPointApi.updateAllForQuestion(qid, data).then(() => {
      dispatch(loadQuestion(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function deleteFocusPoint(qid, fpid) {
  return (dispatch, getState) => {
    FocusPointApi.remove(qid, fpid).then(() => {
      dispatch(loadQuestion(qid));
    }, (error) => {
      alert(`Delete failed! ${error}`);
    });
  };
}

function updateFlag(qid, flag) {
  return dispatch => {
    QuestionApi.updateFlag(qid, flag).then(() => {
      dispatch(loadQuestion(qid));
    }).catch((error) => {
      alert(`Flag update failed! ${error}`);
    });
  }
}

function updateModelConceptUID(qid, modelConceptUID) {
  return dispatch => {
    QuestionApi.get(qid).then((question) => {
      if (!question.modelConceptUID) {
        QuestionApi.updateModelConcept(qid, modelConceptUID).then(() => {
          dispatch(loadQuestion(qid));
        }).catch((error) => {
          alert(`Model concept update failed! ${error}`);
        });
      }
    });
  }
}

function submitNewIncorrectSequence(qid, data) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.create(qid, data).then(() => {
      dispatch(loadQuestion(qid));
    }, (error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function submitEditedIncorrectSequence(qid, data, seqid) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.update(qid, seqid, data).then(() => {
      dispatch(loadQuestion(qid));
    }).catch((error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

function deleteIncorrectSequence(qid, seqid) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.remove(qid, seqid).then(() => {
      dispatch(loadQuestion(qid));
    }, (error) => {
      alert(`Delete failed! ${error}`);
    });
  };
}

function updateIncorrectSequences(qid, data) {
  return (dispatch, getState) => {
    IncorrectSequenceApi.updateAllForQuestion(qid, data).then(() => {
      dispatch(loadQuestion(qid));
    }).catch((error) => {
      alert(`Order update failed! ${error}`);
    });
  }
}

function getFormattedSearchData(state) {
  const searchData = state.filters.formattedFilterData;
  searchData.text = state.filters.stringFilter;
  searchData.pageNumber = state.filters.responsePageNumber;
  return searchData;
}

function searchResponses(qid) {
  return (dispatch, getState) => {
    const requestNumber = getState().filters.requestCount
    // check for request number in state, save as const
    requestPost(
      `${process.env.QUILL_CMS}/questions/${qid}/responses/search`,
      { search: getFormattedSearchData(getState()), },
      (body) => {
        // check again for number in state
        // if equal to const set earlier, update the state
        // otherwise, do nothing
        if (getState().filters.requestCount === requestNumber && body) {
          const embeddedOrder = _.map(body.results, (response, i) => {
            response.sortOrder = i;
            return response;
          });
          const parsedResponses = _.indexBy(embeddedOrder, 'id');
          const responseData = {
            responses: parsedResponses,
            numberOfResponses: body.numberOfResults,
            numberOfPages: body.numberOfPages,
          };
          dispatch(updateResponses(responseData));
        }
      }
    );
  };
}

function initializeSubscription(qid) {
  return (dispatch) => {
    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    if (!window.pusher) {
      window.pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    }
    const channel = window.pusher.subscribe(`admin-${qid}`);
    channel.bind('new-response', (data) => {
      setTimeout(() => dispatch(searchResponses(qid)), 1000);
    });
  };
}

function removeSubscription(qid) {
  return (dispatch) => {
    if (window.pusher) {
      window.pusher.unsubscribe(`admin-${qid}`);
    }
  };
}

function updatePageNumber(pageNumber, qid) {
  return (dispatch) => {
    dispatch(setPageNumber(pageNumber));
    dispatch(searchResponses(qid));
  };
}

function updateStringFilter(stringFilter, qid) {
  return (dispatch) => {
    dispatch(setStringFilter(stringFilter));
    stringFilter === '' && dispatch(searchResponses(qid));
  };
}

function getUsedSequences(qid) {
  return (dispatch, getState) => {
    const existingIncorrectSeqs = getState().questions.data[qid].incorrectSequences
    const usedSeqs: string[] = []
    if (existingIncorrectSeqs) {
      Object.values(existingIncorrectSeqs).forEach((inSeq: any) => {
        const phrases = inSeq.text.split('|||')
        phrases.forEach((p) => {
          usedSeqs.push(p)
        })
      })
    }
    dispatch(setUsedSequences(qid, usedSeqs));
  }
}

function setUsedSequences(qid, seq) {
  return {type: C.SET_USED_SEQUENCES, qid, seq}
}

function startResponseEdit(qid, rid) {
  return { type: C.START_RESPONSE_EDIT, qid, rid, };
}

function cancelResponseEdit(qid, rid) {
  return { type: C.FINISH_RESPONSE_EDIT, qid, rid, };
}

function startChildResponseView(qid, rid) {
  return { type: C.START_CHILD_RESPONSE_VIEW, qid, rid, };
}

function cancelChildResponseView(qid, rid) {
  return { type: C.CANCEL_CHILD_RESPONSE_VIEW, qid, rid, };
}

function startFromResponseView(qid, rid) {
  return { type: C.START_FROM_RESPONSE_VIEW, qid, rid, };
}

function cancelFromResponseView(qid, rid) {
  return { type: C.CANCEL_FROM_RESPONSE_VIEW, qid, rid, };
}

function startToResponseView(qid, rid) {
  return { type: C.START_TO_RESPONSE_VIEW, qid, rid, };
}

function cancelToResponseView(qid, rid) {
  return { type: C.CANCEL_TO_RESPONSE_VIEW, qid, rid, };
}

function clearQuestionState(qid) {
  return { type: C.CLEAR_QUESTION_STATE, qid, };
}

function updateResponses(data) {
  return { type: C.UPDATE_SEARCHED_RESPONSES, data, };
}

function setPageNumber(pageNumber) {
  return { type: C.SET_RESPONSE_PAGE_NUMBER, pageNumber, };
}

function setStringFilter(stringFilter) {
  return { type: C.SET_RESPONSE_STRING_FILTER, stringFilter, };
}

function incrementRequestCount() {
  return { type: C.INCREMENT_REQUEST_COUNT }
}

export default {
  startListeningToQuestions,
  loadQuestions,
  loadQuestion,
  loadSpecifiedQuestions,
  startQuestionEdit,
  cancelQuestionEdit,
  submitQuestionEdit,
  toggleNewQuestionModal,
  submitNewQuestion,
  submitNewFocusPoint,
  submitEditedFocusPoint,
  submitBatchEditedFocusPoint,
  deleteFocusPoint,
  submitNewIncorrectSequence,
  submitEditedIncorrectSequence,
  deleteIncorrectSequence,
  updateIncorrectSequences,
  searchResponses,
  initializeSubscription,
  removeSubscription,
  updatePageNumber,
  updateStringFilter,
  startResponseEdit,
  cancelResponseEdit,
  startChildResponseView,
  cancelChildResponseView,
  startFromResponseView,
  cancelFromResponseView,
  startToResponseView,
  cancelToResponseView,
  clearQuestionState,
  updateResponses,
  setPageNumber,
  setStringFilter,
  incrementRequestCount,
  updateFlag,
  getUsedSequences,
  updateModelConceptUID
};
