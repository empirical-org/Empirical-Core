import * as React from "react"

import PromptStep from './promptStep'

import { orderedSteps, } from '../../helpers/containerActionHelpers'
import { renderDirectionsSection, } from '../../helpers/containerRenderHelpers'
import useFocus from '../../../Shared/hooks/useFocus'

const PromptStepContainer = ({
  activateStep,
  activityIsComplete,
  completionButtonCallback,
  completeStep,
  submitResponse,
  activities,
  session,
  activeStep,
  doneHighlighting,
  reportAProblem,
}) => {
  const { currentActivity, } = activities
  const { submittedResponses, hasReceivedData, } = session

  if (!currentActivity || !hasReceivedData) return <span />

  // the first step is reading, so we will always start at 2 and therefore want to begin at the 0 index
  const stepNumber = activeStep - 2;
  const prompts = orderedSteps(activities);
  const prompt = prompts[stepNumber];

  const [containerRef, setContainerFocus] = useFocus()

  React.useEffect(() => {
    setContainerFocus()
  }, [])

  return (
    <div className="prompt-steps no-focus-outline" ref={containerRef} tabIndex={-1}>
      {renderDirectionsSection({ className: '', activeStep, doneHighlighting, activities })}
      <PromptStep
        activateStep={activateStep}
        activityIsComplete={activityIsComplete}
        className="step active"
        completeStep={completeStep}
        completionButtonCallback={completionButtonCallback}
        key={activeStep}
        prompt={prompt}
        reportAProblem={reportAProblem}
        stepNumber={activeStep}
        submitResponse={submitResponse}
        submittedResponses={(submittedResponses && submittedResponses[prompt.id]) || []}
      />
    </div>
  )
}

export default PromptStepContainer
