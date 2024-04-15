import * as React from 'react'
import Pusher from 'pusher-js';

import { getConceptResultsForAllQuestions } from '../libs/conceptResults/diagnostic';
import { requestPost, requestPut, } from '../../../modules/request/index';
import { roundValuesToSeconds, } from '../../Shared/index';

const TITLE_CARD_TYPE = "TL"

export const saveSession = (sessionID, timeTracking, playDiagnostic, match, isTurkSession, updateState) => {
  const { params } = match
  const { diagnosticID } = params

  updateState({ error: false, });

  const relevantAnsweredQuestions = playDiagnostic.answeredQuestions.filter(q => q.questionType !== TITLE_CARD_TYPE)
  const results = getConceptResultsForAllQuestions(relevantAnsweredQuestions);
  const data = { time_tracking: roundValuesToSeconds(timeTracking), }

  if (sessionID) {
    finishActivitySession(sessionID, results, 1, data, isTurkSession, updateState);
  } else {
    createAnonActivitySession(diagnosticID, results, 1, data, isTurkSession, updateState);
  }
}

const initializeSubscription = (activitySessionUid, isTurkSession, updateState) => {
  if (process.env.NODE_ENV === 'development') {
    Pusher.logToConsole = true;
  }
  if (!window.pusher) {
    window.pusher = new Pusher(process.env.PUSHER_KEY, { cluster: process.env.PUSHER_CLUSTER });
  }
  const channel = window.pusher.subscribe(activitySessionUid);

  channel.bind('concept-results-saved', () => {
    if (!isTurkSession) { document.location.href = `${process.env.DEFAULT_URL}/activity_sessions/${activitySessionUid}` }
    updateState({ saved: true, });
  });

  channel.bind('concept-results-partially-saved', () => {
    if (!isTurkSession) { document.location.href = process.env.DEFAULT_URL; }
  });
}

const finishActivitySession = (sessionID, results, score, data, isTurkSession, updateState) => {
  initializeSubscription(sessionID, isTurkSession, updateState)

  requestPut(
    `${process.env.DEFAULT_URL}/api/v1/activity_sessions/${sessionID}`,
    {
      state: 'finished',
      concept_results: results,
      percentage: score,
      data
    },
    (body) => {
      // doing nothing here because the Pusher subscription should handle a redirect once concept results are saved
    },
    (body) => {
      updateState({
        saved: false,
        error: body.meta.message,
      });
    }
  )
}

const createAnonActivitySession = (lessonID, results, score, data, isTurkSession, updateState) => {
  requestPost(
    `${process.env.DEFAULT_URL}/api/v1/activity_sessions/`,
    {
      state: 'finished',
      activity_uid: lessonID,
      concept_results: results,
      percentage: score,
      data
    },
    (body) => {
      initializeSubscription(body.activity_session.uid, isTurkSession, updateState)
    }
  )
}
