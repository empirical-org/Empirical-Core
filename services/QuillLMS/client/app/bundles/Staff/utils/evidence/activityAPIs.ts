import { ActivityInterface, DropdownObjectInterface } from '../../interfaces/evidenceInterfaces';
import { handleApiError, apiFetch, mainApiFetch, handleRequestErrors, requestFailed, getActivitySessionsUrl, getActivitySessionsCSVUrl } from '../../helpers/evidence/routingHelpers';

export const fetchActivities = async () => {
  let activities: ActivityInterface[];
  const response = await apiFetch('activities');
  activities = await response.json();
  return {
    activities,
    error: handleApiError('Failed to fetch activities, please refresh the page.', response)
  };
}

export const fetchActivity = async ({ queryKey, }) => {
  const [key, activityId] = queryKey
  let activity: ActivityInterface;
  const response = await apiFetch(`activities/${activityId}`);
  activity = await response.json();
  return {
    activity,
    error: handleApiError('Failed to fetch activity, please refresh the page.', response)
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

export const updateActivityVersion = async (activityNote: string, activityId: string) => {
  const response = await apiFetch(`activities/${activityId}/increment_version`, {
    method: 'PUT',
    body: JSON.stringify({note: activityNote})
  });
  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}

export const createSeedData = async (nouns: string, labelConfigs: object, activityId: string) => {
  const response = await apiFetch(`activities/${activityId}/seed_data`, {
    method: 'POST',
    body: JSON.stringify({nouns: nouns, label_configs: labelConfigs})
  });
  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  return { errors: [] };
}

export const createLabeledSyntheticData = async (filenames: string[], activityId: string) => {
  const response = await apiFetch(`activities/${activityId}/labeled_synthetic_data`, {
    method: 'POST',
    body: JSON.stringify({filenames})
  });
  const { status } = response;

  if(requestFailed(status)) {
    const errors = await response.json();
    const returnedErrors = await handleRequestErrors(errors);
    return { errors: returnedErrors };
  }
  return { errors: [] };
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

export const fetchActivitySessions = async ({ queryKey, }) => {
  const [key, activityId, pageNumber, startDate, filterOptionForQuery, endDate, responsesForScoring]: [string, string, number, string, DropdownObjectInterface, string, string, boolean] = queryKey
  const { value } = filterOptionForQuery
  const url = getActivitySessionsUrl({ activityId, pageNumber, startDate, endDate, filterType: value, responsesForScoring: responsesForScoring });
  const response = await mainApiFetch(url);
  const activitySessions = await response.json();

  return {
    activitySessions,
    error: handleApiError('Failed to fetch activity sessions, please refresh the page.', response),
  };
}

export const emailActivitySessionsDataForCSV = async (activityId:string, startDate: string, filterOptionForQuery: DropdownObjectInterface, endDate: string, responsesForScoring: boolean, onSuccess: Function, onFailure: Function) => {
  const { value } = filterOptionForQuery
  const url = getActivitySessionsCSVUrl({ activityId, startDate, endDate, filterType: value, responsesForScoring: responsesForScoring });
  const response = await mainApiFetch(url, {method: 'POST'});
  if (!response.ok) {
    onFailure(response.errors)
  } else {
    onSuccess()
  }
}

export const fetchActivitySession = async ({ queryKey, }) => {
  const [key, sessionId]: [string, string] = queryKey
  const response = await mainApiFetch(`session_feedback_histories/${sessionId}`);
  const activitySession = await response.json();

  return {
    activitySession,
    error: handleApiError('Failed to fetch activity sessions, please refresh the page.', response),
  };
}

export const fetchChangeLogs = async ({ queryKey, }) => {
  const [key, activityId]: [string, string] = queryKey
  const response = await apiFetch(`activities/${activityId}/change_logs`);
  const changeLogs = await response.json();

  return {
    changeLogs,
    error: handleApiError('Failed to fetch change log, please refresh the page.', response)
  };
}

export const fetchActivityVersions = async ({ queryKey, }) => {
  const [key, activityId]: [string, string] = queryKey
  const response = await apiFetch(`activities/${activityId}/activity_versions`);
  const changeLogs = await response.json();

  return {
    changeLogs,
    error: handleApiError('Failed to fetch change log, please refresh the page.', response)
  };
}
