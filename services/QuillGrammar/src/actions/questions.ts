import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const questionsRef = rootRef.child('questions')
import { Questions } from '../interfaces/questions'

export const startListeningToQuestions = () => {
  return (dispatch) => {
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
