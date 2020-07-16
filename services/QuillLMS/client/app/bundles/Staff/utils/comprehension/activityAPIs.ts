import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError, apiFetch } from '../../helpers/comprehension';

export const fetchActivities = async () => {
  let activities: ActivityInterface[];
  const response = await apiFetch('/api/v1/comprehension/activities.json');
  activities = await response.json();
  return { 
    activities, 
    error: handleApiError('Failed to fetch activities, please refresh the page.', response)
  };
}

export const fetchActivity = async (key: string, activityId: string) => {
  let activity: ActivityInterface;
  // let flagObject: any = {};
  const response = await apiFetch(`/api/v1/comprehension/activities/${activityId}.json`);
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
  const response = await apiFetch('/api/v1/comprehension/activities.json', {
    method: 'POST',
    body: JSON.stringify(activity)
  });
  return { error: handleApiError('Failed to create activity, please try again.', response) };
}

export const updateActivity = async (activity: object, activityId: string) => {
  const response = await apiFetch(`/api/v1/comprehension/activities/${activityId}.json`, {
    method: 'PUT',
    body: JSON.stringify(activity)
  });
  return { error: handleApiError('Failed to update activity, please try again.', response) }
}
