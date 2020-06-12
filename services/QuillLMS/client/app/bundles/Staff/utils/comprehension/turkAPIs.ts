import { TurkSessionInterface } from '../../interfaces/comprehensionInterfaces';
import { requestFailed } from '../../../../helpers/comprehension'

export const fetchTurkSessions = async (key: string, activityId: string) => {
  let turkSessions: TurkSessionInterface[];
  let error: string;
  const response = await fetch('https://comprehension-247816.appspot.com/api/turking.json');
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to fetch turk sessions, please refresh the page.';
  }
  turkSessions = await response.json();
  const filteredTurkSessions = turkSessions.filter((turkSession: TurkSessionInterface)  => {
    return turkSession.activity_id === parseInt(activityId);
  });
  return {
    error,
    turkSessions: filteredTurkSessions
  }
}

export const createTurkSession = async (activityId: string, newTurkSessionDate: any) => {
  let error: string;
  const response = await fetch('https://comprehension-247816.appspot.com/ap/turking.json', {
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
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to create turk session, please try again.';
  }
  return { error };
}

export const editTurkSession = async (activityId: string, turkSessionId: string, turkSessionDate: any) => {
  let error: any;
  const response = await fetch(`https://comprehension-247816.appspot.com/ap/turking/${turkSessionId}.json`, {
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
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to edit turk session, please try again.';
  }
  return { error };
}

export const deleteTurkSession = async (turkSessionId: string) => {
  let error: any;
  const response = await fetch(`https://comprehension-247816.appspot.com/ap/turking/${turkSessionId}.json`, {
    method: 'DELETE'
  });
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to delete turk session, please try again.';
  }
  return { error };
}
