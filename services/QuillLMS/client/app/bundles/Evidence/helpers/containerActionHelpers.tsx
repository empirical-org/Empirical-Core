import queryString from 'query-string'
import stripHtml from "string-strip-html"

import getParameterByName from './getParameterByName'

import { Passage } from '../interfaces/activities'

export const READ_PASSAGE_STEP = 1

export const ALL_STEPS = [READ_PASSAGE_STEP, 2, 3, 4]

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

export const getCurrentStepDataForEventTracking = ({ activeStep, activities, session, isTurk }) => {
  const { currentActivity, } = activities
  const { sessionID, } = session
  const activityID = getUrlParam('uid', location, isTurk)
  const promptIndex = activeStep - 2 // have to subtract 2 because the prompts array index starts at 0 but the prompt numbers in the state are 2..4

  if (promptIndex < 0 || !currentActivity || !currentActivity.prompts[promptIndex]) return; // If we're on a step earlier than a prompt, or there's no prompt for this step then there's nothing to track

  const promptID = currentActivity.prompts[promptIndex].id

  return {
    activityID,
    sessionID,
    promptID
  }
}

export const addPTagsToPassages = (passages: Passage[], scrolledToEndOfPassage) => {
  return passages.map(passage => {
    const { text } = passage;
    const paragraphArray = text ? text.match(/[^\r\n]+/g) : [];
    return paragraphArray.map((p, i) => {
      if (i === paragraphArray.length - 1 && !scrolledToEndOfPassage) {
        return `<p>${p}<span id="end-of-passage"></span></p>`
      }
      return `<p>${p}</p>`
    }).join('').replace('<p><p>', '<p>').replace('</p></p>', '</p>')
  })
}

export const everyOtherStepCompleted = (stepNumber, completedSteps) => {
  return completedSteps.filter(s => s !== stepNumber).length === 3
}

export const getLastSubmittedResponse = ({ activities, session, activeStep }) => {
  const { currentActivity } = activities;
  const promptIndex = activeStep - 2
  const activePromptId = currentActivity && currentActivity.prompts[promptIndex] && currentActivity.prompts[promptIndex].id
  const submittedResponsesForActivePrompt = session.submittedResponses[activePromptId]
  return submittedResponsesForActivePrompt && submittedResponsesForActivePrompt[submittedResponsesForActivePrompt.length - 1]
}

export const getStrippedPassageHighlights = ({ activities, session, activeStep }) => {
  const lastSubmittedResponse = getLastSubmittedResponse({ activities, session, activeStep });
  const passageHighlights = lastSubmittedResponse && lastSubmittedResponse.highlight && lastSubmittedResponse.highlight.filter(hl => hl.type === "passage")
  return passageHighlights && passageHighlights.map(highlight => stripHtml(highlight.text));
}
