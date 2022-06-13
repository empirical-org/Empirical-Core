import * as React from 'react'
import * as moment from 'moment'

import GrowthSummarySection from './growthSummarySection'
import EmptyDiagnosticProgressReport from './empty_diagnostic_progress_report.jsx'
import { Classroom, Activity, Diagnostic, } from './interfaces'
import { goToAssign, baseDiagnosticImageSrc, } from './shared'

import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from '../../progress_report_constants'
import { DropdownInput, Tooltip, } from '../../../../../Shared/index'
import { requestGet } from '../../../../../../modules/request/index';

const multipleCardsIcon = <img alt="Activity pack icon" src={`${baseDiagnosticImageSrc}/icons-card-multiple.svg`} />
const multipleUsersIcon = <img alt="Multiple user icon" src={`${baseDiagnosticImageSrc}/icons-user-multiple.svg`} />
const calendarDateIcon = <img alt="Calendar icon" src={`${baseDiagnosticImageSrc}/icons-calendar-date.svg`} />
const wrenchIcon = <img alt="Wrench icon" src={`${baseDiagnosticImageSrc}/icons-wrench.svg`} />

const MOBILE_WIDTH = 990
const AVERAGE_FONT_WIDTH = 5
const ACTIVITY_PACK_TEXT_MAX_WIDTH = 264

const ALL = 'ALL'
const ALL_OPTION = { label: 'All classrooms', value: ALL }

const STARTER_V1_ID = 849
const INTERMEDIATE_V1_ID = 850
const ADVANCED_V1_ID = 888

function summaryLink(isPostDiagnostic, activityId, classroomId, unitId) {
  const summaryPath = isPostDiagnostic ? 'growth_summary' : 'summary'
  const baseSummaryLink = `/teachers/progress_reports/diagnostic_reports/#/diagnostics/${activityId}/classroom/${classroomId}/${summaryPath}`
  return unitId ? `${baseSummaryLink}?unit=${unitId}` : baseSummaryLink
}

const AssignedSection = ({ activity, sectionTitle, isPostDiagnostic, }) => {
  const { assigned_date, unit_name, completed_count, assigned_count, activity_id, classroom_id, unit_id, } = activity
  const activityPackText = `Activity pack: ${unit_name}`
  let activityPackElement = <span>{activityPackText}</span>
  if (window.innerWidth > MOBILE_WIDTH && ((activityPackText.length * AVERAGE_FONT_WIDTH) > ACTIVITY_PACK_TEXT_MAX_WIDTH)) {
    activityPackElement = <Tooltip tooltipText={activityPackText} tooltipTriggerText={activityPackText} tooltipTriggerTextClass="activity-pack-name" />
  }
  return (
    <section className="pre">
      <div>
        <h4>{sectionTitle}</h4>
        <p>{calendarDateIcon}<span>Assigned: {moment(assigned_date).format('MMM D, YYYY')}</span></p>
        {unit_name && <p>{multipleCardsIcon}{activityPackElement}</p>}
        <p>{multipleUsersIcon}<span>Completed: {completed_count} of {assigned_count}</span></p>
      </div>
      <div>
        <a className="focus-on-light" href={summaryLink(isPostDiagnostic, activity_id, classroom_id, unit_id)}>View results and recommendations</a>
      </div>
    </section>
  )
}

const PostInProgress = ({ name, }) => {
  return (
    <section className="post-in-progress">
      <div>
        <h4>Post</h4>
        <p>{wrenchIcon}<span>We’re working on building the {name} (Post). We’ll let you know when it’s available.</span></p>
      </div>
    </section>
  )
}

const PostSection = ({ post, activityId, unitTemplateId, name, }) => {
  if (post) {
    return <AssignedSection activity={post} isPostDiagnostic={true} sectionTitle="Post" />
  }

  function handleAssignClick() {
    goToAssign(unitTemplateId, name, activityId)
  }

  return (
    <section className="post">
      <div>
        <h4>Post</h4>
        <p>{calendarDateIcon}<span>Not assigned</span></p>
      </div>
      <div>
        <a className="focus-on-light" href={`/activity_sessions/anonymous?activity_id=${activityId}`} rel="noopener noreferrer" target="_blank">Preview</a>
        <button className="focus-on-light fake-link" onClick={handleAssignClick} type="button">Assign</button>
      </div>
    </section>
  )
}

const Diagnostic = ({ diagnostic, }) => {
  const [skillsGrowth, setSkillsGrowth] = React.useState(null)
  const { name, pre, post, } = diagnostic

  React.useEffect(() => {
    if (post && post.assigned_count) {
      getSkillsGrowth()
    }
  }, [])

  function getSkillsGrowth() {

    requestGet(`/teachers/progress_reports/skills_growth/${pre.classroom_id}/post_test_activity_id/${post.activity_id}/pre_test_activity_id/${pre.activity_id}`,
      (data) => {
        setSkillsGrowth(data.skills_growth)
      }
    )
  }

  let postAndGrowth = ([STARTER_V1_ID, INTERMEDIATE_V1_ID, ADVANCED_V1_ID].includes(pre.activity_id)) ? null : <PostInProgress name={name} />

  if (pre.post_test_id) {
    const growthSummaryLink = summaryLink(true, pre.post_test_id, pre.classroom_id, pre.unit_id)

    if (post.assigned_count) {
      postAndGrowth = (<React.Fragment>
        <PostSection post={post} />
        <GrowthSummarySection growthSummaryLink={growthSummaryLink} showGrowthSummary={true} skillsGrowth={skillsGrowth} />
      </React.Fragment>)
    } else {
      postAndGrowth = (<React.Fragment>
        <PostSection activityId={pre.post_test_id} name={name} unitTemplateId={post.unit_template_id} />
        <GrowthSummarySection name={name} />
      </React.Fragment>
      )
    }
  }

  return (
    <section className="diagnostic">
      <div className="name"><h3>{name}</h3></div>
      <div className="pre-and-post-wrapper">
        <AssignedSection activity={pre} isPostDiagnostic={false} sectionTitle="Pre" />
        {postAndGrowth}
      </div>
    </section>
  )
}

const Classroom = ({ classroom, }) => {
  const diagnostics = classroom.diagnostics.map(d => <Diagnostic diagnostic={d} key={d.pre.id} />)
  return (
    <section className="classroom-section">
      <h2>{classroom.name}</h2>
      {diagnostics}
    </section>
  )
}

const DiagnosticActivityPacks = ({ classrooms, }) => {
  const selectedClassroom = classrooms.find(c => Number(c.id) === Number(window.localStorage.getItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID)))
  const [selectedClassroomId, setSelectedClassroomId] = React.useState(selectedClassroom && selectedClassroom.id || ALL)

  function onClassesDropdownChange(e) {
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, e.value)
    setSelectedClassroomId(e.value)
  }

  if (!classrooms.length) { return <EmptyDiagnosticProgressReport /> }

  const dropdownOptions = [ALL_OPTION].concat(classrooms.map(c => ({ value: c.id, label: c.name, })))
  const classroomElements = selectedClassroomId === ALL ? classrooms.map(c => <Classroom classroom={c} key={c.id} />) : <Classroom classroom={classrooms.find(c => c.id === selectedClassroomId)} />

  return (
    <div className="diagnostic-activity-packs-container">
      <div className="container diagnostic-activity-packs">
        <h1>Diagnostic Reports</h1>
        <DropdownInput
          handleChange={onClassesDropdownChange}
          isSearchable={false}
          options={dropdownOptions}
          value={dropdownOptions.find(opt => opt.value === selectedClassroomId)}
        />
        {classroomElements}
      </div>
    </div>
  )
}

export default DiagnosticActivityPacks
