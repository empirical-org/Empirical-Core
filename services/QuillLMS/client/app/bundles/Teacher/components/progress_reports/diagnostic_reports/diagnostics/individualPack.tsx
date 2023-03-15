import * as React from 'react'

import { Switch, Route, withRouter, NavLink, } from 'react-router-dom';
import qs from 'qs'

import GrowthResults from './growthResults'
import Results from './results'
import GrowthSummary from './growthSummary'
import Summary from './summary'
import StudentResponsesIndex from './studentResponsesIndex'
import IndividualStudentResponses from './individualStudentResponses'
import Recommendations from './recommendations'
import Questions from './questions'
import { Classroom, Activity, Diagnostic, } from './interfaces'
import { goToAssign, baseDiagnosticImageSrc, accountCommentIcon, closeIcon, } from './shared'

import { PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, } from '../../progress_report_constants'
import { DropdownInput, } from '../../../../../Shared/index'
import ArticleSpotlight from '../../../shared/articleSpotlight';
import { GRAY_ARTICLE_FOOTER_BACKGROUND_COLOR, RESULTS_AND_RECOMMENDATIONS_FEATURED_BLOG_POST_ID } from '../../../../constants/featuredBlogPost';

const barChartIcon = <img alt="Bar chart icon" src={`${baseDiagnosticImageSrc}/icons-bar-chart.svg`} />
const barChartGrowthIcon = <img alt="Chart showing growth icon" src={`${baseDiagnosticImageSrc}/icons-bar-chart-growth.svg`} />
const multipleCheckboxIcon = <img alt="Multiple checkboxes icon" src={`${baseDiagnosticImageSrc}/icons-checkbox-multiple.svg`} />
const cardTextIcon = <img alt="Message icon" src={`${baseDiagnosticImageSrc}/icons-card-text.svg`} />
const tableIcon = <img alt="Table with a user icon" src={`${baseDiagnosticImageSrc}/icons-table-account.svg`} />
const chartGrowthIllustration = <img alt="Chart showing growth illustration" src={`${baseDiagnosticImageSrc}/chart-growth-illustration-quill-green.svg`} />

const eyeIcon = <img alt="Preview icon" src={`${process.env.CDN_URL}/images/icons/icons-visibility-on.svg`} />

const PRE_TEXT = ' (Pre)'
const POST_TEXT = ' (Post)'

const preBadge = <span className="pre-badge">PRE</span>
const postBadge = <span className="post-badge">POST</span>

const DiagnosticSection = ({ activity, isPostDiagnostic, isDisabled, search, }) => {
  const { activity_name, activity_id, classroom_id, } = activity
  const baseLinkPath = `/diagnostics/${activity_id}/classroom/${classroom_id}`
  const queryString = search ? search : ''

  const summaryLinkContent = <React.Fragment>{tableIcon}<span>Class summary</span></React.Fragment>
  const resultLinkContent = <React.Fragment>{isPostDiagnostic ? barChartGrowthIcon : barChartIcon}<span>Student results</span></React.Fragment>
  const recommendationsLinkContent = <React.Fragment>{multipleCheckboxIcon}<span>Practice recommendations</span></React.Fragment>
  const responsesLinkContent = <React.Fragment>{accountCommentIcon}<span>Student responses</span></React.Fragment>
  const questionsLinkContent = <React.Fragment>{cardTextIcon}<span>Questions analysis</span></React.Fragment>

  const resultsPath = isPostDiagnostic ? 'growth_results' : 'results'
  const summaryPath = isPostDiagnostic ? 'growth_summary' : 'summary'

  let activityNameForDisplay = activity_name
  let preOrPostBadge

  if (activity_name.includes(PRE_TEXT)) {
    activityNameForDisplay = activity_name.replace(PRE_TEXT, '')
    preOrPostBadge = preBadge
  } else if (activity_name.includes(POST_TEXT)) {
    activityNameForDisplay = activity_name.replace(POST_TEXT, '')
    preOrPostBadge = postBadge
  }

  return (
    <section className={`diagnostic-section ${isDisabled ? 'disabled' : ''}`}>
      <h6><span><span className="activity-name">{activityNameForDisplay}</span>{preOrPostBadge}</span> <a className="focus-on-light preview-link" href={`/activity_sessions/anonymous?activity_id=${activity_id}`} rel="noopener noreferrer" target="_blank">{eyeIcon}</a></h6>
      {isDisabled ? <span className='disabled-link'>{summaryLinkContent}</span> : <NavLink activeClassName="selected" className="summary-link" to={`${baseLinkPath}/${summaryPath}${queryString}`}>{summaryLinkContent}</NavLink>}
      {isDisabled ? <span className='disabled-link'>{resultLinkContent}</span> : <NavLink activeClassName="selected" to={`${baseLinkPath}/${resultsPath}${queryString}`}>{resultLinkContent}</NavLink>}
      {isDisabled ? <span className='disabled-link'>{recommendationsLinkContent}</span> : <NavLink activeClassName="selected" className="recommendations-link" to={`${baseLinkPath}/recommendations${queryString}`}>{recommendationsLinkContent}</NavLink>}
      {isDisabled ? <span className='disabled-link'>{responsesLinkContent}</span> : <NavLink activeClassName="selected" to={`${baseLinkPath}/responses${queryString}`}>{responsesLinkContent}</NavLink>}
      {isDisabled ? <span className='disabled-link'>{questionsLinkContent}</span> : <NavLink activeClassName="selected" to={`${baseLinkPath}/questions${queryString}`}>{questionsLinkContent}</NavLink>}
    </section>
  )
}

const mobileLinkOptions = (diagnostic, search) => {
  const baseLinkPathPre = `/diagnostics/${diagnostic.pre.activity_id}/classroom/${diagnostic.pre.classroom_id}`
  const baseLinkPathPost = diagnostic.post && `/diagnostics/${diagnostic.post.activity_id}/classroom/${diagnostic.post.classroom_id}`
  const queryString = search ? search : ''

  function pathsArray(isPostDiagnostic) {
    const prefix = isPostDiagnostic ? 'Post' : 'Pre'
    const baseLink = isPostDiagnostic ? baseLinkPathPost : baseLinkPathPre
    const resultsPath = isPostDiagnostic ? 'growth_results' : 'results'
    const summaryPath = isPostDiagnostic ? 'growth_summary' : 'summary'
    return [
      {
        label: `${prefix} - Class summary`,
        value: `${baseLink}/${summaryPath}${queryString}`
      },
      {
        label: `${prefix} - Student results`,
        value: `${baseLink}/${resultsPath}${queryString}`
      },
      {
        label: `${prefix} - Practice recommendations`,
        value: `${baseLink}/recommendations${queryString}`
      },
      {
        label: `${prefix} - Student responses`,
        value: `${baseLink}/responses${queryString}`
      },
      {
        label: `${prefix} - Questions analysis`,
        value: `${baseLink}/questions${queryString}`
      }
    ]
  }


  return diagnostic.post && diagnostic.post.assigned_count ? pathsArray(false).concat(pathsArray(true)) : pathsArray(false)
}

const PostDiagnosticCard = ({ activityId, activityName, unitTemplateId, }) => {
  const [closed, setClosed] = React.useState(false)

  if (closed) { return <span /> }

  function handleAssignClick() {
    goToAssign(unitTemplateId, activityName, activityId)
  }

  function closeCard() { setClosed(true) }

  return (
    <section className="post-diagnostic-card">
      <button className="interactive-wrapper close-button focus-on-dark" onClick={closeCard} type="button">{closeIcon}</button>
      {chartGrowthIllustration}
      <p>Measure growth by assigning a <b>{activityName}</b></p>
      <div>
        <a className="quill-button fun outlined secondary focus-on-light" href={`/activity_sessions/anonymous?activity_id=${activityId}`} rel="noopener noreferrer" target="_blank">Preview</a>
        <button className="quill-button fun contained primary focus-on-light" onClick={handleAssignClick} type="button">Assign</button>
      </div>
    </section>
  )
}

const IndividualPack = ({ classrooms, history, match, location, lessonsBannerIsShowable, }) => {
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const activityId = Number(match.params.activityId)
  const classroomId = Number(match.params.classroomId)
  const splitPathName = location.pathname.split('/')
  const subPage = splitPathName[splitPathName.length - 1]
  const activeClassroom = classrooms.find(c =>  c.id === classroomId )
  const activeDiagnostic = diagnosticForClassroom(activeClassroom)

  function diagnosticForClassroom(classroom) {
    return classroom.diagnostics.find(d => {
      const assignedDiagnosticAsEitherPreOrPost = (d.pre.activity_id === activityId) || (d.post && d.post.activity_id === activityId)
      const preOrPostHasUnitId = d.pre.unit_id || d.post.unit_id
      if (assignedDiagnosticAsEitherPreOrPost && unitId && preOrPostHasUnitId) {
        return d.pre.unit_id === Number(unitId) || d.post && d.post.unit_id === Number(unitId)
      }
      return assignedDiagnosticAsEitherPreOrPost
    })
  }

  function diagnosticActivityName() {
    if (!activeDiagnostic) { return '' }

    if (activeDiagnostic.pre.activity_id === activityId) {
      return activeDiagnostic.pre.activity_name
    }

    if (activeDiagnostic.post && activeDiagnostic.post.activity_id === activityId) {
      return activeDiagnostic.post.activity_name
    }

    return ''
  }

  function activeDiagnosticIsPost() {
    if (!activeDiagnostic) { return false }

    if (activeDiagnostic.post && activeDiagnostic.post.activity_id === activityId) {
      return true
    }

    return false
  }

  function onClassesDropdownChange(e) {
    const newClassroom = classrooms.find(c => c.id === e.value)
    const parallelDiagnostic = diagnosticForClassroom(newClassroom)
    // the following line handles the case where we are currently viewing a post-diagnostic page, but the parallel classroom hasn't yet been assigned the post diagnostic
    const newActivityId = parallelDiagnostic.post && parallelDiagnostic.post.activity_id === activityId ? activityId : parallelDiagnostic.pre.activity_id
    window.localStorage.setItem(PROGRESS_REPORTS_SELECTED_CLASSROOM_ID, e.value)
    history.push(`/diagnostics/${newActivityId}/classroom/${e.value}/${subPage}`)
  }

  function onLinkDropdownChange(e) {
    history.push(e.value)
  }

  let postDiagnosticContent = <span />
  if (activeDiagnostic.pre.post_test_id) {
    if (activeDiagnostic.post.assigned_count) {
      postDiagnosticContent = <DiagnosticSection activity={activeDiagnostic.post} isPostDiagnostic={true} />
    } else {
      postDiagnosticContent = <React.Fragment><DiagnosticSection activity={activeDiagnostic.post} isDisabled={true} isPostDiagnostic={true} /><PostDiagnosticCard activityId={activeDiagnostic.pre.post_test_id} activityName={activeDiagnostic.post.activity_name} unitTemplateId={activeDiagnostic.post.unit_template_id} /></React.Fragment>
    }
  }

  const classroomsThatHaveBeenAssignedThisDiagnosticSet = classrooms.filter(c => diagnosticForClassroom(c))
  const classroomDropdownOptions = classroomsThatHaveBeenAssignedThisDiagnosticSet.map(c => ({ value: c.id, label: c.name, }))

  const classroomDropdown = (<DropdownInput
    handleChange={onClassesDropdownChange}
    isSearchable={false}
    options={classroomDropdownOptions}
    value={classroomDropdownOptions.find(opt => String(opt.value) === match.params.classroomId)}
  />)

  const linkDropdownOptions = mobileLinkOptions(activeDiagnostic, location.search)

  const linkDropdown = (<DropdownInput
    handleChange={onLinkDropdownChange}
    isSearchable={false}
    options={linkDropdownOptions}
    value={linkDropdownOptions.find(opt => window.location.href.includes(opt.value))}
  />)

  const sharedProps = {
    activityName: diagnosticActivityName(),
    classrooms,
    mobileNavigation: (<section className="mobile-navigation hide-on-desktop">{classroomDropdown}{linkDropdown}</section>),
    lessonsBannerIsShowable,
    isPostDiagnostic: activeDiagnosticIsPost(),
    postDiagnosticUnitTemplateId: activeDiagnostic.post?.unit_template_id
  }

  return (
    <React.Fragment>
      <div className="white-background-accommodate-footer">
        <div className="diagnostic-individual-pack">
          <nav className="diagnostic-report-navigation hide-on-mobile">
            {classroomDropdown}
            <DiagnosticSection activity={activeDiagnostic.pre} search={location.search} />
            {postDiagnosticContent}
          </nav>
          <Switch>
            <Route path='/diagnostics/:activityId/classroom/:classroomId/growth_summary' render={() => <GrowthSummary {...sharedProps} />} />
            <Route path='/diagnostics/:activityId/classroom/:classroomId/growth_results' render={() => <GrowthResults {...sharedProps} />} />
            <Route path='/diagnostics/:activityId/classroom/:classroomId/summary' render={() => <Summary {...sharedProps} />} />
            <Route path='/diagnostics/:activityId/classroom/:classroomId/results' render={() => <Results {...sharedProps} />} />
            <Route path='/diagnostics/:activityId/classroom/:classroomId/recommendations' render={() => <Recommendations {...sharedProps} />} />
            <Route path='/diagnostics/:activityId/classroom/:classroomId/questions' render={() => <Questions {...sharedProps} />} />
            <Route path='/diagnostics/:activityId/classroom/:classroomId/responses/:studentId' render={() => <IndividualStudentResponses {...sharedProps} />} />
            <Route path='/diagnostics/:activityId/classroom/:classroomId/responses' render={() => <StudentResponsesIndex {...sharedProps} />} />
          </Switch>
        </div>
      </div>
      <ArticleSpotlight backgroundColor={GRAY_ARTICLE_FOOTER_BACKGROUND_COLOR} blogPostId={RESULTS_AND_RECOMMENDATIONS_FEATURED_BLOG_POST_ID} />
    </React.Fragment>
  )
}

export default withRouter(IndividualPack)
