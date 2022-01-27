import * as React from 'react'

import { DEFAULT_HIGHLIGHT_PROMPT, } from '../../../Shared/utils/constants'

const READ_PASSAGE_STEP = 1

const defaultDirections = (className) => (
  <section className="directions-section">
    <h3>Directions</h3>
    <ul>
      <li>Use information from the text to finish the sentence.</li>
      <li>Put the information in your own words.</li>
    </ul>
  </section>
)


const DirectionsSection = ({ className, passage, inReflection, activeStep, }) => {
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
    return defaultDirections(className)
  }

  return (<div className={className}>
    {defaultDirections(className)}
    <section className="task-section">
      <h3>Task</h3>
      <p>{DEFAULT_HIGHLIGHT_PROMPT}<u>{uniquePartOfHighlightPrompt}</u></p>
    </section>
  </div>)
}

export default DirectionsSection
