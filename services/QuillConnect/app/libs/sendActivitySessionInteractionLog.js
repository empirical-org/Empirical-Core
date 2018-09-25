export function sendActivitySessionInteractionLog(activitySessionUID, data = {}) {
  if (activitySessionUID === 'null' || activitySessionUID == null) {
    return null;
  }
  const url = `${process.env.EMPIRICAL_BASE_URL}/api/v1/activity_sessions/${activitySessionUID}/activity_session_interaction_logs`;
  fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify({ meta: data, }),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });
}
