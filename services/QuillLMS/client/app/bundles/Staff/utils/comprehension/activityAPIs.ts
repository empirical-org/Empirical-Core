import { ActivityInterface } from '../../interfaces/comprehensionInterfaces';

export const fetchActivities = async (
  setActivities, 
  setError, 
  setLoading
  ) => {
  let activities: ActivityInterface[];
  try {
    setLoading && setLoading(true);
    const response = await fetch('https://comprehension-247816.appspot.com/api/activities.json');
    activities = await response.json();
  } catch (error) {
    setError(error);
    setLoading && setLoading(false);
  }
  setActivities(activities);
  setLoading && setLoading(false);
}

export const fetchActivity = async (
  activityId: string, 
  setActivity, 
  setActivityFlag, 
  setError, 
  setLoading, 
  setOriginalFlag
  ) => {
  let activity: ActivityInterface;
  try {
    setLoading(true);
    const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}.json`);
    activity = await response.json();
  } catch (error) {
    setError(error);
    setLoading(false);
  }
  const { flag } = activity
  const flagObject = { label: flag, value: flag };
  setActivity(activity);
  setOriginalFlag(flagObject);
  setActivityFlag(flagObject);
  setLoading(false);
}

export const createActivity = async (
  activity: ActivityInterface,
  setError,
  setShowCreateActivityModal,
  setShowSubmissionModal
  ) => {
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
    setError('Activity submission failed, please try again.');
  }
  setShowCreateActivityModal(false);
  setShowSubmissionModal(true);
}

export const updateActivity = async (
  activity: ActivityInterface,
  activityId: string,
  setActivity, 
  setActivityFlag, 
  setError, 
  setLoading, 
  setOriginalFlag,
  setShowEditActivityModal
) => {
  let updatedActivity: ActivityInterface;
  try {
    setLoading(true);
    const response = await fetch(`https://comprehension-247816.appspot.com/api/activities/${activityId}.json`, {
      method: 'PUT',
      body: JSON.stringify(activity),
      headers: {
        "Accept": "application/JSON",
        "Content-Type": "application/json"
      },
    });
    updatedActivity = await response.json();
  } catch (error) {
    setError(error);
    setLoading(false);
  }
  const { flag } = updatedActivity
  const flagObject = { label: flag, value: flag };
  setActivity(updatedActivity);
  setOriginalFlag(flagObject);
  setActivityFlag(flagObject);
  setLoading(false);
  setShowEditActivityModal(false);
}
