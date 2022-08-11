import * as React from 'react'
import ReactJoyride, { CallBackProps, STATUS, Step } from 'react-joyride';

import useWindowSize from '../../../Shared/hooks/useWindowSize'
import { requestGet } from '../../../../modules/request/index';

export const DASHBOARD = 'demo-onboarding-dashboard'
export const STUDENT_REPORTS_LANDING_PAGE = 'demo-onboarding-student-reports-landing-page'
export const DIAGNOSTIC_ACTIVITY_PACKS_INDEX = 'demo-onboarding-diagnostic-activity-packs-index'
export const DIAGNOSTIC_RESULTS_SUMMARY = 'demo-onboarding-diagnostic-results-summary'
export const DIAGNOSTIC_RECOMMENDATIONS = 'demo-onboarding-diagnostic-recommendations'
export const DIAGNOSTIC_GROWTH_SUMMARY = 'demo-onboarding-diagnostic-growth-summary'
const COMPLETED = 'completed'

const sharedStepAttributes = {
  disableBeacon: true,
  hideCloseButton: true,
  hideFooter: true,
  spotlightClicks: true
}

const dashboardSteps = [
  {
    ...sharedStepAttributes,
    content: (<div>
      <p>To get started with the demo, we&#39;re going to show you what data you will see once students complete a diagnostic.</p>
      <br />
      <p><strong>Click on &#34;Student Reports&#34; to go to the student data reports.</strong></p>
    </div>),
    placement: 'bottom',
    target: '#student-reports-link',
  }
]

const studentReportsLandingPageSteps = [
  {
    ...sharedStepAttributes,
    content: (<div>
      <p><strong>Click on the &#34;Diagnostics&#34; section to view the sample results of the diagnostic.</strong></p>
      <br />
      <p>The Student Reports page lets you access all results. For example, Activity Analysis lets you see each student&#39;s writing for each activity.</p>
    </div>),
    placement: 'top',
    target: '#diagnostic-reports-card',
  }
]

const diagnosticActivityPacksIndexSteps = [
  {
    ...sharedStepAttributes,
    content: (<div>
      <p>Teachers use the &#34;Pre&#34; diagnostic to see their students`&#39; needs and areas of growth at the start of the year. They use the &#34;Post&#34; at the end to measure growth. </p>
      <br />
      <p><strong>Click on &#34;View results and recommendations&#34; to see the pre-intervention results. </strong></p>
    </div>),
    placement: 'bottom',
    target: '.pre-and-post-wrapper a',
  }
]

const diagnosticResultsSummarySteps = [
  {
    ...sharedStepAttributes,
    content: (<div>
      <p>You&#39;re on the &#34;Class Summary&#34; page now, which shows you the overall performance of your classroom.</p>
      <br />
      <p><strong>From here, click on &#34;Practice Recommendations&#34; to see the specific recommendations for each student.</strong></p>
    </div>),
    placement: 'right',
    target: '.recommendations-link',
  }
]

const diagnosticRecommendationsSteps = [
  {
    ...sharedStepAttributes,
    content: (<div>
      <p>This is the <strong>Diagnostic Recommendations</strong> report.</p>
      <br />
      <p><strong>Recommended Practice:</strong> Once students complete the diagnostic, each skill that students are not yet proficient in will have a green star next to it as a recommended practice activity.</p>
      <br />
      <p><strong>Instant Assignments:</strong> With one click, you can automatically assign the recommended practice activities to your students, and they will be available to your students on their dashboards.</p>
    </div>),
    hideFooter: false,
    spotlightClicks: false,
    placement: 'top',
    target: '#demo-onboarding-tour-spotlight-element',
  },
  {
    ...sharedStepAttributes,
    content: (<div>
      <p>Once students complete the &#34;Post-intervention&#34; diagnostic, you can see their learning gains over the course of the year.</p>
      <br />
      <p><strong>Click here to view the class learning gains summary.</strong></p>
    </div>),
    placement: 'right',
    target: '.diagnostic-section:nth-of-type(2) .summary-link',
  }
]

const diagnosticGrowthSummarySteps = [
  {
    ...sharedStepAttributes,
    content: (<div>
      <p>This is the class summary of the <strong>Growth Report</strong>. This page shows the overall learning gains for your class. </p>
      <br />
      <p>You can also see the learning gains for each individual student.</p>
      <br />
      <p>Finally, you can assign additional recommended activities based on skills students need additional practice with.</p>
    </div>),
    placement: 'top',
    target: '.skill-group-summary-cards',
  }
]

const joyrideSteps = {
  [DASHBOARD]: dashboardSteps,
  [STUDENT_REPORTS_LANDING_PAGE]: studentReportsLandingPageSteps,
  [DIAGNOSTIC_ACTIVITY_PACKS_INDEX]: diagnosticActivityPacksIndexSteps,
  [DIAGNOSTIC_RESULTS_SUMMARY]: diagnosticResultsSummarySteps,
  [DIAGNOSTIC_RECOMMENDATIONS]: diagnosticRecommendationsSteps,
  [DIAGNOSTIC_GROWTH_SUMMARY]: diagnosticGrowthSummarySteps
}

const DemoOnboardingTour = ({ pageKey, }) => {
  const size = useWindowSize();

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
    requestGet('/teachers/demo_id',
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
      continuous={steps?.length > 1}
      disableScrolling={true}
      hideBackButton
      hideCloseButton
      run={run}
      steps={steps}
      styles={{ tooltipContent: { textAlign: 'left' }, options: { primaryColor: '#06806b'}, tooltip: { fontSize: '14px'} }}
    />
  )
}

export default DemoOnboardingTour
