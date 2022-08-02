import * as React from 'react'
import ReactJoyride, { CallBackProps, STATUS, Step } from 'react-joyride';

import { requestGet } from '../../../../modules/request/index';

export const DASHBOARD = 'demo-onboarding-dashboard'
const COMPLETED = 'completed'

const dashboardSteps = [
  {
    content: (<div>
      <p>To get started with the demo, we&#39;re going to show you what data you will see once students complete a diagnostic.</p>
      <br />
      <p><strong>Click on &#34;Student Reports&#34; to go to the student data reports.</strong></p>
    </div>),
    placement: 'bottom',
    target: '#student-reports-link',
    disableBeacon: true,
    hideCloseButton: true,
    hideFooter: true,
    spotlightClicks: true
  }
]

const joyrideSteps = {
  [DASHBOARD]: dashboardSteps
}

const DemoOnboardingTour = ({ pageKey, }) => {
  const [isDemo, setIsDemo] = React.useState<boolean>(false)
  const [showTour, setShowTour] = React.useState<boolean>(false)
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
