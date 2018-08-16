import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const questionsRef = rootRef.child('questions')
const sessionsRef = rootRef.child('sessions')
import * as responseActions from './responses'
import { Question } from '../interfaces/questions'
import { SessionState } from '../reducers/sessionReducer'
import { checkGrammarQuestion, Response } from 'quill-marking-logic'
import { shuffle } from '../helpers/shuffle';
import _ from 'lodash';

export const updateSessionOnFirebase = (sessionID: string, session: SessionState) => {
  const cleanedSession = _.pickBy(session)
  cleanedSession.currentQuestion ? cleanedSession.currentQuestion.attempts = _.compact(cleanedSession.currentQuestion.attempts) : null
  if (!cleanedSession.error) {
    sessionsRef.child(sessionID).set(cleanedSession)
  }
}

export const setSessionReducerToSavedSession = (sessionID: string) => {
  return dispatch => {
    sessionsRef.child(sessionID).once('value', (snapshot) => {
      const session = snapshot.val()
      if (session && !session.error) {
        dispatch(setSessionReducer(session))
      }
    })
  }
}

// typescript this
export const startListeningToQuestions = (concepts: any) => {
  return dispatch => {

    const conceptUIDs = Object.keys(concepts)
    questionsRef.orderByChild('concept_uid').on('value', (snapshot) => {
      const questions = snapshot.val()
      const questionsForConcepts = {}
      Object.keys(questions).map(q => {
        if (conceptUIDs.includes(questions[q].concept_uid)) {
          const question = questions[q]
          question.uid = q
          if (questionsForConcepts.hasOwnProperty(question.concept_uid)) {
            questionsForConcepts[question.concept_uid] = questionsForConcepts[question.concept_uid].concat(question)
          } else {
            questionsForConcepts[question.concept_uid] = [question]
          }
        }
      })

      const arrayOfQuestions = []
      Object.keys(questionsForConcepts).forEach(conceptUID => {
        const shuffledQuestionArray = shuffle(questionsForConcepts[conceptUID])
        const numberOfQuestions = concepts[conceptUID].quantity
        arrayOfQuestions.push(shuffledQuestionArray.slice(0, numberOfQuestions))
      })

      const flattenedArrayOfQuestions = _.flatten(arrayOfQuestions)
      if (flattenedArrayOfQuestions.length > 0) {
        dispatch({ type: ActionTypes.RECEIVE_QUESTION_DATA, data: flattenedArrayOfQuestions, });
      } else {
        dispatch({ type: ActionTypes.NO_QUESTIONS_FOUND_FOR_SESSION})
      }
    });

  }
}

export const checkAnswer = (response:string, question:Question, responses:Array<Response>, isFirstAttempt:Boolean) => {
  return dispatch => {
    const questionUID: string = question.uid
    const responseObj = checkGrammarQuestion(questionUID, response, responses)
    responseObj.feedback = responseObj.feedback ? responseObj.feedback : "<b>Try again!</b> Unfortunately, that answer is not correct."
    dispatch(responseActions.submitResponse(responseObj, null, isFirstAttempt))
    delete responseObj.parent_id
    dispatch(submitResponse(responseObj))
  }
}

export const goToNextQuestion = () => {
  return dispatch => {
    dispatch({ type: ActionTypes.GO_T0_NEXT_QUESTION })
  }
}

export const submitResponse = (response: Response) => {
  return dispatch => {
    dispatch({ type: ActionTypes.SUBMIT_RESPONSE, response })
  }
}

export const setSessionReducer = (session: SessionState) => {
  return dispatch => {
    dispatch({ type: ActionTypes.SET_SESSION, session})
  }
}
