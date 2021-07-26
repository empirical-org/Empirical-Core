import * as React from 'react'

import { DEFAULT_HIGHLIGHT_PROMPT, } from '../../../Shared/utils/constants'
import { cursorClick, cursorPointingHand, } from '../../../Shared/index'

const ReadTheDirectionsModal = ({ closeReadTheDirectionsModal, }) => (<section className="read-the-directions-modal">
  <p>Read the directions carefully before moving onto reading and highlighting.</p>
  <button className="quill-button primary contained large focus-on-light" onClick={closeReadTheDirectionsModal} type="button">Got it</button>
</section>)

const ReadAndHighlightInstructions = ({ passage, activeStep, showReadTheDirectionsModal, closeReadTheDirectionsModal, resetTimers, }) => {
  const uniquePartOfHighlightPrompt = passage.highlight_prompt.replace(DEFAULT_HIGHLIGHT_PROMPT, '')
  return (<div className="read-and-highlight-container">
    {showReadTheDirectionsModal && <ReadTheDirectionsModal closeReadTheDirectionsModal={closeReadTheDirectionsModal} />}
    <section className="directions-section">
      <h3>Directions</h3>
      <p>{DEFAULT_HIGHLIGHT_PROMPT}<u>{uniquePartOfHighlightPrompt}</u></p>
    </section>
    <section className="highlight-section">
      <h3>Highlights</h3>
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
    </section>
  </div>)
}

export default ReadAndHighlightInstructions
