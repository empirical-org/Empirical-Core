import * as React from 'react'

import { DEFAULT_HIGHLIGHT_PROMPT, } from '../../../Shared/utils/constants'
import { informationIcon } from '../../../Shared/index'

const READ_PASSAGE_STEP = 1
const promptDirections = [<li>Use information from the text to finish the sentence.</li>, <li>Put the information in your own words.</li>]
const highlightDirections = [<li>First, read the highlighting task below.</li>, <li>Then, read the text and highlight sentences to complete the task.</li>, <li className="sr-only">Screenreader users, please use your tab keys to navigate through the passage. Use the Enter key on a focused sentence to add it to your highlights or to remove it once it has already been highlighted.</li>]

const renderDirections = (directionElementsArray: JSX.Element[]) => (
  <section className="directions-section">
    <h3>Directions</h3>
    <ul>
      {directionElementsArray}
    </ul>
  </section>
)

const essentialKnowledgeSection = ({ essential_knowledge_text }) => {
  if(!essential_knowledge_text || essential_knowledge_text === '<br/>') { return }

  return (
    <div className="essential-knowledge-section">
      <div className="essential-knowledge-header">
        <img alt={informationIcon.alt} src={informationIcon.src} />
        <h3>Building Essential Knowledge</h3>
      </div>
      <div className="essential-knowledge" dangerouslySetInnerHTML={{ __html: essential_knowledge_text }} />
    </div>
  )
}

const DirectionsSection = ({ className, passage, inReflection, activeStep, }) => {
  const uniquePartOfHighlightPrompt = passage.highlight_prompt ? passage.highlight_prompt.replace(DEFAULT_HIGHLIGHT_PROMPT, '') : ''
  if (inReflection) {
    return (
      <div className={className}>
        <section className="reflection-section">
          <h3>Directions</h3>
          <p>Great! Now take a moment to reflect on the sentences you highlighted. The ideas you highlighted may be helpful as you complete the writing prompts in the next section.</p>
        </section>
      </div>
    )
  }

  if (activeStep > READ_PASSAGE_STEP) {
    return renderDirections(promptDirections)
  }

  return (
    <div className={className}>
      {renderDirections(highlightDirections)}
      <section className="task-section">
        <h3>Task</h3>
        <p>{DEFAULT_HIGHLIGHT_PROMPT}<u>{uniquePartOfHighlightPrompt}</u></p>
      </section>
      {essentialKnowledgeSection(passage)}
    </div>
  )
}

export default DirectionsSection
