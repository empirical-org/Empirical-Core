import { TurkSessionInterface } from '../../interfaces/comprehensionInterfaces';

export const fetchTurkSessions = async (key: string, activityId: string) => {
  let turkSessions: TurkSessionInterface[];
  let error: any;
  try {
    const response = await fetch('https://comprehension-247816.appspot.com/api/turking.json');
    turkSessions = await response.json();
  } catch (err) {
    error = err;
  }
  const filteredTurkSessions = turkSessions.filter((turkSession: TurkSessionInterface)  => {
    return turkSession.activity_id === parseInt(activityId);
  });
  return {
    error,
    turkSessions: filteredTurkSessions
  }
}

export const createTurkSession = async (activityId: string, newTurkSessionDate: any) => {
  let error: any;
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
  // not a 2xx status
  if(Math.round(response.status / 100) !== 2) {
    error = 'Turk session submission failed, please try again.';
  }
  return { error };
}

export const editTurkSession = async (activityId: string, turkSessionId: string, turkSessionDate: any) => {
  let error: any;
  try {
    await fetch(`https://comprehension-247816.appspot.com/api/turking/${turkSessionId}.json`, {
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
  } catch (err) {
    error = err;
  }
  return { error };
}

export const deleteTurkSession = async (turkSessionId: string) => {
  let error: any;
  try {
    await fetch(`https://comprehension-247816.appspot.com/api/turking/${turkSessionId}.json`, {
      method: 'DELETE'
    });
  } catch (err) {
    error = err;
  }
  return { error };
}
