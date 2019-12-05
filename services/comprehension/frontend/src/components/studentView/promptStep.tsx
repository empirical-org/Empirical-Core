import * as React from 'react'

interface PromptStepProps {
 className: string,
 stepNumberComponent: JSX.Element,
 text: string,
 passedRef: any,
}

const PromptStep = ({ className, stepNumberComponent, text, passedRef }:PromptStepProps) => {
  const allButLastWordOfPrompt = text.substring(0, text.lastIndexOf(' '))
  const lastWordOfPrompt = text.split(' ').splice(-1)
  const promptTextComponent = <p className="prompt-text">{allButLastWordOfPrompt} <span>{lastWordOfPrompt}</span></p>
  return (<div className={className} ref={passedRef}>
    {stepNumberComponent}
    <div className="step-content">
      <p className="directions">Use information from the text to finish the sentence:</p>
      {promptTextComponent}
    </div>
  </div>)
}

export default PromptStep
