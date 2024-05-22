import { apiFetch, handleApiError } from '../../helpers/evidence/routingHelpers';
import { TurkSessionInterface } from '../../interfaces/evidenceInterfaces';

export const fetchTurkSessions = async ({ queryKey, }) => {
  const [key, activityId]: [string, string] = queryKey
  let turkSessions: TurkSessionInterface[];
  const response = await apiFetch('turking_rounds');
  turkSessions = await response.json();
  const filteredTurkSessions = turkSessions.filter((turkSession: TurkSessionInterface)  => {
    return turkSession.activity_id === parseInt(activityId);
  });
  return {
    error: handleApiError('Failed to fetch turk sessions, please refresh the page.', response),
    turkSessions: filteredTurkSessions
  }
}

export const createTurkSession = async (activityId: string, newTurkSessionDate: any) => {
  const response = await apiFetch("turking_rounds", {
    method: "POST",
    body: JSON.stringify({
      activity_id: activityId,
      expires_at: newTurkSessionDate.toDate()
    })
  });
  return { error: handleApiError('Failed to create turk session, please try again.', response) };
}

export const editTurkSession = async (activityId: string, turkSessionId: string, turkSessionDate: any) => {
  const response = await apiFetch(`turking_rounds/${turkSessionId}`, {
    method: 'PUT',
    body: JSON.stringify({
      activity_id: activityId,
      expires_at: turkSessionDate
    })
  });
  return { error: handleApiError('Failed to edit turk session, please try again.', response) };
}

export const deleteTurkSession = async (turkSessionId: string) => {
  const response = await apiFetch(`turking_rounds/${turkSessionId}`, {
    method: 'DELETE'
  });
  return { error: handleApiError('Failed to delete turk session, please try again.', response) };
}
