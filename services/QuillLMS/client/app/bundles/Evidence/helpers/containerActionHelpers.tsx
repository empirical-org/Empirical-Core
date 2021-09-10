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

const addPTagsToPassages = (passages: Passage[], scrolledToEndOfPassage) => {
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

const removeElementsFromPassages = (passages, element) => {
  return passages.map(passage => {
    return stripHtml(passage, { onlyStripTags: [element] })
  })
}

export const formatHtmlForPassage = ({ activeStep, studentHighlights, scrolledToEndOfPassage, activities, session}) => {
  const { currentActivity, } = activities

  if (!currentActivity) { return }

  let passages: any[] = currentActivity.passages
  const passagesWithPTags = addPTagsToPassages(passages, scrolledToEndOfPassage)
  const passagesWithoutSpanTags = removeElementsFromPassages(passagesWithPTags, 'span');

  if (!activeStep || activeStep === READ_PASSAGE_STEP) { return passagesWithPTags }

  const promptIndex = activeStep - 2 // have to subtract 2 because the prompts array index starts at 0 but the prompt numbers in the state are 2..4
  const activePromptId = currentActivity.prompts[promptIndex].id
  const submittedResponsesForActivePrompt = session.submittedResponses[activePromptId]

  // we return the unhighlighted text when an active response has no submissions with highlights
  if (!(submittedResponsesForActivePrompt && submittedResponsesForActivePrompt.length)) { return passagesWithoutSpanTags }

  const lastSubmittedResponse = submittedResponsesForActivePrompt[submittedResponsesForActivePrompt.length - 1]
  const noPassageHighlights = !lastSubmittedResponse.highlight || (lastSubmittedResponse.highlight && !lastSubmittedResponse.highlight.length);
  const isResponseHighlight = lastSubmittedResponse.highlight && lastSubmittedResponse.highlight[0] && lastSubmittedResponse.highlight[0].type === 'response';
  if (noPassageHighlights || isResponseHighlight) { return passagesWithoutSpanTags }

  const passageHighlights = lastSubmittedResponse.highlight.filter(hl => hl.type === "passage")

  passageHighlights.forEach(hl => {
    const characterStart = hl.character || 0
    passages = passages.map((passage: Passage) => {
      let formattedPassage = passage;
      const { text } = passage;
      // we want to remove any highlights returned from inactive prompts
      const formattedPassageText = stripHtml(text, { onlyStripTags: ['span', 'mark'] });
      const strippedText = stripHtml(hl.text);
      const passageBeforeCharacterStart = formattedPassageText.substring(0, characterStart)
      const passageAfterCharacterStart = formattedPassageText.substring(characterStart)
      const highlightedPassageAfterCharacterStart = passageAfterCharacterStart.replace(strippedText, `<span class="passage-highlight">${strippedText}</span>`)
      formattedPassage.text = `${passageBeforeCharacterStart}${highlightedPassageAfterCharacterStart}`
      return formattedPassage
    })
  })

  // if there were passage highlights to account for, we stripped away the student highlights and need to add them back
  studentHighlights.forEach(hl => {
    passages = passages.map((passage: Passage) => {
      let formattedPassage = passage;
      const { text } = passage;
      formattedPassage.text = text.replace(hl, `<mark class="highlighted">${hl}</mark>`)
      return formattedPassage
    })
  })

  return addPTagsToPassages(passages, scrolledToEndOfPassage)
}

export const everyOtherStepCompleted = (stepNumber, completedSteps) => {
  return completedSteps.filter(s => s !== stepNumber).length === 3
}
