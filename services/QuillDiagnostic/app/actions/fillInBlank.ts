const C = require('../constants').default;
import rootRef from '../libs/firebase';
const	fillInBlankQuestionsRef = rootRef.child('diagnostic_fillInBlankQuestions');
const	responsesRef = rootRef.child('responses');
const moment = require('moment');
import _ from 'lodash';
import { push } from 'react-router-redux';
import pathwaysActions from './pathways';
import { submitResponse } from './responses';
import { Questions, Question, FocusPoint, IncorrectSequence } from '../interfaces/questions'
import {
  QuestionApi,
  FocusPointApi,
  IncorrectSequenceApi,
  FILL_IN_BLANKS_TYPE
} from '../libs/questions_api'

function startListeningToQuestions() {
  return loadQuestions();
}

function loadQuestions() {
  return (dispatch, getState) => {
    QuestionApi.getAll(FILL_IN_BLANKS_TYPE).then((questions) => {
      dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA, data: questions, });
    });
  };
}

function loadQuestion(uid) {
  return (dispatch, getState) => {
    QuestionApi.get(uid).then((question: Question) => {
      dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTION_DATA, uid: uid, data: question, });
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
      dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA, data: questionData, });
    });
  }
}

function startQuestionEdit(qid) {
  return { type: C.START_FILL_IN_BLANK_QUESTION_EDIT, qid, };
}

function cancelQuestionEdit(qid) {
  return { type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, };
}

function submitQuestionEdit(qid, content) {
  return (dispatch, getState) => {
    dispatch({ type: C.SUBMIT_FILL_IN_BLANK_QUESTION_EDIT, qid, });
    QuestionApi.update(qid, content).then( () => {
      dispatch({ type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, });
      dispatch(loadQuestion(qid));
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
    }, (error) => {
      dispatch({ type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, });
      dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
    });
  };
}

function toggleNewQuestionModal() {
    return { type: C.TOGGLE_NEW_FILL_IN_BLANK_QUESTION_MODAL, };
}

function submitNewQuestion(content, response) {
  return (dispatch, getState) => {
    dispatch({ type: C.AWAIT_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
    QuestionApi.create(FILL_IN_BLANKS_TYPE, content).then((question) => {
      dispatch({ type: C.RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
      response.questionUID = Object.keys(question)[0];
      response.gradeIndex = `human${response.questionUID}`;
      dispatch(submitResponse(response));
      dispatch(loadQuestion(response.questionUID));
      dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
      const action = push(`/admin/questions/${response.questionUID}`);
      dispatch(action);
    }, (error) => {
      dispatch({ type: C.RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
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
    }, (error) => {
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
    }, (error) => {
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

export default {
  startListeningToQuestions,
  loadQuestions,
  loadQuestion,
  loadSpecifiedQuestions,
  startQuestionEdit,
  cancelQuestionEdit,
  submitQuestionEdit,
  submitNewIncorrectSequence,
  submitEditedIncorrectSequence,
  deleteIncorrectSequence,
  toggleNewQuestionModal,
  submitNewQuestion,
  submitNewFocusPoint,
  submitEditedFocusPoint,
  submitBatchEditedFocusPoint,
  deleteFocusPoint
};
// const actions = {
// 	// called when the app starts. this means we immediately download all questions, and
// 	// then receive all questions again as soon as anyone changes anything.
//   startListeningToQuestions() {
//     return function (dispatch, getState) {
//       fillInBlankQuestionsRef.on('value', (snapshot) => {
//         dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA, data: snapshot.val(), });
//       });
//     };
//   },
//   loadQuestions() {
//     return function (dispatch, getState) {
//       fillInBlankQuestionsRef.once('value', (snapshot) => {
//         dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA, data: snapshot.val(), });
//       });
//     };
//   },
//   loadSpecifiedQuestions(uids) {
//     return (dispatch, getState) => {
//       const requestPromises = [];
//       uids.forEach((uid) => {
//         requestPromises.push(fillInBlankQuestionsRef.child(uid).once('value'));
//       });
//       const allPromises = Promise.all(requestPromises);
//       const questionData = {};
//       allPromises.then((results) => {
//         results.forEach((snapshot, index) => {
//           const val = snapshot.val();
//           questionData[uids[index]] = snapshot.val();
//         });
//         dispatch({ type: C.RECEIVE_FILL_IN_BLANK_QUESTIONS_DATA, data: questionData, });
//       });
//     }
//   },
//   startQuestionEdit(qid) {
//     return { type: C.START_FILL_IN_BLANK_QUESTION_EDIT, qid, };
//   },
//   cancelQuestionEdit(qid) {
//     return { type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, };
//   },
//   submitQuestionEdit(qid, content) {
//     return function (dispatch, getState) {
//       dispatch({ type: C.SUBMIT_FILL_IN_BLANK_QUESTION_EDIT, qid, });
//       const cleanedContent = _.pickBy(content, value => !!value || value === false)
//       fillInBlankQuestionsRef.child(qid).update(cleanedContent, (error) => {
//         dispatch({ type: C.FINISH_FILL_IN_BLANK_QUESTION_EDIT, qid, });
//         if (error) {
//           dispatch({ type: C.DISPLAY_ERROR, error: `Update failed! ${error}`, });
//         } else {
//           dispatch({ type: C.DISPLAY_MESSAGE, message: 'Update successfully saved!', });
//           const action = push(`/admin/fill-in-the-blanks/${qid}`);
//           dispatch(action);
//         }
//       });
//     };
//   },
//   toggleNewQuestionModal() {
//     return { type: C.TOGGLE_NEW_FILL_IN_BLANK_QUESTION_MODAL, };
//   },
//   submitNewQuestion(content, response) {
//     return (dispatch, getState) => {
//       dispatch({ type: C.AWAIT_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
//       const newRef = fillInBlankQuestionsRef.push(content, (error) => {
//         dispatch({ type: C.RECEIVE_NEW_FILL_IN_BLANK_QUESTION_RESPONSE, });
//         if (error) {
//           dispatch({ type: C.DISPLAY_ERROR, error: `Submission failed! ${error}`, });
//         } else {
//           response.questionUID = newRef.key;
//           response.gradeIndex = `human${newRef.key}`;
//           dispatch(submitResponse(response));
//           dispatch({ type: C.DISPLAY_MESSAGE, message: 'Submission successfully saved!', });
//           const action = push(`/admin/fill-in-the-blanks/${newRef.key}`);
//           dispatch(action);
//         }
//       });
//     };
//   },

//   submitNewFocusPoint(qid, data) {
//     return function (dispatch, getState) {
//       fillInBlankQuestionsRef.child(`${qid}/focusPoints`).push(data, (error) => {
//         if (error) {
//           alert(`Submission failed! ${error}`);
//         }
//       });
//     };
//   },
//   submitEditedFocusPoint(qid, data, fpid) {
//     return function (dispatch, getState) {
//       fillInBlankQuestionsRef.child(`${qid}/focusPoints/${fpid}`).update(data, (error) => {
//         if (error) {
//           alert(`Submission failed! ${error}`);
//         }
//       });
//     };
//   },
//   submitBatchEditedFocusPoint(qid, data) {
//     return function (dispatch, getState) {
//       fillInBlankQuestionsRef.child(`${qid}/focusPoints/`).set(data, (error) => {
//         if (error) {
//           alert(`Submission failed! ${error}`);
//         }
//       });
//     };
//   },
//   deleteFocusPoint(qid, fpid) {
//     return function (dispatch, getState) {
//       fillInBlankQuestionsRef.child(`${qid}/focusPoints/${fpid}`).remove((error) => {
//         if (error) {
//           alert(`Delete failed! ${error}`);
//         }
//       });
//     };
//   },
//   submitNewIncorrectSequence(qid, data) {
//     return function (dispatch, getState) {
//       fillInBlankQuestionsRef.child(`${qid}/incorrectSequences`).push(data, (error) => {
//         if (error) {
//           alert(`Submission failed! ${error}`);
//         }
//       });
//     };
//   },
//   submitEditedIncorrectSequence(qid, data, seqid) {
//     return function (dispatch, getState) {
//       fillInBlankQuestionsRef.child(`${qid}/incorrectSequences/${seqid}`).update(data, (error) => {
//         if (error) {
//           alert(`Submission failed! ${error}`);
//         }
//       });
//     };
//   },
//   deleteIncorrectSequence(qid, seqid) {
//     return function (dispatch, getState) {
//       fillInBlankQuestionsRef.child(`${qid}/incorrectSequences/${seqid}`).remove((error) => {
//         if (error) {
//           alert(`Delete failed! ${error}`);
//         }
//       });
//     };
//   },
// };

// export default actions;
