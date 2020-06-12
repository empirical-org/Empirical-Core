import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';
import { requestFailed } from '../../../../helpers/comprehension';

export const fetchActivities = async () => {
  let activities: ActivityInterface[];
  let error: string;
  const response = await fetch('https://comprehension-247816.appspot.com/api/activities.json');
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to fetch activities, please refresh the page.';
  }
  activities = await response.json();
  return { 
    activities, 
    error 
  };
}

export const fetchActivity = async (key: string, activityId: string) => {
  let activity: ActivityInterface;
  let error: any;
  let flagObject: any = {};
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}.json`);
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to fetch activity, please refresh the page.';
  }
  activity = await response.json();
  if(activity) {
    const { flag } = activity
    flagObject = { label: flag, value: flag };
  }
  return { 
    activity, 
    error, 
    flag: flagObject 
  };
}

export const createActivity = async (activity: ActivityInterface) => {
  let error: any;
  const activityObject = {
    flag: activity.flag,
    passages: activity.passages,
    prompts: activity.prompts,
    title: activity.title
  }
  const response = await fetch('https://comprehension-247816.appspot.com/api/activities.json', {
    method: 'POST',
    body: JSON.stringify(activityObject),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to create activity, please try again.';
  }
  return { error };
}

export const updateActivity = async (activity: ActivityInterface, activityId: string) => {
  let error: any;
  const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}.json`, {
    method: 'PUT',
    body: JSON.stringify(activity),
    headers: {
      "Accept": "application/JSON",
      "Content-Type": "application/json"
    },
  });
  const { status } = response;
  if(requestFailed(status)) {
    error = 'Failed to update activity, please try again.';
  }
  return { error }
}
