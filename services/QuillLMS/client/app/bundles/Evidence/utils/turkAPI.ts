import { requestGet } from '../../../modules/request/index';
import { apiFetch, handleApiError } from '../../Staff/helpers/evidence/routingHelpers';

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
  requestGet(
    `${process.env.DEFAULT_URL}/api/v1/evidence/turking_round_activity_sessions/validate?activity_id=${activityId}&turking_round_id=${turkingRoundId}`,
    (body) => callback(body),
    (body) => {
      alert("Failed to validate turking activity session: " + body)
      callback(body)
    }
  )
}
