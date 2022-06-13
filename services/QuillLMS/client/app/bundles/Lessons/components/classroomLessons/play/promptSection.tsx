import * as React from 'react'

import { PROJECT } from './constants'

const PromptSection = ({ promptElement, mode, }) => {
  if (mode !== PROJECT) { return promptElement }

  const [showPrompt, setShowPrompt] = React.useState<boolean>(true);

  const handleShowPromptButtonClick = () => {
    setShowPrompt(!showPrompt)
  }

  if (showPrompt) {
    return (
      <React.Fragment>
        {promptElement}
        <div className="display-answers-divider prompt-showing">
          <div className="display-answers-divider-content">
            <button className="focus-on-light" onClick={handleShowPromptButtonClick} type="button">Hide</button>
          </div>
        </div>
      </React.Fragment>
    )
  }

  return (
    <div className="display-answers-divider prompt-hidden">
      <div className="display-answers-divider-content">
        <button className="focus-on-light" onClick={handleShowPromptButtonClick} type="button">Show</button>
      </div>
    </div>
  )
}

export default PromptSection
