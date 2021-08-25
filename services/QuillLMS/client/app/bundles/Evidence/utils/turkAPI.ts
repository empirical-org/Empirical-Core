import { apiFetch, handleApiError } from '../../Staff/helpers/evidence';

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
