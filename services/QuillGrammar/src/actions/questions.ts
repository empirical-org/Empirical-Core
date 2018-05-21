import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const questionsRef = rootRef.child('questions')

export const startListeningToQuestions = (conceptUIDs: Array[string]) => {
  return function(dispatch) {

    questionsRef.orderByChild('concept_uid').on('value', (snapshot) => {
      const questions = snapshot.val()
      const questionsForConcepts = []
      Object.keys(questions).map(q => {
        if (conceptUIDs.includes(questions[q].concept_uid)) {
          questionsForConcepts.push(questions[q])
        }
      })
      if (questionsForConcepts.length > 0) {
        dispatch({ type: ActionTypes.RECEIVE_QUESTION_DATA, data: questionsForConcepts, });
      } else {
        dispatch({ type: ActionTypes.NO_QUESTIONS_FOUND})
      }
  });

  }
}

export const goToNextQuestion = () => {
  return function(dispatch) {
    dispatch({ type: ActionTypes.GO_T0_NEXT_QUESTION })
  }
}

export const submitResponse = (response) => {
  return function(dispatch) {
    dispatch({ type: ActionTypes.SUBMIT_RESPONSE, response })
  }
}
