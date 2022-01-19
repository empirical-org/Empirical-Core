import * as React from 'react';

import ReadAndHighlightInstructions from './readAndHighlightInstructions'
import BottomNavigation from './bottomNavigation'
import StepOverview from './stepOverview'
import Steps from './steps'

import { onMobile, READ_PASSAGE_STEP } from '../../helpers/containerActionHelpers';

const RightPanel = ({
  activities,
  activateStep,
  activeStep,
  activityIsComplete,
  closeReadTheDirectionsModal,
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
  showReadTheDirectionsModal,
  studentHighlights,
  submitResponse,
  toggleStudentHighlight,
}) => {

  const bottomNavigation = (<BottomNavigation
    doneHighlighting={doneHighlighting}
    handleClickDoneHighlighting={handleClickDoneHighlighting}
    handleDoneReadingClick={handleDoneReadingClick}
    handleStartPromptStepsClick={onStartPromptSteps}
    handleStartReadingPassageClick={onStartReadPassage}
    hasStartedPromptSteps={hasStartedPromptSteps}
    hasStartedReadPassageStep={hasStartedReadPassageStep}
    inReflection={doneHighlighting && activeStep === READ_PASSAGE_STEP}
    onMobile={onMobile()}
    scrolledToEndOfPassage={scrolledToEndOfPassage}
    studentHighlights={studentHighlights}
  />)

  if (!hasStartedReadPassageStep) {
    return (<div className="steps-outer-container step-overview-container" onScroll={resetTimers}>
      <StepOverview
        activeStep={activeStep}
        handleClick={onStartReadPassage}
      />
      {bottomNavigation}
    </div>)
  }

  if (activeStep === READ_PASSAGE_STEP) {
    return (
      <div className="steps-outer-container" onScroll={resetTimers}>
        <ReadAndHighlightInstructions
          activeStep={activeStep}
          closeReadTheDirectionsModal={closeReadTheDirectionsModal}
          inReflection={doneHighlighting && activeStep === READ_PASSAGE_STEP}
          passage={activities.currentActivity.passages[0]}
          removeHighlight={toggleStudentHighlight}
          showReadTheDirectionsModal={showReadTheDirectionsModal}
          studentHighlights={studentHighlights}
        />
        {bottomNavigation}
      </div>
    )
  }

  if (!hasStartedPromptSteps) {
    return (<div className="steps-outer-container step-overview-container" onScroll={resetTimers}>
      <StepOverview
        activeStep={activeStep}
        handleClick={onStartPromptSteps}
      />
      {bottomNavigation}
    </div>)
  }

  return(
    <Steps
      activateStep={activateStep}
      activeStep={activeStep}
      activities={activities}
      activityIsComplete={activityIsComplete}
      closeReadTheDirectionsModal={closeReadTheDirectionsModal}
      completedSteps={completedSteps}
      completeStep={completeStep}
      completionButtonCallback={completionButtonCallback}
      doneHighlighting={doneHighlighting}
      handleDoneReadingClick={handleDoneReadingClick}
      reportAProblem={reportAProblem}
      resetTimers={resetTimers}
      session={session}
      showReadTheDirectionsModal={showReadTheDirectionsModal}
      submitResponse={submitResponse}
    />
  )
}

export default RightPanel;
