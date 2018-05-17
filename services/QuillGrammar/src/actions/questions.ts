import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const questionsRef = rootRef.child('questions')

export const startListeningToQuestions = (conceptUID: string) => {
  console.log('conceptUID', conceptUID)
  return function(dispatch) {

    questionsRef.orderByChild('concept_uid').equalTo('conceptUID').on('value', (snapshot) => {
      console.log('heyyyy')
      console.log('snapshot.val', snapshot.val())
      if (snapshot.val()) {
        dispatch({ type: ActionTypes.RECEIVE_QUESTION_DATA, data: snapshot.val(), });
      } else {
        dispatch({ type: ActionTypes.NO_QUESTIONS_FOUND})
      }
  });

  }
}
