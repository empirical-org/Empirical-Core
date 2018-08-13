import request from 'request'
import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const questionsRef = rootRef.child('questions')
import { Questions } from '../interfaces/questions'

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
