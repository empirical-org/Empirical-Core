import * as React from "react"
import ReactHtmlParser from 'react-html-parser'

import { onMobile, orderedSteps, everyOtherStepCompleted, addPTagsToPassages, READ_PASSAGE_STEP } from './containerActionHelpers'

import DirectionsSection from '../components/studentView/directionsSection'
import PromptStep from '../components/studentView/promptStep'
import HeaderImage from '../components/studentView/headerImage'

import useFocus from '../../Shared/hooks/useFocus'

const bigCheckSrc =  `${process.env.CDN_URL}/images/icons/check-circle-big.svg`
const readPassageContainerClassName = "read-passage-container"

export const renderDirectionsSection = ({ className, handleReadTheDirectionsButtonClick, activeStep, doneHighlighting, showReadTheDirectionsButton, activities }) => {
  const { currentActivity, } = activities

  return (
    <DirectionsSection
      activeStep={activeStep}
      className={className}
      inReflection={activeStep === READ_PASSAGE_STEP && doneHighlighting}
      passage={currentActivity.passages[0]}
    />
  )
}

export const renderDirections = ({ handleReadTheDirectionsButtonClick, activeStep, doneHighlighting, showReadTheDirectionsButton, activities, hasStartedReadPassageStep, hasStartedPromptSteps }) => {
  const { currentActivity, } = activities

  const DirectionsSection = renderDirectionsSection({ className: '', handleReadTheDirectionsButtonClick , activeStep, doneHighlighting, showReadTheDirectionsButton, activities })

  if ((!hasStartedReadPassageStep || (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps)) && onMobile()) {
    return <span />
  }

  if (!currentActivity || activeStep === READ_PASSAGE_STEP) {
    return (<div className="hide-on-desktop step-links-and-directions-container">{DirectionsSection}</div>)
  }
}

export const renderStepNumber = (number: number, activeStep, completedSteps) => {
  const active = activeStep === number
  const completed = completedSteps.includes(number)
  if (completed) {
    return <img alt="white check in green circle" className="step-number completed" key={number} src={bigCheckSrc} />
  }
  // we have to remove one step for display because there are actually four steps including read passage, but it's displayed differently
  return <div className={`step-number ${active ? 'active' : ''}`} key={number}>{number - 1}</div>
}

export const renderReadPassageStep = (activeStep, activities, handleDoneReadingClick) => {
  const { currentActivity, } = activities
  if (!currentActivity || activeStep !== READ_PASSAGE_STEP) { return <span /> }

  return (
    <div className='read-passage-step-container'>
      <h2>Read the text.</h2>
      <button className='quill-button large primary contained done-reading-button' onClick={handleDoneReadingClick} type="button">Done reading</button>
    </div>
  )
}

export const renderPromptStep = ({
  activateStep,
  activityIsComplete,
  completionButtonCallback,
  completeStep,
  submitResponse,
  handleReadTheDirectionsButtonClick,
  activities,
  session,
  activeStep,
  completedSteps,
  doneHighlighting,
  showReadTheDirectionsButton,
  reportAProblem,
}) => {
  const { currentActivity, } = activities
  const { submittedResponses, hasReceivedData, } = session

  if (!currentActivity || !hasReceivedData) return

  // the first step is reading, so we will always start at 2 and therefore want to begin at the 0 index
  const stepNumber = activeStep - 2;
  const prompts = orderedSteps(activities);
  const prompt = prompts[stepNumber];

  return (
    <div className="prompt-steps">
      {renderDirectionsSection({ className: '', handleReadTheDirectionsButtonClick, activeStep, doneHighlighting, showReadTheDirectionsButton, activities })}
      <PromptStep
        activateStep={activateStep}
        activityIsComplete={activityIsComplete}
        className="step active"
        completeStep={completeStep}
        completionButtonCallback={completionButtonCallback}
        key={activeStep}
        prompt={prompt}
        reportAProblem={reportAProblem}
        stepNumber={activeStep}
        submitResponse={submitResponse}
        submittedResponses={(submittedResponses && submittedResponses[prompt.id]) || []}
      />
    </div>
  )
}
