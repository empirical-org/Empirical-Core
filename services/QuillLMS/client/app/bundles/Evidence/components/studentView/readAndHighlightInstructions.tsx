import * as React from 'react'

import DisplayStudentHighlight from './displayStudentHighlight'
import DirectionsSection from './directionsSection'

const ReadAndHighlightInstructions = ({ passage, activeStep, showReadTheDirectionsButton, handleReadTheDirectionsButtonClick, studentHighlights, removeHighlight, inReflection, }) => {
  let studentHighlightsOrHighlightInstructions = (
    <div className="highlight-instructions">
      <p>Your highlights will appear here.</p>
    </div>
  )
  let readAndHighlightContainerClassName = 'read-and-highlight-container hide-on-mobile'
  if (studentHighlights.length) {
    studentHighlightsOrHighlightInstructions = studentHighlights.map(sh => (
      <DisplayStudentHighlight
        inReflection={inReflection}
        key={sh}
        removeHighlight={removeHighlight}
        studentHighlight={sh}
      />)
    )
    readAndHighlightContainerClassName = 'read-and-highlight-container'
  }
  return (<div className={readAndHighlightContainerClassName}>
    <DirectionsSection
      activeStep={activeStep}
      className="hide-on-mobile"
      inReflection={inReflection}
      passage={passage}
      showReadTheDirectionsButton={showReadTheDirectionsButton}
    />
    <section className="highlight-section">
      <h3>Highlights</h3>
      {studentHighlightsOrHighlightInstructions}
    </section>
  </div>)
}

export default ReadAndHighlightInstructions
