import { ActivityInterface, DropdownObjectInterface } from '../../interfaces/evidenceInterfaces';
import { handleApiError, apiFetch, mainApiFetch, handleRequestErrors, requestFailed, getActivitySessionsUrl } from '../../helpers/evidence';

export const fetchActivities = async () => {
  let activities: ActivityInterface[];
  const response = await apiFetch('activities');
  activities = await response.json();
  return {
    activities,
    error: handleApiError('Failed to fetch activities, please refresh the page.', response)
  };
}

export const fetchActivity = async (key: string, activityId: string) => {
  let activity: ActivityInterface;
  // let flagObject: any = {};
  const response = await apiFetch(`activities/${activityId}`);
  activity = await response.json();
  // if(activity) {
  //   const { flag } = activity
  //   flagObject = { label: flag, value: flag };
  // }
  return {
    activity,
    error: handleApiError('Failed to fetch activity, please refresh the page.', response),
    // flag: flagObject
  };
}

export const createActivity = async (activity: object) => {
  const response = await apiFetch('activities', {
    method: 'POST',
    body: JSON.stringify(activity)
  });
  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  const newActivity = await response.json();
  return { errors: [], activityId: newActivity.id };
}

export const updateActivity = async (activity: object, activityId: string) => {
  const response = await apiFetch(`activities/${activityId}`, {
    method: 'PUT',
    body: JSON.stringify(activity)
  });
  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}

export const archiveParentActivity = async (parentActivityId: string) => {
  const response = await mainApiFetch(`activities/${parentActivityId}`, {
    method: 'PUT',
    body: JSON.stringify({ flags: ['archived'], })
  });
  return { error: handleApiError('Failed to archive activity, please try again.', response) }
}

export const fetchActivitySessions = async (key: string, activityId: string, pageNumber: number, startDate: string, filterOptionForQuery: DropdownObjectInterface, endDate?: string, turkSessionID?: string) => {
  const { value } = filterOptionForQuery
  const url = getActivitySessionsUrl({ activityId, pageNumber, startDate, endDate, turkSessionID, filterType: value });
  const response = await mainApiFetch(url);
  const activitySessions = await response.json();

  return {
    activitySessions,
    error: handleApiError('Failed to fetch activity sessions, please refresh the page.', response),
  };
}

export const fetchActivitySession = async (key: string, sessionId: string) => {
  const response = await mainApiFetch(`session_feedback_histories/${sessionId}`);
  const activitySession = await response.json();

  return {
    activitySession,
    error: handleApiError('Failed to fetch activity sessions, please refresh the page.', response),
  };
}

export const fetchChangeLogs = async (key: string, activityId: string) => {
  const response = await apiFetch(`activities/${activityId}/change_logs`);
  const changeLogs = await response.json();

  return {
    changeLogs,
    error: handleApiError('Failed to fetch change log, please refresh the page.', response)
  };
}
