import * as React from 'react'

import DisplayStudentHighlight from './displayStudentHighlight'
import DirectionsSection from './directionsSection'

import { helpIcon, Tooltip } from '../../../Shared/index'
import useFocus from '../../../Shared/hooks/useFocus'

const ReadAndHighlightInstructions = ({ passage, activeStep, studentHighlights, removeHighlight, inReflection, }) => {
  const [containerRef, setContainerFocus] = useFocus()

  function handleRemoveHighlightClick(highlightText) {
    removeHighlight(highlightText, setContainerFocus)
  }

  let studentHighlightsOrHighlightInstructions = (
    <div className="highlight-instructions">
      <p>Your highlights will appear here.</p>
    </div>
  )
  let readAndHighlightContainerClassName = 'read-and-highlight-container hide-on-mobile no-focus-outline'
  const tooltipTrigger = <img alt={helpIcon.alt} src={helpIcon.src} />
  const tooltipText = "<p>How to highlight:</p><br/><p>Step 1 - Hover over a sentence</p><br/><p>Step 2 - Click, tap, or select the sentence</p><br/><p>If you change your mind about something you've highlighted, click, tap, or deselect the sentence again to remove the highlight.</p>"

  if (studentHighlights.length) {
    studentHighlightsOrHighlightInstructions = studentHighlights.map(sh => (
      <DisplayStudentHighlight
        inReflection={inReflection}
        key={sh}
        removeHighlight={handleRemoveHighlightClick}
        studentHighlight={sh}
      />)
    )
    readAndHighlightContainerClassName = 'read-and-highlight-container'
  }
  return (
    <div className={readAndHighlightContainerClassName} ref={containerRef} tabIndex={-1}>
      <DirectionsSection
        activeStep={activeStep}
        className="hide-on-mobile"
        inReflection={inReflection}
        passage={passage}
      />
      <section className="highlight-section">
        <div className="highlight-label-section">
          <h3>Highlights</h3>
          <Tooltip
            tooltipText={tooltipText}
            tooltipTriggerText={tooltipTrigger}
          />
        </div>
        {studentHighlightsOrHighlightInstructions}
      </section>
    </div>
  )
}

export default ReadAndHighlightInstructions
