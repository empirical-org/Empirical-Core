import * as React from 'react'

import { DEFAULT_HIGHLIGHT_PROMPT, } from '../../../Shared/utils/constants'

const ReadTheDirectionsModal = ({ closeReadTheDirectionsModal, }) => (<section className="read-the-directions-modal">
  <p>Read the directions carefully before moving onto reading and highlighting.</p>
  <button className="quill-button primary contained large focus-on-light" onClick={closeReadTheDirectionsModal} type="button">Got it</button>
</section>)


const DirectionsSectionAndModal = ({ className, closeReadTheDirectionsModal, passage, showReadTheDirectionsModal, }) => {
  const uniquePartOfHighlightPrompt = passage.highlight_prompt.replace(DEFAULT_HIGHLIGHT_PROMPT, '')
  return (<div className={className}>
    {showReadTheDirectionsModal ? <ReadTheDirectionsModal closeReadTheDirectionsModal={closeReadTheDirectionsModal} /> : <span />}
    <section className="directions-section">
      <h3>Directions</h3>
      <p>{DEFAULT_HIGHLIGHT_PROMPT}<u>{uniquePartOfHighlightPrompt}</u></p>
    </section>
  </div>)
}

export default DirectionsSectionAndModal
