import * as React from 'react'

import { bigCheckIcon, } from '../../../Shared/index'

const MINIMUM_STUDENT_HIGHLIGHT_COUNT = 2

const ReadAndHighlightTracker = ({
  scrolledToEndOfPassage,
  studentHighlights,
  handleClickDoneHighlighting,
  handleReadTheDirectionsButtonClick,
  showReadTheDirectionsButton
}) => {
  const minimumMet = studentHighlights.length >= MINIMUM_STUDENT_HIGHLIGHT_COUNT
  let doneButton = <button className="quill-button contained primary large focus-on-light disabled" onClick={handleClickDoneHighlighting} type="button">Done</button>
  if (scrolledToEndOfPassage && minimumMet) {
    doneButton = <button className="quill-button contained primary large focus-on-light" onClick={handleClickDoneHighlighting} type="button">Done</button>
  }
  if(showReadTheDirectionsButton) {
    return(
      <div className="read-and-highlight-tracker bottom-navigation read-instructions">
        <button aria-label="Next" className="quill-button contained primary large focus-on-light" onClick={handleReadTheDirectionsButtonClick} type="button">Got it</button>
      </div>
    )
  }
  return (
    <div className="read-and-highlight-tracker bottom-navigation">
      {doneButton}
      <div aria-hidden={true} className="read-and-highlight-steps">
        <div className="read-and-highlight-step">
          {scrolledToEndOfPassage ? <img alt={bigCheckIcon.alt} className="check-icon" src={bigCheckIcon.src} /> : <div className="incomplete-indicator" />}
          <span>Read the entire text</span>
        </div>
        <div className="read-and-highlight-step">
          {minimumMet ? <img alt={bigCheckIcon.alt} className="check-icon" src={bigCheckIcon.src} /> : <div className="incomplete-indicator" />}
          <span>Highlight two sentences</span>
        </div>
      </div>
    </div>
  )
}

const BottomNavigation = ({
  scrolledToEndOfPassage,
  studentHighlights,
  handleClickDoneHighlighting,
  handleReadTheDirectionsButtonClick,
  doneHighlighting,
  handleDoneReadingClick,
  hasStartedPromptSteps,
  hasStartedReadPassageStep,
  handleStartPromptStepsClick,
  handleStartReadingPassageClick,
  inReflection,
  showReadTheDirectionsButton,
  showStepsSummary,
  toggleShowStepsSummary
}) => {

  if (!hasStartedReadPassageStep) {
    return (
      <div className="bottom-navigation">
        <button className="quill-button outlined secondary large focus-on-dark" onClick={handleStartReadingPassageClick} type="button">Start</button>
      </div>
    )
  }

  if (hasStartedReadPassageStep && !doneHighlighting) {
    return (
      <ReadAndHighlightTracker
        handleClickDoneHighlighting={handleClickDoneHighlighting}
        handleReadTheDirectionsButtonClick={handleReadTheDirectionsButtonClick}
        scrolledToEndOfPassage={scrolledToEndOfPassage}
        showReadTheDirectionsButton={showReadTheDirectionsButton}
        studentHighlights={studentHighlights}
      />
    )
  }

  if (inReflection) {
    return (
      <div className="bottom-navigation">
        <button className="quill-button contained primary large focus-on-light" onClick={handleDoneReadingClick} type="button">Next</button>
      </div>
    )
  }

  if (!hasStartedPromptSteps) {
    return (
      <div className="bottom-navigation">
        <button className="quill-button outlined secondary large focus-on-dark" onClick={handleStartPromptStepsClick} type="button">Next</button>
      </div>
    )
  }

  if (showStepsSummary) {
    return (
      <div className="bottom-navigation">
        <button className="quill-button outlined secondary large focus-on-dark" onClick={toggleShowStepsSummary} type="button">Next</button>
      </div>
    )
  }
}

export default BottomNavigation
