import * as React from 'react'
import * as moment from 'moment'

import EmptyDiagnosticProgressReport from './empty_diagnostic_progress_report.jsx'
import { Classroom, Activity, Diagnostic, } from './interfaces'
import { goToAssign, } from './shared'

import { DropdownInput, Tooltip, } from '../../../../../Shared/index'

const baseImageSrc = `${process.env.CDN_URL}/images/pages/diagnostic_reports`

const barGraphIncreasingIcon = <img alt="Bar chart growth icon" src={`${baseImageSrc}/icons-bar-graph-increasing.svg`} />
const multipleCardsIcon = <img alt="Activity pack icon" src={`${baseImageSrc}/icons-card-multiple.svg`} />
const multipleUsersIcon = <img alt="Multiple user icon" src={`${baseImageSrc}/icons-user-multiple.svg`} />
const calendarDateIcon = <img alt="Calendar icon" src={`${baseImageSrc}/icons-calendar-date.svg`} />
const triangleUpIcon = <img alt="Triangle up icon" src={`${baseImageSrc}/icons-triangle-up-green.svg`} />
const wrenchIcon = <img alt="Wrench icon" src={`${baseImageSrc}/icons-wrench.svg`} />

const MOBILE_WIDTH = 990
const AVERAGE_FONT_WIDTH = 6
const ACTIVITY_PACK_TEXT_MAX_WIDTH = 264

const ALL = 'ALL'
const ALL_OPTION = { label: 'All classes', value: ALL }

function resultsLink(activityId, classroomId, unitId) {
  const baseResultsLink = `/teachers/progress_reports/diagnostic_reports/#/diagnostics/${activityId}/classroom/${classroomId}/results`
  return unitId ? `${baseResultsLink}?unit=${unitId}` : baseResultsLink
}

const AssignedSection = ({ activity, sectionTitle, }) => {
  const { assigned_date, unit_name, completed_count, assigned_count, activity_id, classroom_id, unit_id, } = activity
  const activityPackText = `Activity pack: ${unit_name}`
  let activityPackElement = <span>{activityPackText}</span>
  if (window.innerWidth > MOBILE_WIDTH && ((activityPackText.length * AVERAGE_FONT_WIDTH) > ACTIVITY_PACK_TEXT_MAX_WIDTH)) {
    activityPackElement = <Tooltip tooltipText={activityPackText} tooltipTriggerText={`${activityPackText.substring(0, ACTIVITY_PACK_TEXT_MAX_WIDTH/AVERAGE_FONT_WIDTH)}...`} />
  }
  return (<section className="pre">
    <div>
      <h4>{sectionTitle}</h4>
      <p>{calendarDateIcon}<span>Assigned: {moment(assigned_date).format('MMM D, YYYY')}</span></p>
      {unit_name && <p>{multipleCardsIcon}{activityPackElement}</p>}
      <p>{multipleUsersIcon}<span>Completed: {completed_count} of {assigned_count}</span></p>
    </div>
    <div>
      <a className="focus-on-light" href={resultsLink(activity_id, classroom_id, unit_id)}>View results and recommendations</a>
    </div>
  </section>)
}

const GrowthSummary = ({ showGrowthSummary, skillsGrowth, name, growthSummaryLink, }) => {
  if (showGrowthSummary) {
    const growth = skillsGrowth > 0 ? <span className="growth">{triangleUpIcon}{skillsGrowth}</span> : <span className="no-growth">No growth yet</span>
    return (<section className="growth-summary">
      <div>
        <h4>Growth summary</h4>
        <p>{barGraphIncreasingIcon}<span>Skills growth: {growth}</span></p>
      </div>
      <div>
        <a className="focus-on-light" href={growthSummaryLink}>View growth</a>
      </div>
    </section>)
  }

  return (<section className="growth-summary">
    <div>
      <h4>Growth summary</h4>
      <p>{barGraphIncreasingIcon}<span>To see how your students have grown, first assign the {name} (Post)</span></p>
    </div>
  </section>)

}

const PostInProgress = ({ name, }) => {
  return (<section className="post-in-progress">
    <div>
      <h4>Post</h4>
      <p>{wrenchIcon}<span>We’re working on building the {name} (Post). We’ll let you know when it’s available.</span></p>
    </div>
  </section>)
}

const PostSection = ({ post, activityId, unitTemplateId, name, }) => {
  if (post) {
    return <AssignedSection activity={post} sectionTitle="Post" />
  }

  function handleAssignClick() {
    goToAssign(unitTemplateId, name, activityId)
  }

  return (<section className="post">
    <div>
      <h4>Post</h4>
      <p>{calendarDateIcon}<span>Not assigned</span></p>
    </div>
    <div>
      <a className="focus-on-light" href={`/activity_sessions/anonymous?activity_id=${activityId}`} rel="noopener noreferrer" target="_blank">Preview</a>
      <button className="focus-on-light fake-link" onClick={handleAssignClick} type="button">Assign</button>
    </div>
  </section>)
}

const Diagnostic = ({ diagnostic, }) => {
  const { name, pre, post, } = diagnostic
  let postAndGrowth = <PostInProgress name={name} />
  if (pre.post_test_id) {
    const growthSummaryLink = resultsLink(pre.post_test_id, pre.classroom_id, pre.unit_id)
    postAndGrowth = post.assigned_count ? <React.Fragment><PostSection post={post} /><GrowthSummary growthSummaryLink={growthSummaryLink} showGrowthSummary={true} skillsGrowth={post.skills_count - pre.skills_count} /></React.Fragment> : <React.Fragment><PostSection activityId={pre.post_test_id} name={name} unitTemplateId={post.unit_template_id} /><GrowthSummary name={name} /></React.Fragment>
  }

  return (<section className="diagnostic">
    <div className="name"><h3>{name}</h3></div>
    <div className="pre-and-post-wrapper">
      <AssignedSection activity={pre} sectionTitle="Pre" />
      {postAndGrowth}
    </div>
  </section>)
}

const Classroom = ({ classroom, }) => {
  const diagnostics = classroom.diagnostics.map(d => <Diagnostic diagnostic={d} key={d.pre.id} />)
  return (<section className="classroom-section">
    <h2>{classroom.name}</h2>
    {diagnostics}
  </section>)
}

const DiagnosticActivityPacks = ({ classrooms, }) => {
  const [selectedClassroomId, setSelectedClassroomId] = React.useState(ALL)

  function onClassesDropdownChange(e) {
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
