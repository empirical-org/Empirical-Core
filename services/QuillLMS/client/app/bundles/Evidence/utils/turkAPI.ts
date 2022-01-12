import * as request from 'request';

import { handleApiError, apiFetch } from '../../Staff/helpers/evidence/routingHelpers';

export const postTurkSession = async (turkingRoundID: string, activitySessionUID: string) => {

  const response = await apiFetch('turking_round_activity_sessions', {
    method: 'POST',
    body: JSON.stringify({
      turking_round_id: turkingRoundID,
      activity_session_uid: activitySessionUID
    })
  });
  return { error: handleApiError('Failed to create turking activity session. Please refresh the page and try again.', response) };
}

export default function validateTurkSession(turkingRoundId, activityId, callback) {
  const requestObject = {
    url: `${process.env.DEFAULT_URL}/api/v1/evidence/turking_round_activity_sessions/validate?activity_id=${activityId}&turking_round_id=${turkingRoundId}`,
    json: true,
  }
  request.get(requestObject, (e, r, body) => {
    if (e) {
      alert("Failed to validate turking activity session: " + e)
    }
    callback(body)
  })
}
