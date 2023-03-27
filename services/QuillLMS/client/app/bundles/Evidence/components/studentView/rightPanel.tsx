import * as React from 'react';

import BottomNavigation from './bottomNavigation';
import ReadAndHighlightInstructions from './readAndHighlightInstructions';
import StepOverview from './stepOverview';
import Steps from './steps';

import { READ_PASSAGE_STEP } from '../../helpers/containerActionHelpers';

const RightPanel = ({
  activities,
  activateStep,
  activeStep,
  activityIsComplete,
  handleReadTheDirectionsButtonClick,
  completeStep,
  completedSteps,
  completionButtonCallback,
  doneHighlighting,
  handleClickDoneHighlighting,
  handleDoneReadingClick,
  hasStartedPromptSteps,
  hasStartedReadPassageStep,
  onStartPromptSteps,
  onStartReadPassage,
  reportAProblem,
  resetTimers,
  scrolledToEndOfPassage,
  session,
  showReadTheDirectionsButton,
  showStepsSummary,
  studentHighlights,
  submitResponse,
  toggleShowStepsSummary,
  toggleStudentHighlight,
}) => {

  const bottomNavigation = (<BottomNavigation
    doneHighlighting={doneHighlighting}
    handleClickDoneHighlighting={handleClickDoneHighlighting}
    handleDoneReadingClick={handleDoneReadingClick}
    handleReadTheDirectionsButtonClick={handleReadTheDirectionsButtonClick}
    handleStartPromptStepsClick={onStartPromptSteps}
    handleStartReadingPassageClick={onStartReadPassage}
    hasStartedPromptSteps={hasStartedPromptSteps}
    hasStartedReadPassageStep={hasStartedReadPassageStep}
    inReflection={doneHighlighting && activeStep === READ_PASSAGE_STEP}
    scrolledToEndOfPassage={scrolledToEndOfPassage}
    showReadTheDirectionsButton={showReadTheDirectionsButton}
    showStepsSummary={showStepsSummary}
    studentHighlights={studentHighlights}
    toggleShowStepsSummary={toggleShowStepsSummary}
  />)

  if (!hasStartedReadPassageStep) {
    return (
      <div className="steps-outer-container step-overview-container" onScroll={resetTimers}>
        <StepOverview
          activeStep={activeStep}
          handleClick={onStartReadPassage}
        />
        {bottomNavigation}
      </div>
    )
  }

  if (activeStep === READ_PASSAGE_STEP) {
    return (
      <div className="steps-outer-container" onScroll={resetTimers}>
        <ReadAndHighlightInstructions
          activeStep={activeStep}
          inReflection={doneHighlighting && activeStep === READ_PASSAGE_STEP}
          passage={activities.currentActivity.passages[0]}
          removeHighlight={toggleStudentHighlight}
          studentHighlights={studentHighlights}
        />
        {bottomNavigation}
      </div>
    )
  }

  if (!hasStartedPromptSteps) {
    return (
      <div className="steps-outer-container step-overview-container" onScroll={resetTimers}>
        <StepOverview
          activeStep={activeStep}
          handleClick={onStartPromptSteps}
        />
        {bottomNavigation}
      </div>
    )
  }

  if (showStepsSummary) {
    return (
      <div className="steps-outer-container step-overview-container" onScroll={resetTimers}>
        <StepOverview
          activeStep={activeStep}
          handleClick={toggleShowStepsSummary}
        />
        {bottomNavigation}
      </div>
    )
  }

  return(
    <Steps
      activateStep={activateStep}
      activeStep={activeStep}
      activities={activities}
      activityIsComplete={activityIsComplete}
      completedSteps={completedSteps}
      completeStep={completeStep}
      completionButtonCallback={completionButtonCallback}
      doneHighlighting={doneHighlighting}
      handleDoneReadingClick={handleDoneReadingClick}
      handleReadTheDirectionsButtonClick={handleReadTheDirectionsButtonClick}
      reportAProblem={reportAProblem}
      resetTimers={resetTimers}
      session={session}
      showReadTheDirectionsButton={showReadTheDirectionsButton}
      submitResponse={submitResponse}

    />
  )
}

export default RightPanel;
