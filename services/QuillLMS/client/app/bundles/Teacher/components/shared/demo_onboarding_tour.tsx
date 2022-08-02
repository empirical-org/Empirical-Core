import * as React from 'react'
import ReactJoyride, { CallBackProps, STATUS, Step } from 'react-joyride';

import { requestGet } from '../../../../modules/request/index';

export const DASHBOARD = 'demo-onboarding-dashboard'
export const STUDENT_REPORTS_LANDING_PAGE = 'demo-onboarding-student-reports-landing-page'
const COMPLETED = 'completed'

const sharedStepAttributes = {
  disableBeacon: true,
  hideCloseButton: true,
  hideFooter: true,
  spotlightClicks: true
}

const dashboardSteps = [
  {
    content: (<div>
      <p>To get started with the demo, we&#39;re going to show you what data you will see once students complete a diagnostic.</p>
      <br />
      <p><strong>Click on &#34;Student Reports&#34; to go to the student data reports.</strong></p>
    </div>),
    placement: 'bottom',
    target: '#student-reports-link',
    ...sharedStepAttributes
  }
]

const studentReportsLandingPageSteps = [
  {
    content: (<div>
      <p><strong>Click on the &#34;Diagnostics&#34; section to view the sample results of the diagnostic.</strong></p>
      <br />
      <p>The Student Reports page lets you access all results. For example, Activity Analysis lets you see each student&#39;s writing for each activity.</p>
    </div>),
    placement: 'top',
    target: '#diagnostic-reports-card',
    ...sharedStepAttributes
  }
]

const joyrideSteps = {
  [DASHBOARD]: dashboardSteps,
  [STUDENT_REPORTS_LANDING_PAGE]: studentReportsLandingPageSteps
}

const DemoOnboardingTour = ({ pageKey, }) => {
  const [isDemo, setIsDemo] = React.useState<boolean>(false)
  // TODO set showTour to false by default
  const [showTour, setShowTour] = React.useState<boolean>(true)
  const [{ run, steps }, setJoyrideState] = React.useState({
    run: true,
    steps: joyrideSteps[pageKey] || []
  })

  React.useEffect(getDemo, [])

  React.useEffect(() => {
    if (isDemo && !window.localStorage.getItem(pageKey)) {
      setShowTour(true)
      window.localStorage.setItem(pageKey, COMPLETED)
    }
  }, [isDemo])

  function getDemo() {
    requestGet('/teachers/is_demo',
      (data) => {
        setIsDemo(!!data.current_user_demo_id);
      }
    )
  }

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setJoyrideState({ ...steps, run: false });
    }
  };

  if (!showTour) { return <span /> }

  return (
    <ReactJoyride
      callback={handleJoyrideCallback}
      hideBackButton
      hideCloseButton
      run={run}
      steps={steps}
      styles={{ tooltipContent: { textAlign: 'left' } }}
    />
  )
}

export default DemoOnboardingTour
