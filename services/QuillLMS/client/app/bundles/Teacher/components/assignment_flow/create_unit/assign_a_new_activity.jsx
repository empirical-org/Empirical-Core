import React from 'react'

import AssignmentCard from './assignment_card'

import { requestPost, } from '../../../../../modules/request'
import { CLICKED_ACTIVITY_PACK_ID } from '../assignmentFlowConstants'

const diagnosticWaveSrc = `${process.env.CDN_URL}/images/illustrations/diagnostic-wave.svg`
const activityLibrarySrc = `${process.env.CDN_URL}/images/icons/icons-activity-library.svg`
const activityPacksSrc = `${process.env.CDN_URL}/images/icons/icons-activity-packs.svg`
const allDiagnosticsSrc = `${process.env.CDN_URL}/images/icons/icons-diagnostics-all.svg`
const graduationCapSrc = `${process.env.CDN_URL}/images/icons/icons-graduation-cap.svg`
const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`

const minis = (diagnosticBannerShowing) => [
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: "Have students complete a short writing assessment, and we'll generate a set of practice activities for each student based on the results.", },
      { key: 'When', text: "You want data on what each student needs to practice, or you'd like Quill to recommend activities for your students.", }
    ]}
    header="Assess student writing with a diagnostic"
    imgAlt="page with writing and a magnifying glass over it"
    imgSrc={allDiagnosticsSrc}
    key="diagnostic"
    selectCard={() => window.location.href = '/assign/diagnostic'}
    showRecommendedToStartTag={diagnosticBannerShowing}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: "Search our entire library of activities to find exactly what your students need and build your own custom activity packs.", },
      { key: 'When', text: "You know which skills you want your students to practice, or you'd like to browse all our activities before assigning a diagnostic.", }
    ]}
    header="Explore all activities in our activity library"
    imgAlt="web page with the layout of the Quill Activity Library"
    imgSrc={activityLibrarySrc}
    key="activity-library"
    selectCard={() => window.location.href = '/assign/activity-library'}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Explore pre-created activity packs where activities are grouped together by skill and practice is scaffolded within each pack.', },
      { key: 'When', text: 'You want to quickly assign key practice, or you want to see how our teacher-led lessons pair with related independent practice.', }
    ]}
    header="Browse featured activity packs"
    imgAlt="four sheets of paper on top of each other"
    imgSrc={activityPacksSrc}
    key="activity-type"
    selectCard={() => window.location.href = '/assign/activity-type'}
  />),
  (<AssignmentCard
    bodyArray={[
      { key: 'What', text: 'Find activities focused on key SpringBoard, Pre-AP, and AP writing skills, as well as in-content activities based on Pre-AP texts.', },
      { key: 'When', text: "You're a SpringBoard, Pre-AP, or AP teacher, or you're interested in using Pre-AP or AP materials with your high school students." }
    ]}
    header="View SpringBoard, Pre-AP, and AP activities"
    imgAlt="graduation cap"
    imgClassName="graduation-cap"
    imgSrc={graduationCapSrc}
    key="college-board"
    selectCard={() => window.location.href = '/assign/college-board'}
  />)
];


const AssignANewActivity = ({ numberOfActivitiesAssigned, showDiagnosticBanner }) => {
  const [diagnosticBannerShowing, setDiagnosticBannerShowing] = React.useState(showDiagnosticBanner)

  React.useState(() => {
    // remove any previously stored activityPackId used for back navigation element focus in the event that user assigned pack or navigated back to dashboard before assigning
    window.sessionStorage.removeItem(CLICKED_ACTIVITY_PACK_ID);
  }, []);

  function closeDiagnosticBanner() {
    setDiagnosticBannerShowing(false)

    requestPost('/milestones/complete_acknowledge_diagnostic_banner')
  }

  let diagnosticBanner

  if (diagnosticBannerShowing) {
    diagnosticBanner = (<section className="diagnostic-banner">
      <img alt="waving hand over paper with magnifying glass on it" src={diagnosticWaveSrc} />
      <div className="text">
        <h2>We see you&#39;re new here! Try starting with a diagnostic.</h2>
        <p>We recommend that when teachers start using Quill, they first assign a diagnostic to assess their students&#39; needs. Then, we&#39;ll provide each student a personalized learning plan of recommended activities based on their performance.</p>
      </div>
      <button className="interactive-wrapper" onClick={closeDiagnosticBanner}>
        <img alt="X" src={closeIconSrc} />
      </button>
    </section>)
  }

  return (
    <div className="assign-a-new-activity-container">
      <div className="assign-a-new-activity container">
        <h1>Find the perfect writing activities for your students.</h1>
        <p className="previously-assigned-activities">
          You have {numberOfActivitiesAssigned} {numberOfActivitiesAssigned === 1 ? 'activity' : 'activities'} assigned.&nbsp;
          <button className="view-assigned-activities" type="button"><a href="/teachers/classrooms/activity_planner">View assigned activities</a></button>
        </p>
        {diagnosticBanner}
        <div className="minis">{minis(diagnosticBannerShowing)}</div>
      </div>
    </div>
  )
}

export default AssignANewActivity
