import * as request from 'request'
import Pusher from 'pusher-js';
import { push } from 'react-router-redux';
import { ActionTypes } from './actionTypes'
import { Questions, Question, FocusPoint, IncorrectSequence } from '../interfaces/questions'
import * as responseActions from './responses'
import { Response, ConceptResult } from 'quill-marking-logic'
import { populateQuestions, setSessionReducerToSavedSession } from './session.ts'
import {
  FocusPointApi,
  IncorrectSequenceApi,
  QuestionApi,
  GRAMMAR_QUESTION_TYPE
} from '../libs/questions_api'

export const startListeningToQuestions = (sessionID) => {
  return (dispatch: Function) => {
    QuestionApi.getAll(GRAMMAR_QUESTION_TYPE).then((questions: Questions) => {
      if (questions) {
        if (sessionID) {
          populateQuestions(questions)
          dispatch(setSessionReducerToSavedSession(sessionID))
        }
        dispatch({ type: ActionTypes.RECEIVE_QUESTIONS_DATA, data: questions, });
      } else {
        dispatch({ type: ActionTypes.NO_QUESTIONS_FOUND })
      }
    });
  }
}

export const getQuestion = (questionID: string) => {
  return (dispatch: Function) => {
    QuestionApi.get(questionID).then((question: Question) => {
      dispatch({ type: ActionTypes.RECEIVE_SINGLE_QUESTION_DATA, uid: questionID, data: question })
    })
  }
}

export const getGradedResponsesWithCallback = (questionID: string, callback: Function) => {
  request(`${process.env.QUILL_CMS}/questions/${questionID}/responses`, (error, response, body) => {
    if (error) {
      // to do - do something with this error
    }
    const bodyToObj: {[key: string]: Response} = {};
    JSON.parse(body).forEach((resp: Response) => {
      bodyToObj[resp.id] = resp;
      if (typeof resp.concept_results === 'string') {
        resp.concept_results = JSON.parse(resp.concept_results);
      }
      if (resp.concept_results) {
        for (const cr in resp.concept_results) {
          if (resp.concept_results.hasOwnProperty(cr)) {
            const formattedCr: ConceptResult = { conceptUID: '', correct: false};
            formattedCr.conceptUID = cr;
            formattedCr.correct = resp.concept_results[cr];
            resp.concept_results[cr] = formattedCr;
          }
        }
        resp.conceptResults = resp.concept_results;
        delete resp.concept_results;
      }
    });
    callback(bodyToObj);
  });
}

export const updateFlag = (qid: string, flag: string) => {
  return (dispatch: Function) => {
    QuestionApi.updateFlag(qid, flag).then(() => {
      dispatch(getQuestion(qid))
    }).catch((error: string) => {
      alert(`Flag update failed! ${error}`);
    });
  }
}

export const incrementRequestCount = () => {
  return { type: ActionTypes.INCREMENT_REQUEST_COUNT }
}

export const searchResponses = (qid: string) => {
  return (dispatch: Function, getState: Function) => {
    const requestNumber = getState().filters.requestCount
    // check for request number in state, save as const
    request(
      {
        url: `${process.env.QUILL_CMS}/questions/${qid}/responses/search`,
        method: 'POST',
        json: { search: getFormattedSearchData(getState()), },
      },
      (err, httpResponse, data) => {
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

export const getFormattedSearchData = (state) => {
  const searchData = state.filters.formattedFilterData;
  searchData.text = state.filters.stringFilter;
  searchData.pageNumber = state.filters.responsePageNumber;
  return searchData;
}

export const updateResponses = (data: Response[]) => {
  return { type: ActionTypes.UPDATE_SEARCHED_RESPONSES, data, };
}

export const initializeSubscription = (qid: string) => {
  return (dispatch: Function) => {
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

export const removeSubscription = (qid: string) => {
  return (dispatch: Function) => {
    if (window.pusher) {
      window.pusher.unsubscribe(`admin-${qid}`);
    }
  };
}

export const submitNewQuestion = (content: Question) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.AWAIT_NEW_QUESTION_RESPONSE, });
    QuestionApi.create(GRAMMAR_QUESTION_TYPE, content).then((question) => {
      dispatch({ type: ActionTypes.RECEIVE_NEW_QUESTION_RESPONSE, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      const question_uid = Object.keys(question)[0]
      dispatch(getQuestion(question_uid))
      const action = push(`/admin/questions/${question.uid}`);
      dispatch(action);
    }).catch((error: string) => {
      dispatch({ type: ActionTypes.RECEIVE_NEW_QUESTION_RESPONSE, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
    });
    content.answers.forEach(a => dispatch(saveOptimalResponse(newRef.key, content.concept_uid, a)))
  };
}

export const startQuestionEdit = (qid: string) => {
  return { type: ActionTypes.START_QUESTION_EDIT, qid, };
}

export const cancelQuestionEdit = (qid: string) => {
  return { type: ActionTypes.FINISH_QUESTION_EDIT, qid, };
}

export const submitQuestionEdit = (qid: string, formContent: Question) => {
  return (dispatch: Function, getState: Function) => {
    const unmodifiedContent = getState().questions.data[qid]
    const updatedContent = Object.assign(unmodifiedContent, formContent)
    dispatch({ type: ActionTypes.SUBMIT_QUESTION_EDIT, qid, });
    updatedContent.answers.forEach(a => dispatch(saveOptimalResponse(qid, updatedContent.concept_uid, a)))
    QuestionApi.update(qid, updatedContent).then(() => {
      dispatch(getQuestion(qid))
      dispatch({ type: ActionTypes.FINISH_QUESTION_EDIT, qid, });
      dispatch({ type: ActionTypes.DISPLAY_MESSAGE, message: 'Update successfully saved!', });

    }).catch((error: string) => {
      dispatch({ type: ActionTypes.FINISH_QUESTION_EDIT, qid, });
      dispatch({ type: ActionTypes.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    });
  };
}

export const saveOptimalResponse = (qid: string, conceptUid: string, answer: {text: string}) => {
  return (dispatch: Function) => {
    if (answer.text) {
      const conceptResults = [{ conceptUID: conceptUid, correct: true }]
      const formattedResponse = {
        optimal: true,
        count: 1,
        text: answer.text.replace(/{|}/gm, ''),
        question_uid: qid,
        feedback: "<b>Well done!</b> That's the correct answer.",
        concept_results: conceptResults
      }
      dispatch(responseActions.submitResponse(formattedResponse, null, false))
    }
  }
}

export const submitNewIncorrectSequence = (qid: string, data: IncorrectSequence, callback?: Function) => {
  return (dispatch: Function) => {
    IncorrectSequenceApi.create(qid, data).then(() => {
      dispatch(getQuestion(qid))
      callback ? callback() : null
    }).catch((error: string) => {
      alert(`Submission failed! ${error}`);
    })
  };
}

export const submitEditedIncorrectSequence = (qid: string, data: IncorrectSequence, seqid: string) => {
  return (dispatch: Function) => {
    IncorrectSequenceApi.update(qid, seqid, data).then(() => {
      dispatch(getQuestion(qid))
    }).catch((error: string) => {
      alert(`Submission failed! ${error}`);
    })
  };
}

export const deleteIncorrectSequence = (qid: string, seqid: string) => {
  return (dispatch: Function) => {
    IncorrectSequenceApi.remove(qid, seqid).then(() => {
      dispatch(getQuestion(qid));
    }).catch((error) => {
      alert(`Delete failed! ${error}`);
    });
  };
}

export const updateIncorrectSequences = (qid: string, data: Array<IncorrectSequence>) => {
  return (dispatch: Function) => {
    IncorrectSequenceApi.updateAllForQuestion(qid, data).then(() => {
      dispatch(getQuestion(qid))
    }).catch((error: string) => {
      alert(`Order update failed! ${error}`);
    });
  }
}

export const submitNewFocusPoint = (qid:string, data: FocusPoint) => {
  return (dispatch: Function) => {
    FocusPointApi.create(qid, data).then(() => {
      dispatch(getQuestion(qid))
    }).catch((error: string) => {
      alert(`Submission failed! ${error}`);
    });
  }
}

export const submitEditedFocusPoint = (qid:string, data: FocusPoint, fpid: string) => {
  return (dispatch: Function) => {
    FocusPointApi.update(qid, fpid, data).then(() => {
      dispatch(getQuestion(qid))
    }).catch((error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

export const submitBatchEditedFocusPoint = (qid:string, data: Array<FocusPoint>) => {
  return (dispatch: Function) => {
    FocusPointApi.updateAllForQuestion(qid, data).then(() => {
      dispatch(getQuestion(qid))
    }).catch((error) => {
      alert(`Submission failed! ${error}`);
    });
  };
}

export const deleteFocusPoint = (qid:string, fpid: string) => {
  return (dispatch: Function) => {
    FocusPointApi.remove(qid, fpid).then(() => {
      dispatch(getQuestion(qid))
    }).catch((error) => {
      alert(`Delete failed! ${error}`);
    });
  };
}

export const getUsedSequences = (qid: string) => {
  return (dispatch: Function, getState: Function) => {
    const existingIncorrectSeqs = getState().questions.data[qid].incorrectSequences
    const usedSeqs: Array<string> = []
    if (existingIncorrectSeqs) {
      Object.values(existingIncorrectSeqs).forEach(inSeq => {
        const phrases = inSeq.text.split('|||')
        phrases.forEach((p) => {
          usedSeqs.push(p)
        })
      })
    }
    dispatch(setUsedSequences(qid, usedSeqs));
  }
}

export const setUsedSequences = (qid: string, seq: Array<string>) => {
  return {type: ActionTypes.SET_USED_SEQUENCES, qid, seq}
}

export const updateStringFilter = (stringFilter: string, qid: string) => {
  return (dispatch: Function) => {
    dispatch(setStringFilter(stringFilter));
    dispatch(searchResponses(qid));
  };
}

export const setStringFilter = (stringFilter: string) => {
  return { type: ActionTypes.SET_RESPONSE_STRING_FILTER, stringFilter, };
}

export const startResponseEdit = (qid: string, rid: string) => {
  return { type: ActionTypes.START_RESPONSE_EDIT, qid, rid, };
}

export const updatePageNumber = (pageNumber: Number, qid: string) => {
  return (dispatch: Function) => {
    dispatch(setPageNumber(pageNumber));
    dispatch(searchResponses(qid));
  };
}

export const setPageNumber = (pageNumber: Number) => {
  return { type: ActionTypes.SET_RESPONSE_PAGE_NUMBER, pageNumber, };
}

export const clearQuestionState = (qid: string) => {
  return { type: ActionTypes.CLEAR_QUESTION_STATE, qid, };
}

export const startChildResponseView = (qid: string, rid: string) => {
  return { type: ActionTypes.START_CHILD_RESPONSE_VIEW, qid, rid, };
}

export const cancelChildResponseView = (qid: string, rid: string) => {
  return { type: ActionTypes.CANCEL_CHILD_RESPONSE_VIEW, qid, rid, };
}

export const cancelResponseEdit = (qid, rid) => {
  return { type: ActionTypes.FINISH_RESPONSE_EDIT, qid, rid, };
}
