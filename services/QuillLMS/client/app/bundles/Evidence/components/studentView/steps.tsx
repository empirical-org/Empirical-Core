import * as React from 'react';

import { renderReadPassageStep, renderPromptStep } from '../../helpers/containerRenderHelpers';

const Steps = ({
  activeStep,
  activateStep,
  activities,
  activityIsComplete,
  handleDoneReadingClick,
  completionButtonCallback,
  completeStep,
  submitResponse,
  closeReadTheDirectionsModal,
  session,
  completedSteps,
  doneHighlighting,
  resetTimers,
  showReadTheDirectionsModal,
  reportAProblem,
}) => {
  return(
    <div className="steps-outer-container" onScroll={resetTimers}>
      <div className="steps-inner-container" onScroll={resetTimers}>
        {renderReadPassageStep(activeStep, activities, handleDoneReadingClick)}
        {renderPromptStep({
          activateStep,
          activityIsComplete,
          completionButtonCallback,
          completeStep,
          submitResponse,
          closeReadTheDirectionsModal,
          activities,
          session,
          activeStep,
          completedSteps,
          doneHighlighting,
          showReadTheDirectionsModal,
          reportAProblem,
        })}
      </div>
    </div>
  )
}

export default Steps;
