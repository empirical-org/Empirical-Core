import * as React from "react"
import ReactHtmlParser from 'react-html-parser'

import { onMobile, orderedSteps, everyOtherStepCompleted, addPTagsToPassages, READ_PASSAGE_STEP, ALL_STEPS } from './containerActionHelpers'

import DirectionsSectionAndModal from '../components/studentView/directionsSectionAndModal'
import StepLink from '../components/studentView/stepLink'
import PromptStep from '../components/studentView/promptStep'
import HeaderImage from '../components/studentView/headerImage'

const bigCheckSrc =  `${process.env.CDN_URL}/images/icons/check-circle-big.svg`

export const renderDirectionsSectionAndModal = ({ className, closeReadTheDirectionsModal, activeStep, doneHighlighting, showReadTheDirectionsModal, activities }) => {
  const { currentActivity, } = activities

  return  (<DirectionsSectionAndModal
    activeStep={activeStep}
    className={className}
    closeReadTheDirectionsModal={closeReadTheDirectionsModal}
    inReflection={activeStep === READ_PASSAGE_STEP && doneHighlighting}
    passage={currentActivity.passages[0]}
    showReadTheDirectionsModal={showReadTheDirectionsModal}
  />)
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
  if (!currentActivity || activeStep !== READ_PASSAGE_STEP) { return }

  return (<div className='read-passage-step-container'>
    <h2>Read the text.</h2>
    <button className='quill-button large primary contained done-reading-button' onClick={handleDoneReadingClick} type="button">Done reading</button>
  </div>)
}

export const renderStepLinksAndDirections = ({
  activeStep,
  hasStartedReadPassageStep,
  hasStartedPromptSteps,
  doneHighlighting,
  showReadTheDirectionsModal,
  completedSteps,
  activities,
  clickStepLink,
  closeReadTheDirectionsModal,
  scrollToQuestionSectionOnMobile
}) => {
  const { currentActivity, } = activities

  const directionsSectionAndModal = renderDirectionsSectionAndModal({ className: '', closeReadTheDirectionsModal , activeStep, doneHighlighting, showReadTheDirectionsModal, activities })

  if ((!hasStartedReadPassageStep || (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps)) && onMobile()) {
    return
  }

  if (!currentActivity || activeStep === READ_PASSAGE_STEP) {
    return (<div className="hide-on-desktop step-links-and-directions-container">{directionsSectionAndModal}</div>)
  }

  const links = []
  const numberOfLinks = ALL_STEPS.length

  // starting at 2 because we don't want to include the read passage step
  for (let i=2; i <= numberOfLinks; i++ ) {
    links.push(<StepLink activeStep={activeStep} clickStepLink={clickStepLink} completedSteps={completedSteps} index={i} renderStepNumber={renderStepNumber} />)
  }

  return (<div className="hide-on-desktop step-links-and-directions-container">
    <div className="step-link-container">
      <div className="step-links">
        {links}
      </div>
      <button className="interactive-wrapper focus-on-light" onClick={scrollToQuestionSectionOnMobile} type="button">View questions</button>
    </div>
    {directionsSectionAndModal}
  </div>)
}

export const renderPromptSteps = ({
  activateStep,
  completeStep,
  submitResponse,
  closeReadTheDirectionsModal,
  activities,
  session,
  activeStep,
  completedSteps,
  doneHighlighting,
  showReadTheDirectionsModal,
  stepsHash,
  reportAProblem,
}) => {
  const { currentActivity, } = activities
  const { submittedResponses, hasReceivedData, } = session
  if (!currentActivity || !hasReceivedData) return

  // sort by conjunctions in alphabetical order: because, but, so
  const steps =  orderedSteps(activities).map((prompt, i) => {
    // using i + 2 because the READ_PASSAGE_STEP is 1, so the first item in the set of prompts will always be 2
    const stepNumber = i + 2
    const canBeClicked = completedSteps.includes(stepNumber - 1) || completedSteps.includes(stepNumber) // can click on completed steps or the one after the last completed

    return (<PromptStep
      activateStep={activateStep}
      active={stepNumber === activeStep}
      canBeClicked={canBeClicked}
      className={`step ${canBeClicked ? 'clickable' : ''} ${activeStep === stepNumber ? 'active' : ''}`}
      completeStep={completeStep}
      everyOtherStepCompleted={everyOtherStepCompleted(stepNumber, completedSteps)}
      key={stepNumber}
      passedRef={stepsHash[`step${stepNumber}`]} // eslint-disable-line react/jsx-no-bind
      prompt={prompt}
      reportAProblem={reportAProblem}
      stepNumber={stepNumber}
      stepNumberComponent={renderStepNumber(stepNumber, activeStep, completedSteps)}
      submitResponse={submitResponse}
      submittedResponses={(submittedResponses && submittedResponses[prompt.id]) || []}
    />)
  })

  return (<div className="prompt-steps">
    {renderDirectionsSectionAndModal({ className: 'hide-on-mobile', closeReadTheDirectionsModal, activeStep, doneHighlighting, showReadTheDirectionsModal, activities })}
    {steps}
  </div>)
}

export const renderReadPassageContainer = ({
  activities,
  activeStep,
  handleReadPassageContainerScroll,
  hasStartedPromptSteps,
  hasStartedReadPassageStep,
  scrolledToEndOfPassage,
  showReadTheDirectionsModal,
  transformMarkTags
 }) => {
  const { currentActivity, } = activities
  if (!currentActivity) { return }

  const { title, passages, } = currentActivity
  const headerImage = passages[0].image_link && <img alt={passages[0].image_alt_text} className="header-image" src={passages[0].image_link} />
  let innerContainerClassName = "read-passage-inner-container "
  innerContainerClassName += !hasStartedReadPassageStep || showReadTheDirectionsModal || (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps) ? 'blur' : ''

  if ((!hasStartedReadPassageStep || (activeStep > READ_PASSAGE_STEP && !hasStartedPromptSteps)) && onMobile()) {
    return
  }
  const formattedPassages = addPTagsToPassages(passages, scrolledToEndOfPassage)
  const formattedPassage = formattedPassages ? formattedPassages[0] : '';
  return (<div className="read-passage-container" onScroll={handleReadPassageContainerScroll}>
    <div className={innerContainerClassName}>
      <h1 className="title">{title}</h1>
      <HeaderImage headerImage={headerImage} passage={passages[0]} />
      <div className="passage">{ReactHtmlParser(formattedPassage, { transform: transformMarkTags })}</div>
    </div>
  </div>)
}
