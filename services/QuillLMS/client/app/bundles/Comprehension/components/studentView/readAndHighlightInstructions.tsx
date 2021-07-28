import * as React from 'react'

import DisplayStudentHighlight from './displayStudentHighlight'
import DirectionsSectionAndModal from './directionsSectionAndModal'

import { cursorClick, cursorPointingHand, } from '../../../Shared/index'

const HighlightInstructions = () => (
  <div className="highlight-instructions">
    <h4>How to highlight</h4>
    <div className="highlight-instruction one">
      <h5 className="highlight-instruction-header">
        <span className="highlight-instruction-number">1</span>
        <span>Hover over a sentence</span>
      </h5>
      <img alt={cursorPointingHand.src} src={cursorPointingHand.src} />
      <p>
        <span className="student-highlight hover">Yellowstone National Park was established in 1872 as the first national park in the United States.</span> It spans across areas in Wyoming, Idaho, and Montana. Yellowstone is extremely special and famous because it is located on a dormant volcano.
      </p>
    </div>
    <div className="highlight-instruction two">
      <h5 className="highlight-instruction-header">
        <span className="highlight-instruction-number">2</span>
        <span>Click, tap, or select the sentence</span>
      </h5>
      <img alt={cursorClick.src} src={cursorClick.src} />
      <p>
        <span className="student-highlight">Yellowstone National Park was established in 1872 as the first national park in the United States.</span> It spans across areas in Wyoming, Idaho, and Montana. Yellowstone is extremely special and famous because it is located on a dormant volcano.
      </p>
    </div>
  </div>
)

const ReadAndHighlightInstructions = ({ passage, activeStep, showReadTheDirectionsModal, closeReadTheDirectionsModal, studentHighlights, removeHighlight, }) => {
  let studentHighlightsOrHighlightInstructions = <HighlightInstructions />
  let readAndHighlightContainerClassName = 'read-and-highlight-container hide-on-mobile'
  if (studentHighlights.length) {
    studentHighlightsOrHighlightInstructions = studentHighlights.map(sh => <DisplayStudentHighlight key={sh} removeHighlight={removeHighlight} studentHighlight={sh} />)
    readAndHighlightContainerClassName = 'read-and-highlight-container'
  }
  return (<div className={readAndHighlightContainerClassName}>
    <DirectionsSectionAndModal className="hide-on-mobile" closeReadTheDirectionsModal={closeReadTheDirectionsModal} passage={passage} showReadTheDirectionsModal={showReadTheDirectionsModal} />
    <section className="highlight-section">
      <h3>Highlights</h3>
      {studentHighlightsOrHighlightInstructions}
    </section>
  </div>)
}

export default ReadAndHighlightInstructions
