import * as React from 'react'

import { bigCheckIcon, } from '../../../Shared/index'

const MINIMUM_STUDENT_HIGHLIGHT_COUNT = 2

const ReadAndHighlightTracker = ({ scrolledToEndOfPassage, studentHighlights, onMobile, handleClickDoneHighlighting, }) => {
  let doneButton = <button className="quill-button contained primary large focus-on-light disabled" type="button">Done</button>
  if (studentHighlights.length >= MINIMUM_STUDENT_HIGHLIGHT_COUNT) {
    doneButton = <button className="quill-button contained primary large focus-on-light" onClick={handleClickDoneHighlighting} type="button">Done</button>
  }
  return (
    <div className="read-and-highlight-tracker bottom-navigation">
      {doneButton}
      <div className="read-and-highlight-steps">
        <div className="read-and-highlight-step">
          {scrolledToEndOfPassage ? <img alt={bigCheckIcon.alt} className="check-icon" src={bigCheckIcon.src} /> : <div className="incomplete-indicator" />}
          <span>Read the entire passage</span>
        </div>
        <div className="read-and-highlight-step">
          {studentHighlights.length >= MINIMUM_STUDENT_HIGHLIGHT_COUNT ? <img alt={bigCheckIcon.alt} className="check-icon" src={bigCheckIcon.src} /> : <div className="incomplete-indicator" />}
          <span>Highlight{onMobile ? '': ' at least'} two sentences</span>
        </div>
      </div>
    </div>
  )
}

const BottomNavigation = ({ scrolledToEndOfPassage, studentHighlights, onMobile, handleClickDoneHighlighting, doneHighlighting, handleDoneReadingClick, }) => {
  if (doneHighlighting) {
    return (<div className="bottom-navigation">
      <button className="quill-button contained primary large focus-on-light" onClick={handleDoneReadingClick} type="button">Next</button>
    </div>)
  }

  return (<ReadAndHighlightTracker
    handleClickDoneHighlighting={handleClickDoneHighlighting}
    onMobile={onMobile}
    scrolledToEndOfPassage={scrolledToEndOfPassage}
    studentHighlights={studentHighlights}
  />)
}

export default BottomNavigation
