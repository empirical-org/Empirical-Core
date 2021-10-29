import * as React from 'react'

import { Switch, Route, withRouter, NavLink, } from 'react-router-dom';
import qs from 'qs'

import GrowthResults from './growthResults'
import Results from './results'
import { Classroom, Activity, Diagnostic, } from './interfaces'
import { goToAssign, baseDiagnosticImageSrc, accountCommentIcon, closeIcon, } from './shared'

import { DropdownInput, } from '../../../../../Shared/index'

const barChartIcon = <img alt="Bar chart icon" src={`${baseDiagnosticImageSrc}/icons-bar-chart.svg`} />
const barChartGrowthIcon = <img alt="Chart showing growth icon" src={`${baseDiagnosticImageSrc}/icons-bar-chart-growth.svg`} />
const multipleCheckboxIcon = <img alt="Multiple checkboxes icon" src={`${baseDiagnosticImageSrc}/icons-checkbox-multiple.svg`} />
const cardTextIcon = <img alt="Message icon" src={`${baseDiagnosticImageSrc}/icons-card-text.svg`} />
const chartGrowthIllustration = <img alt="Chart showing growth illustration" src={`${baseDiagnosticImageSrc}/chart-growth-illustration.svg`} />

const eyeIcon = <img alt="Preview icon" src={`${process.env.CDN_URL}/images/icons/icons-visibility-on.svg`} />

const DiagnosticSection = ({ activity, isPostDiagnostic, isDisabled, search, }) => {
  const { activity_name, activity_id, classroom_id, } = activity
  const baseLinkPath = `/diagnostics/${activity_id}/classroom/${classroom_id}`
  const queryString = search ? search : ''

  const resultLinkContent = <React.Fragment>{isPostDiagnostic ? barChartGrowthIcon : barChartIcon}<span>{isPostDiagnostic ? 'Growth results summary' : 'Results summary'}</span></React.Fragment>
  const recommendationsLinkContent = <React.Fragment>{multipleCheckboxIcon}<span>Practice recommendations</span></React.Fragment>
  const responsesLinkContent = <React.Fragment>{accountCommentIcon}<span>Student responses</span></React.Fragment>
  const questionsLinkContent = <React.Fragment>{cardTextIcon}<span>Questions analysis</span></React.Fragment>

  const resultsPath = isPostDiagnostic ? 'growth_results' : 'results'

  return (<section className={`diagnostic-section ${isDisabled ? 'disabled' : ''}`}>
    <h6><span>{activity_name}</span> <a className="focus-on-light preview-link" href={`/activity_sessions/anonymous?activity_id=${activity_id}`} rel="noopener noreferrer" target="_blank">{eyeIcon}</a></h6>
    {isDisabled ? <span className='disabled-link'>{resultLinkContent}</span> : <NavLink activeClassName="selected" to={`${baseLinkPath}/${resultsPath}${queryString}`}>{resultLinkContent}</NavLink>}
    {isDisabled ? <span className='disabled-link'>{recommendationsLinkContent}</span> : <NavLink activeClassName="selected" to={`${baseLinkPath}/recommendations${queryString}`}>{recommendationsLinkContent}</NavLink>}
    {isDisabled ? <span className='disabled-link'>{responsesLinkContent}</span> : <NavLink activeClassName="selected" to={`${baseLinkPath}/responses${queryString}`}>{responsesLinkContent}</NavLink>}
    {isDisabled ? <span className='disabled-link'>{questionsLinkContent}</span> : <NavLink activeClassName="selected" to={`${baseLinkPath}/questions${queryString}`}>{questionsLinkContent}</NavLink>}
  </section>)
}

const mobileLinkOptions = (diagnostic, search) => {
  const baseLinkPathPre = `/diagnostics/${diagnostic.pre.activity_id}/classroom/${diagnostic.pre.classroom_id}`
  const baseLinkPathPost = diagnostic.post && `/diagnostics/${diagnostic.post.activity_id}/classroom/${diagnostic.post.classroom_id}`
  const queryString = search ? search : ''

  function pathsArray(isPostDiagnostic) {
    const prefix = isPostDiagnostic ? 'Post' : 'Pre'
    const baseLink = isPostDiagnostic ? baseLinkPathPost : baseLinkPathPre
    const resultsSummaryName = isPostDiagnostic ? 'Growth results summary' : 'Results summary'
    const resultsPath = isPostDiagnostic ? 'growth_results' : 'results'
    return [
      {
        label: `${prefix} - ${resultsSummaryName}`,
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

  return (<section className="post-diagnostic-card">
    <button className="interactive-wrapper close-button focus-on-dark" onClick={closeCard} type="button">{closeIcon}</button>
    {chartGrowthIllustration}
    <p>Measure growth by assigning a Starter Growth Diagnostic (Post)</p>
    <div>
      <a className="focus-on-light" href={`/activity_sessions/anonymous?activity_id=${activityId}`} rel="noopener noreferrer" target="_blank">Preview</a>
      <button className="focus-on-light fake-link" onClick={handleAssignClick} type="button">Assign</button>
    </div>
  </section>)
}

const IndividualPack = ({ classrooms, history, match, location, }) => {
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const activityId = Number(match.params.activityId)
  const classroomId = Number(match.params.classroomId)
  const splitPathName = location.pathname.split('/')
  const subPage = splitPathName[splitPathName.length - 1]
  const activeClassroom = classrooms.find(c =>  c.id === classroomId )
  const activeDiagnostic = diagnosticForClassroom(activeClassroom)

  function diagnosticForClassroom(classroom) {
    return classroom.diagnostics.find(d => {
      const assignedDiagnosticAsEitherPreOrPost = (d.pre.activity_id === activityId) || (d.post && d.post.activity_id == activityId)
      if (assignedDiagnosticAsEitherPreOrPost && unitId) {
        return d.pre.unit_id === Number(unitId) || d.post && d.post.unit_id === Number(unitId)
      }
      return assignedDiagnosticAsEitherPreOrPost
    })
  }

  function onClassesDropdownChange(e) {
    const newClassroom = classrooms.find(c => c.id === e.value)
    const parallelDiagnostic = diagnosticForClassroom(newClassroom)
    // the following line handles the case where we are currently viewing a post-diagnostic page, but the parallel classroom hasn't yet been assigned the post diagnostic
    const newActivityId = parallelDiagnostic.post && parallelDiagnostic.post.activity_id === activityId ? activityId : parallelDiagnostic.pre.activity_id
    history.push(`/diagnostics/${newActivityId}/classroom/${e.value}/${subPage}${location.search}`)
  }

  function onLinkDropdownChange(e) {
    history.push(e.value)
  }

  let postDiagnosticContent = <span />
  if (activeDiagnostic.pre.post_test_id) {
    if (activeDiagnostic.post.assigned_count) {
      postDiagnosticContent = <DiagnosticSection activity={activeDiagnostic.post} isPostDiagnostic={true} />
    } else {
      postDiagnosticContent = <React.Fragment><PostDiagnosticCard activityId={activeDiagnostic.pre.post_test_id} activityName={activeDiagnostic.post.activity_name} unitTemplateId={activeDiagnostic.post.unit_template_id} /><DiagnosticSection activity={activeDiagnostic.post} isDisabled={true} isPostDiagnostic={true} /></React.Fragment>
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
    handleChange={onClassesDropdownChange}
    isSearchable={false}
    options={linkDropdownOptions}
    value={linkDropdownOptions.find(opt => window.location.href.includes(opt.value))}
  />)

  const sharedProps = {
    classrooms,
    mobileNavigation: (<section className="mobile-navigation hide-on-desktop">{classroomDropdown}{linkDropdown}</section>)
  }

  return (<div className="diagnostic-individual-pack">
    <nav className="diagnostic-report-navigation hide-on-mobile">
      {classroomDropdown}
      <DiagnosticSection activity={activeDiagnostic.pre} search={location.search} />
      {postDiagnosticContent}
    </nav>
    <Switch>
      <Route path='/diagnostics/:activityId/classroom/:classroomId/growth_results' render={() => <GrowthResults {...sharedProps} />} />
      <Route path='/diagnostics/:activityId/classroom/:classroomId/results' render={() => <Results {...sharedProps} />} />
    </Switch>
  </div>)
}

export default withRouter(IndividualPack)
