import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const sessionsRef = rootRef.child('proofreaderSessions')
import { Question } from '../interfaces/questions'
import { SessionState } from '../reducers/sessionReducer'
import { checkGrammarQuestion, Response } from 'quill-marking-logic'
import { shuffle } from '../helpers/shuffle';
import _ from 'lodash';

export const updateSessionOnFirebase = (sessionID: string, passage: string) => {
  sessionsRef.child(sessionID).set({ passage: passage })
}

export const updateSession = (passage: string) => {
  return (dispatch) => {
    dispatch({ type: ActionTypes.SET_PASSAGE, passage})
  }
}

export const setSessionReducerToSavedSession = (sessionID: string) => {
  return (dispatch) => {
    sessionsRef.child(sessionID).once('value', (snapshot) => {
      const session = snapshot.val()
      if (session && !session.error) {
        debugger;
        dispatch(setSessionReducer(session.passage))
      }
    })
  }
}

export const setSessionReducer = (passage: string) => {
  return (dispatch) => {
    debugger;
    dispatch({ type: ActionTypes.SET_FIREBASE_PASSAGE, passage})
  }
}
