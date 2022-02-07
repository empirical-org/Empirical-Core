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
  handleReadTheDirectionsButtonClick,
  session,
  completedSteps,
  doneHighlighting,
  resetTimers,
  showReadTheDirectionsButton,
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
          handleReadTheDirectionsButtonClick,
          activities,
          session,
          activeStep,
          completedSteps,
          doneHighlighting,
          showReadTheDirectionsButton,
          reportAProblem,
        })}
      </div>
    </div>
  )
}

export default Steps;
