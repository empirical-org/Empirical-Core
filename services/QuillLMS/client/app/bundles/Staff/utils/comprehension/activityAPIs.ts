import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';

export const fetchActivities = async () => {
  let activities: ActivityInterface[];
  let error: any = null;
  try {
    const response = await fetch('https://comprehension-247816.appspot.com/api/activities.json');
    activities = await response.json();
  } catch (err) {
    error = err;
  }
  return { 
    activities, 
    error 
  };
}

export const fetchActivity = async (activityId: string) => {
  let activity: ActivityInterface;
  let error: any;
  let flagObject: any = {};
  try {
    const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}.json`);
    activity = await response.json();
  } catch (err) {
    error = err;
  }
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
  let error: any = null;
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
  // not a 2xx status
  if(Math.round(response.status / 100) !== 2) {
    error = 'Activity submission failed, please try again.';
  }
  return { error };
}

export const updateActivity = async (activity: ActivityInterface, activityId: string) => {
  let updatedActivity: ActivityInterface;
  let error: any = null;
  let flagObject: any = {};
  try {
    const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}.json`, {
      method: 'PUT',
      body: JSON.stringify(activity),
      headers: {
        "Accept": "application/JSON",
        "Content-Type": "application/json"
      },
    });
    updatedActivity = await response.json();
  } catch (err) {
    error = err;
  }
  if(updatedActivity) {
    const { flag } = activity
    flagObject = { label: flag, value: flag };
  }
  return { 
    updatedActivity,
    error,
    flag: flagObject
  }
}
