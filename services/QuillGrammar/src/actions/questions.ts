import request from 'request'
import Pusher from 'pusher-js';

import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const questionsRef = rootRef.child('questions')
import { Questions } from '../interfaces/questions'
import * as responseActions from './responses'

export const startListeningToQuestions = () => {
  return dispatch => {
    questionsRef.on('value', (snapshot) => {
      const questions: Questions = snapshot.val()
      if (questions) {
        dispatch({ type: ActionTypes.RECEIVE_QUESTIONS_DATA, data: questions, });
      } else {
        dispatch({ type: ActionTypes.NO_QUESTIONS_FOUND })
      }
    });
  }
}

export const getGradedResponsesWithCallback = (questionID, callback) => {
  request(`${process.env.QUILL_CMS}/questions/${questionID}/responses`, (error, response, body) => {
    if (error) {
      console.log('error:', error); // Print the error if one occurred
    }
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
  });
}

export const updateFlag = (qid: string, flag: string) => {
  return dispatch => {
    questionsRef.child(`${qid}/flag/`).set(flag, (error) => {
      if (error) {
        alert(`Flag update failed! ${error}`);
      }
    });
  }
}

export const incrementRequestCount = () => {
  return { type: ActionTypes.INCREMENT_REQUEST_COUNT }
}

export const searchResponses = (qid) => {
  return (dispatch, getState) => {
    const requestNumber = getState().filters.requestCount
    // check for request number in state, save as const
    console.log('URL', `${process.env.QUILL_CMS}/questions/${qid}/responses/search`)
    request(
      {
        url: `${process.env.QUILL_CMS}/questions/${qid}/responses/search`,
        method: 'POST',
        json: { search: getFormattedSearchData(getState()), },
      },
      (err, httpResponse, data) => {
        console.log('data', data.results)
        // check again for number in state
        // if equal to const set earlier, update the state
        // otherwise, do nothing
        if (getState().filters.requestCount === requestNumber && data) {
          const embeddedOrder = _.map(data.results, (response, i) => {
            response.sortOrder = i;
            return response;
          });
          const parsedResponses = _.keyBy(embeddedOrder, 'id');
          const responseData = {
            responses: parsedResponses,
            numberOfResponses: data.numberOfResults,
            numberOfPages: data.numberOfPages,
          };
          dispatch(updateResponses(responseData));
        }
      }
    );
  };
}

export const getFormattedSearchData = (state) =>{
  const searchData = state.filters.formattedFilterData;
  searchData.text = state.filters.stringFilter;
  searchData.pageNumber = state.filters.responsePageNumber;
  return searchData;
}

export const updateResponses = (data) =>{
  return { type: ActionTypes.UPDATE_SEARCHED_RESPONSES, data, };
}

export const initializeSubscription = (qid) => {
  return (dispatch) => {
    if (process.env.NODE_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    if (!window.pusher) {
      console.log('pusher key', process.env.PUSHER_KEY)
      window.pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    }
    const channel = window.pusher.subscribe(`admin-${qid}`);
    channel.bind('new-response', (data) => {
      setTimeout(() => dispatch(searchResponses(qid)), 1000);
    });
  };
}

export const removeSubscription = (qid) => {
  return (dispatch) => {
    if (window.pusher) {
      window.pusher.unsubscribe(`admin-${qid}`);
    }
  };
}

export const startQuestionEdit = (qid) => {
  return { type: ActionTypes.START_QUESTION_EDIT, qid, };
}

export const cancelQuestionEdit = (qid) => {
  return { type: ActionTypes.FINISH_QUESTION_EDIT, qid, };
}

export const submitQuestionEdit = (qid, content) => {
  return (dispatch, getState) => {
    dispatch({ type: ActionTypes.SUBMIT_QUESTION_EDIT, qid, });
    content.answers.forEach(a => dispatch(saveOptimalResponse(qid, content.concept_uid, a)))
    questionsRef.child(qid).update(content, (error) => {
      dispatch({ type: ActionTypes.FINISH_QUESTION_EDIT, qid, });
      if (error) {
        dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Update failed! ${error}`, });
      } else {
        dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
      }
    });
  };
}

export const saveOptimalResponse = (qid, conceptUid, answer) => {
  return (dispatch) => {
    if (answer.text) {
      const formattedResponse = {
        optimal: true,
        count: 1,
        text: answer.text.replace(/{|}/gm, ''),
        question_uid: qid,
        feedback: "<b>Well done!</b> That's the correct answer.",
        concept_results: [{
          conceptUID: conceptUid,
          correct: true
        }]
      }
      dispatch(responseActions.submitResponse(formattedResponse, null, false))
    }
  }
}

export const updateStringFilter = (stringFilter, qid) => {
  return (dispatch) => {
    dispatch(setStringFilter(stringFilter));
    dispatch(searchResponses(qid));
  };
}

export const setStringFilter = (stringFilter) => {
  return { type: ActionTypes.SET_RESPONSE_STRING_FILTER, stringFilter, };
}
