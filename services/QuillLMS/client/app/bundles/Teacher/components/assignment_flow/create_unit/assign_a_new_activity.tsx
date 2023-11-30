import moment from 'moment';
import * as React from 'react';
import { renderToString } from 'react-dom/server';

import AssignmentCard from './assignment_card';

import { requestGet, requestPost, } from '../../../../../modules/request';
import { DataTable, Tooltip, evidenceToolIcon, } from "../../../../Shared";
import { ASSIGN_ACTIVITIES_FEATURED_BLOG_ID } from '../../../constants/featuredBlogPost';
import ArticleSpotlight from '../../shared/articleSpotlight';
import { CLICKED_ACTIVITY_PACK_ID } from '../assignmentFlowConstants';

const TOPIC_WIDTH = '319px'

const diagnosticWaveSrc = `${process.env.CDN_URL}/images/illustrations/diagnostic-wave.svg`
const activityLibrarySrc = `${process.env.CDN_URL}/images/icons/icons-activity-library.svg`
const activityPacksSrc = `${process.env.CDN_URL}/images/icons/icons-activity-packs.svg`
const allDiagnosticsSrc = `${process.env.CDN_URL}/images/icons/icons-diagnostics-all.svg`
const graduationCapSrc = `${process.env.CDN_URL}/images/icons/icons-graduation-cap.svg`
const closeIconSrc = `${process.env.CDN_URL}/images/icons/close.svg`
const globeIconSrc = `${process.env.CDN_URL}/images/icons/icons-description-topic.svg`

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

const headers = [
  {
    width: '24px',
    name: 'Tool',
    attribute: 'tool',
    noTooltip: true
  }, {
    width: '394px',
    name: 'Name',
    attribute: 'name',
  }, {
    width: TOPIC_WIDTH,
    name: 'Topics',
    attribute: 'topics',
    containsOwnTooltip: true
  }, {
    width: '180px',
    name: 'Date released',
    attribute: 'dateReleased',
  }, {
    width: '60px',
    name: '',
    attribute: 'previewLink',
    noTooltip: true
  }, {
    width: '70px',
    name: '',
    attribute: 'select',
    noTooltip: true
  }
]

const AssignANewActivity = ({ numberOfActivitiesAssigned, showDiagnosticBanner, passedSuggestedActivities }) => {
  const [diagnosticBannerShowing, setDiagnosticBannerShowing] = React.useState(showDiagnosticBanner)
  const [activitiesToSuggest, setActivitiesToSuggest] = React.useState(passedSuggestedActivities || [])
  const [showAllSuggestedActivities, setShowAllSuggestedActivities] = React.useState(false)

  React.useEffect(() => {
    getData()
  }, []);

  React.useEffect(() => {
    // remove any previously stored activityPackId used for back navigation element focus in the event that user assigned pack or navigated back to dashboard before assigning
    window.sessionStorage.removeItem(CLICKED_ACTIVITY_PACK_ID);
  }, []);

  const getData = () => {
    requestGet(
      `${process.env.DEFAULT_URL}/activities/suggested_activities`,
      (body) => {
        setActivitiesToSuggest(body.activities)
      }
    );
  }

  function handleClickShowAll() {
    setShowAllSuggestedActivities(true)
  }

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
      <button className="interactive-wrapper" onClick={closeDiagnosticBanner} type="button">
        <img alt="X" src={closeIconSrc} />
      </button>
    </section>)
  }

  const activitiesToShow = showAllSuggestedActivities ? activitiesToSuggest : activitiesToSuggest.slice(0, 5)

  const rows = activitiesToShow.map(activity => {
    const topicsTooltipHTMLRows = activity.topics.map(topic => {
      return (
        <p key={topic[2]}>
          <img alt="" src={globeIconSrc} />
          <span>{topic[0]}</span>
          <span className="slash">/</span>
          <span>{topic[1]}</span>
          <span className="slash">/</span>
          <span>{topic[2]}</span>
        </p>
      )
    })

    const displayedTopics = activity.topics.map((topic, i) => {
      if (i === activity.topics.length - 1) {
        return <div className="topic" key={topic}><img alt="" src={globeIconSrc} /><span>{topic[2]}</span></div>
      }

      return <div className="topic" key={topic}><img alt="" src={globeIconSrc} /><span>{topic[2]}</span><span className="vertical-divider" /></div>
    })

    const topicsTooltipString = renderToString(<div className="topics">{topicsTooltipHTMLRows}</div>)

    const topicsStyle = {
      minWidth: TOPIC_WIDTH,
      width: TOPIC_WIDTH
    }

    const dateReleased = <span>{moment(activity.publication_date).format('MMMM DD, YYYY')}</span>
    const newTag = activity.publication_date > moment().subtract(3, 'months') ? <span className="new-tag">NEW</span> : null

    return {
      tool: <img alt={evidenceToolIcon.alt} src={evidenceToolIcon.src} />,
      name: <a href={`/assign/activity-library?activityClassificationFilters[]=evidence&search=${encodeURI(activity.name)}`}>{activity.name}</a>,
      topics: (
        <Tooltip
          tooltipText={topicsTooltipString}
          tooltipTriggerStyle={topicsStyle}
          tooltipTriggerText={displayedTopics}
          tooltipTriggerTextClass='data-table-row-section topic-section'
          tooltipTriggerTextStyle={topicsStyle}
        />
      ),
      dateReleased: <div className="date-released">{dateReleased}{newTag}</div>,
      previewLink: <a className="preview-link" href={`/activity_sessions/anonymous?activity_id=${activity.id}`} rel="noopener noreferrer" target="_blank">Preview</a>,
      select: <a className="quill-button secondary fun focus-on-light outlined select-suggested" href={`/assign/activity-library?activityClassificationFilters[]=evidence&search=${encodeURI(activity.name)}`}>Select</a>
    }
  })

  const evidenceSection = activitiesToSuggest.length ? (
    <React.Fragment>
      <h1 className="evidence-header">Browse the newest Reading for Evidence activities</h1>
      <DataTable
        headers={headers}
        rows={rows}
      />
      {showAllSuggestedActivities ? null : <button className="quill-button outlined small secondary focus-on-light show-all-button" onClick={handleClickShowAll} type="button">Show all {activitiesToSuggest.length} Reading for Evidence activities</button>}
    </React.Fragment>
  ) : null

  return (
    <React.Fragment>
      <div className="navbar-divider-bar green" />
      <div className="gray-background-accommodate-footer">
        <div className="assign-a-new-activity container">
          <h1>Find the perfect writing activities for your students.</h1>
          <div className="previously-assigned-container">
            <p className="previously-assigned-activities">
              You have {numberOfActivitiesAssigned} {numberOfActivitiesAssigned === 1 ? 'activity' : 'activities'} assigned.&nbsp;
            </p>
            <a className="quill-button view-assigned-activities secondary outlined small focus-on-light" href="/teachers/classrooms/activity_planner">View assigned activities</a>
          </div>
          {diagnosticBanner}
          <div className="minis">{minis(diagnosticBannerShowing)}</div>
          {evidenceSection}
        </div>
      </div>
      <ArticleSpotlight blogPostId={ASSIGN_ACTIVITIES_FEATURED_BLOG_ID} />
    </React.Fragment>
  )
}

export default AssignANewActivity
