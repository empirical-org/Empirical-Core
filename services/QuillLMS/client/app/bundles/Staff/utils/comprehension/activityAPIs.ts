import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { handleApiError } from '../../helpers/comprehension';
const baseUrl = process.env.DEFAULT_URL === 'http://localhost:3000' ? 'https://staging.quill.org' : process.env.DEFAULT_URL;

export const fetchActivities = async () => {
  let activities: ActivityInterface[];
  const response = await fetch(`${baseUrl}/api/v1/comprehension/activities.json`);
  activities = await response.json();
  return { 
    activities, 
    error: handleApiError('Failed to fetch activities, please refresh the page.', response)
  };
}

export const fetchActivity = async (key: string, activityId: string) => {
  let activity: ActivityInterface;
  // let flagObject: any = {};
  const response = await fetch(`${baseUrl}/api/v1/comprehension/activities/${activityId}.json`);
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

export const createActivity = async (activity: ActivityInterface) => {
  const activityObject = {
    // flag: activity.flag,
    passages: activity.passages,
    prompts: activity.prompts,
    title: activity.title
  }
  const response = await fetch(`${baseUrl}/api/v1/comprehension/activities.json`, {
    method: 'POST',
    body: JSON.stringify(activityObject),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  return { error: handleApiError('Failed to create activity, please try again.', response) };
}

export const updateActivity = async (activity: ActivityInterface, activityId: string) => {
  const response = await fetch(`${baseUrl}/api/v1/comprehension/activities/${activityId}.json`, {
    method: 'PUT',
    body: JSON.stringify(activity),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  return { error: handleApiError('Failed to update activity, please try again.', response) }
}
