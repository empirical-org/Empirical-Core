import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError, apiFetch, mainApiFetch, } from '../../helpers/comprehension';

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
  return { error: handleApiError('Failed to create activity, please try again.', response) };
}

export const updateActivity = async (activity: object, activityId: string) => {
  const response = await apiFetch(`activities/${activityId}`, {
    method: 'PUT',
    body: JSON.stringify(activity)
  });
  return { error: handleApiError('Failed to update activity, please try again.', response) }
}

export const archiveParentActivity = async (parentActivityId: string) => {
  const response = await mainApiFetch(`activities/${parentActivityId}`, {
    method: 'PUT',
    body: JSON.stringify({ flags: ['archived'], })
  });
  return { error: handleApiError('Failed to archive activity, please try again.', response) }
}

export const fetchActivitySessions = async (key: string, activityId: string, pageNumber: number) => {
  const response = await mainApiFetch(`session_feedback_histories.json?page=${pageNumber}&activity_id=${activityId}`);
  const activitySessions = await response.json();

  return {
    activitySessions,
    error: handleApiError('Failed to fetch activity sessions, please refresh the page.', response),
  };
}
