import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const sessionsRef = rootRef.child('proofreaderSessions')
import { ConceptResultObject } from '../interfaces/proofreaderActivities'

export const updateSessionOnFirebase = (sessionID: string, passage: string) => {
  sessionsRef.child(sessionID).set({ passage: passage })
}

export const updateConceptResultsOnFirebase = (sessionID: string|null, conceptResults: Array<ConceptResultObject>) => {
  const conceptResultsObj = { conceptResults }
  if (sessionID) {
    sessionsRef.child(sessionID).set(conceptResultsObj)
    return sessionID
  } else {
    const anonymousSession = sessionsRef.push(conceptResultsObj)
    return anonymousSession.key
  }
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
