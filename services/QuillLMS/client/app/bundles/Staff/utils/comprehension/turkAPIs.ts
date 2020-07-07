import { TurkSessionInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError } from '../../helpers/comprehension'

export const fetchTurkSessions = async (key: string, activityId: string) => {
  let turkSessions: TurkSessionInterface[];
  const response = await fetch('https://comprehension-247816.appspot.com/api/turking.json');
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
  const response = await fetch('https://comprehension-247816.appspot.com/api/turking.json', {
    method: 'POST',
    body: JSON.stringify({
      activity_id: activityId,
      expires_at: newTurkSessionDate.toDate()
    }),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  return { error: handleApiError('Failed to create turk session, please try again.', response) };
}

export const editTurkSession = async (activityId: string, turkSessionId: string, turkSessionDate: any) => {
  const response = await fetch(`https://comprehension-247816.appspot.com/api/turking/${turkSessionId}.json`, {
    method: 'PUT',
    body: JSON.stringify({
      activity_id: activityId, 
      expires_at: turkSessionDate 
    }),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  return { error: handleApiError('Failed to edit turk session, please try again.', response) };
}

export const deleteTurkSession = async (turkSessionId: string) => {
  const response = await fetch(`https://comprehension-247816.appspot.com/api/turking/${turkSessionId}.json`, {
    method: 'DELETE'
  });
  return { error: handleApiError('Failed to delete turk session, please try again.', response) };
}
