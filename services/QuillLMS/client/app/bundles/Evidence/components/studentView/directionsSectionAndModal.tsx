import * as React from 'react'

import { DEFAULT_HIGHLIGHT_PROMPT, } from '../../../Shared/utils/constants'

const READ_PASSAGE_STEP = 1

const ReadTheDirectionsModal = ({ closeReadTheDirectionsModal, }) => (<section className="read-the-directions-modal">
  <p>Read the directions carefully before moving onto reading and highlighting.</p>
  <button className="quill-button primary contained large focus-on-light" onClick={closeReadTheDirectionsModal} type="button">Got it</button>
</section>)


const DirectionsSectionAndModal = ({ className, closeReadTheDirectionsModal, passage, showReadTheDirectionsModal, inReflection, activeStep, }) => {
  const uniquePartOfHighlightPrompt = passage.highlight_prompt ? passage.highlight_prompt.replace(DEFAULT_HIGHLIGHT_PROMPT, '') : ''
  if (inReflection) {
    return (<div className={className}>
      <section className="reflection-section">
        <h3>Directions</h3>
        <p>Great! <u>Now take a moment to reflect on the sentences you highlighted.</u></p>
      </section>
    </div>)
  }

  if (activeStep > READ_PASSAGE_STEP) {
    return (<div className={className}>
      <section className="directions-section">
        <h3>Directions</h3>
        <p>Use information from the text to finish the sentence. <u>Remember to put the response in your own words.</u></p>
      </section>
    </div>)
  }

  return (<div className={className}>
    {showReadTheDirectionsModal ? <ReadTheDirectionsModal closeReadTheDirectionsModal={closeReadTheDirectionsModal} /> : <span />}
    <section className="directions-section">
      <h3>Directions</h3>
      <p>{DEFAULT_HIGHLIGHT_PROMPT}<u>{uniquePartOfHighlightPrompt}</u></p>
    </section>
  </div>)
}

export default DirectionsSectionAndModal
