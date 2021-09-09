import queryString from 'query-string';

import getParameterByName from './getParameterByName';

export const getUrlParam = (paramName: string, location, isTurk) => {
  if(isTurk) {
    return getParameterByName(paramName, window.location.href)
  }
  const { search, } = location
  if (!search) { return }
  return queryString.parse(search)[paramName]
}

export const onMobile = () => window.innerWidth < 1100

export const orderedSteps = (activities) => {
  const { currentActivity, } = activities
  return currentActivity ? currentActivity.prompts.sort((a, b) => a.conjunction.localeCompare(b.conjunction)) : [];
}

export const outOfAttemptsForActivePrompt = (activeStep, session, activities) => {
  const { submittedResponses, } = session
  const activePrompt = orderedSteps(activities)[activeStep - 2] // subtracting 2 because the READ_PASSAGE_STEP is 1, so the first item in the set of prompts will always be 2

  if (!activePrompt) { return }

  const responsesForPrompt = submittedResponses[activePrompt.id]

  if (!responsesForPrompt) { return }

  const lastAttempt = responsesForPrompt[responsesForPrompt.length - 1]

  return (responsesForPrompt.length === activePrompt.max_attempts) || lastAttempt.optimal
}

export const getCurrentStepDataForEventTracking = (activeStep, activities, session, isTurk) => {
  const { currentActivity, } = activities
  const { sessionID, } = session
  const activityID = getUrlParam('uid', location, isTurk)
  const promptIndex = activeStep - 2 // have to subtract 2 because the prompts array index starts at 0 but the prompt numbers in the state are 2..4

  if (promptIndex < 0 || !currentActivity.prompts[promptIndex]) return; // If we're on a step earlier than a prompt, or there's no prompt for this step then there's nothing to track

  const promptID = currentActivity.prompts[promptIndex].id

  return {
    activityID,
    sessionID,
    promptID,
  }
}
