import rootRef from '../firebase';
import { ActionTypes } from './actionTypes'
const sessionsRef = rootRef.child('proofreaderSessions')
import { ConceptResultObject, WordObject } from '../interfaces/proofreaderActivities'

export const updateSessionOnFirebase = (sessionID: string, passage: Array<Array<WordObject>>|undefined) => {
  return (dispatch: Function) => {
    sessionsRef.child(`${sessionID}/passage`).set(
      passage,
      () => dispatch(setSessionReducerToSavedSession(sessionID))
    )
  }
}

export const updateConceptResultsOnFirebase = (sessionID: string|null, activityUID: string, conceptResults: ConceptResultObject[]) => {
  const sessionObj = { conceptResults, activityUID, anonymous: !sessionID }
  if (sessionID) {
    sessionsRef.child(sessionID).set(sessionObj)
    return sessionID
  } else {
    const anonymousSession = sessionsRef.push(sessionObj)
    return anonymousSession.key
  }
}

export const setSessionReducerToSavedSession = (sessionID: string) => {
  return (dispatch: Function) => {
    sessionsRef.child(sessionID).once('value', (snapshot: any) => {
      const session = snapshot.val()
      if (session && !session.error) {
        dispatch(setSessionReducer(session.passage))
      }
    })
  }
}

export const setSessionReducer = (passage: string) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SET_FIREBASE_PASSAGE, passage})
  }
}

export const removeSession = (sessionId: string) => {
  sessionsRef.child(sessionId).remove()
}
