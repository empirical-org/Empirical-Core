import {v4 as uuid} from 'uuid';

import { ActionTypes } from './actionTypes'

import { ConceptResultObject, WordObject } from '../interfaces/proofreaderActivities'
import { SessionApi } from '../lib/sessions_api'

export const updateSessionOnFirebase = (sessionID: string, session: { passage: Array<Array<WordObject>>|undefined, timeTracking: { [key:string]: number } }, callback: Function) => {
  return (dispatch: Function) => {
    SessionApi.update(sessionID, session).then(() => {
      dispatch(setSessionReducerToSavedSession(sessionID))
      if (callback) {
        callback()
      }
    })
  }
}

export const updateConceptResultsOnFirebase = (sessionID: string|null, activityUID: string, sessionObj: { conceptResults: ConceptResultObject[], timeTracking: {[key:string]: number} } ) => {
  if (!sessionID) {
    sessionID = uuid()
  }
  SessionApi.update(sessionID, { ...sessionObj, activityUID, anonymous: !sessionID })
  return sessionID
}

export const setSessionReducerToSavedSession = (sessionID: string, initialLoad?: boolean) => {
  return (dispatch: Function) => {
    SessionApi.get(sessionID).then((session) => {
      handleSession(session, initialLoad, sessionID, dispatch)
    })
  }
}

const handleSession = (session, initialLoad, sessionID, dispatch) => {
  if (session && !session.error) {
    if (session.conceptResults && initialLoad) {
      window.location.href = `${import.meta.env.QUILL_GRAMMAR_URL}/play/sw?proofreaderSessionId=${sessionID}`
    } else {
      dispatch(setSessionReducer(session.passage))
      dispatch(updateTimeTracking(session.timeTracking))
    }
  }
}

export const setSessionReducer = (passage: string) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SET_FIREBASE_PASSAGE, passage})
  }
}

export const setPassage = (passage: Array<Array<WordObject>>) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SET_PASSAGE, passage})
  }
}

export const updateTimeTracking = (timeTracking: {[key:string]: number}) => {
  return (dispatch: Function) => {
    dispatch({ type: ActionTypes.SET_TIMETRACKING, timeTracking})
  }
}
