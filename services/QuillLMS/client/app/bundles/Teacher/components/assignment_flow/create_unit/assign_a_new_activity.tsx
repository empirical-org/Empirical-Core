import * as React from 'react'

import AssignmentCard from './assignment_card'

import { requestGet, requestPost } from '../../../../../modules/request'
import { evidenceToolIcon } from "../../../../Shared"
import { ASSIGN_ACTIVITIES_FEATURED_BLOG_ID } from '../../../constants/featuredBlogPost'
import ArticleSpotlight from '../../shared/articleSpotlight'
import { CLICKED_ACTIVITY_PACK_ID } from '../assignmentFlowConstants'

interface ActivityToSuggest {
  name: string;
  classification: string,
  topics: [],
  link: string,
  date_released: string,
  preview_link: string,
  activity_id: number
}

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
  const [activitiesToSuggest, setActivitiesToSuggest] = React.useState([])

  const getData = () => {
    requestGet(
      `${process.env.DEFAULT_URL}/activities/suggested_activities`,
      (body) => {
        setActivitiesToSuggest(body.activities)
      }
    );
  }

  React.useEffect(() => {
    getData()
  }, []);

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

  const suggestedActivitiesList = activitiesToSuggest.length > 0 &&
  (
    <div>
      <h1 className="evidence-header">Browse the newest Reading for Evidence activities</h1>
      <table className="data-table suggested-activities-table">
        <tr className="data-table-headers">
          <th className="data-table-header">Tool</th>
          <th className="data-table-header activity-header">Activity</th>
          <th className="data-table-header topics-header">Topics</th>
          <th className="data-table-header">Date released</th>
        </tr>
        <tbody className="data-table-body">
          <div className="list-item">
            {activitiesToSuggest.map((a) => {
              return (
                <tr className="data-table-row" key={a.id}>
                  <span className="tool-col"><img alt={evidenceToolIcon.alt} src={evidenceToolIcon.src} /></span>
                  <td className="data-table-row-section name-col">
                    <a href={`/assign/activity-library?activityClassificationFilters[]=evidence&search=${encodeURI(a.name)}`}>{a.name}</a>
                  </td>
                  <td className="data-table-row-section topics-col">
                    {a.topics.map((t, i) => {
                      return <p key={i}>{t.join(" / ")}</p>
                    })}
                  </td>
                  <td className="date-col">{a.publication_date}</td>
                  <td className="preview-col"><a href={`/activity_sessions/anonymous?activity_id=${a.id}`} rel="noopener noreferrer" target="_blank">Preview</a></td>
                  <button className="quill-button secondary medium focus-on-light outlined select-suggested" onClick={() => window.location.href = `/assign/activity-library?activityClassificationFilters[]=evidence&search=${encodeURI(a.name)}`} type="button">Select</button>
                </tr>
              )
            })}
          </div>
        </tbody>
      </table>
    </div>
  )

  return (
    <React.Fragment>
      <div className="assign-a-new-activity-container gray-background-accommodate-footer">
        <div className="assign-a-new-activity container">
          <h1>Find the perfect writing activities for your students.</h1>
          <div className="previously-assigned-container">
            <p className="previously-assigned-activities">
              You have {numberOfActivitiesAssigned} {numberOfActivitiesAssigned === 1 ? 'activity' : 'activities'} assigned.&nbsp;
            </p>
            <div className="view-assigned-activities"><a href="/teachers/classrooms/activity_planner">View assigned activities</a></div>
          </div>
          {diagnosticBanner}
          <div className="minis">{minis(diagnosticBannerShowing)}</div>
          {suggestedActivitiesList}
        </div>
      </div>
      <ArticleSpotlight blogPostId={ASSIGN_ACTIVITIES_FEATURED_BLOG_ID} />
    </React.Fragment>
  )
}

export default AssignANewActivity
