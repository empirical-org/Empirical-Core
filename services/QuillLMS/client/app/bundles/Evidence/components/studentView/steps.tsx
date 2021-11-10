import * as React from 'react';

import { renderReadPassageStep, renderPromptSteps } from '../../helpers/containerRenderHelpers';

const Steps = ({
  activeStep,
  activateStep,
  activities,
  activityIsComplete,
  handleDoneReadingClick,
  completeStep,
  submitResponse,
  closeReadTheDirectionsModal,
  session,
  completedSteps,
  doneHighlighting,
  renderActivityFollowup,
  resetTimers,
  showReadTheDirectionsModal,
  stepsHash,
  reportAProblem,
}) => {
  function renderCompletionButton() {
    let className = 'quill-button focus-on-light'
    return(
      <button className={className} onClick={renderActivityFollowup} type="button"><span>{'Complete'}</span></button>
    )
  }

  return(
    <div className="steps-outer-container" onScroll={resetTimers}>
      <div className="steps-inner-container" onScroll={resetTimers}>
        {renderReadPassageStep(activeStep, activities, handleDoneReadingClick)}
        {renderPromptSteps({
          activateStep,
          completeStep,
          submitResponse,
          closeReadTheDirectionsModal,
          activities,
          session,
          activeStep,
          completedSteps,
          doneHighlighting,
          showReadTheDirectionsModal,
          stepsHash,
          reportAProblem,
        })}
        {activityIsComplete && renderCompletionButton()}
      </div>
    </div>
  )
}

export default Steps;
