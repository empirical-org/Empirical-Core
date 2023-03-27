import * as React from 'react';

import PromptStepContainer from './promptStepContainer';

import { renderReadPassageStep } from '../../helpers/containerRenderHelpers';

const Steps = ({
  activeStep,
  activateStep,
  activities,
  activityIsComplete,
  handleDoneReadingClick,
  completionButtonCallback,
  completeStep,
  submitResponse,
  handleReadTheDirectionsButtonClick,
  session,
  completedSteps,
  doneHighlighting,
  resetTimers,
  showReadTheDirectionsButton,
  reportAProblem,
}) => {
  const promptStepContainerProps = {
    activateStep,
    activityIsComplete,
    completionButtonCallback,
    completeStep,
    submitResponse,
    handleReadTheDirectionsButtonClick,
    activities,
    session,
    activeStep,
    completedSteps,
    doneHighlighting,
    showReadTheDirectionsButton,
    reportAProblem,
  }
  return(
    <div className="steps-outer-container" onScroll={resetTimers}>
      <div className="steps-inner-container" onScroll={resetTimers}>
        {renderReadPassageStep(activeStep, activities, handleDoneReadingClick)}
        <PromptStepContainer {...promptStepContainerProps} />
      </div>
    </div>
  )
}

export default Steps;
