export function sendActivitySessionInteractionLog(activitySessionUID, data = {}) {
  if (activitySessionUID === 'null' || activitySessionUID == null) {
    return null; // no need to procede
  }
  const url = `http://localhost:3000/api/v1/activity_sessions/${activitySessionUID}/activity_session_interaction_logs`;
  fetch(url, {
    method: 'POST', // or 'PUT'
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify({ meta: data, }), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
  /*
   *.then(res => res.json())
   *.then(response => console.log('Success:', response))
   *.catch(error => console.error('Error:', error));
   */
}
