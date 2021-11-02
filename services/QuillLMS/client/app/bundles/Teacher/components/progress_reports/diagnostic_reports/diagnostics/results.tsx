import * as React from 'react'
import qs from 'qs'
import { withRouter, Link, } from 'react-router-dom';

import {
  noDataYet,
  fileDocumentIcon,
} from './shared'
import PercentageCircle from './percentageCircle'
import SkillGroupTooltip from './skillGroupTooltip'
import StudentResultsTable from './studentResultsTable'
import {
  SkillGroupSummary,
  StudentResult,
  OpenPopover
} from './interfaces'

import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import { requestGet } from '../../../../../../modules/request/index';
import {
  Tooltip,
  CLICK,
} from '../../../../../Shared/index'

const SkillGroupSummaryCard = ({ skillGroupSummary, completedStudentCount }) => {
  const { name, description, not_yet_proficient_student_names, } = skillGroupSummary
  let cardContent = noDataYet
  if (completedStudentCount) {
    const numberOfStudentsNeedingPractice = not_yet_proficient_student_names.length
    const percentage = (numberOfStudentsNeedingPractice/completedStudentCount) * 100
    let needPracticeElement = <span className="need-practice-element no-practice-needed">No practice needed</span>

    if (numberOfStudentsNeedingPractice) {
      const tooltipText = `<p>${not_yet_proficient_student_names.join('<br>')}</p>`
      const tooltipTriggerText = numberOfStudentsNeedingPractice === 1 ? "1 student needs practice" : `${numberOfStudentsNeedingPractice} students need practice`
      needPracticeElement = (<Tooltip
        tooltipText={tooltipText}
        tooltipTriggerText={tooltipTriggerText}
        tooltipTriggerTextClass="need-practice-element"
      />)
    }

    cardContent = (<React.Fragment>
      <span className="percentage-circle-label">Proficient</span>
      <PercentageCircle
        bgcolor="#ebebeb"
        borderWidth={8}
        color="#4ea500"
        innerColor="#ffffff"
        percent={100 - Math.round(percentage)}
        radius={52}
      />
      {needPracticeElement}
    </React.Fragment>)
  }
  return (<section className="skill-group-summary-card">
    <div className="card-header">
      <span className="skill-group-name">{name}</span>
      <SkillGroupTooltip description={description} name={name} />
    </div>
    {cardContent}
  </section>)
}

const Results = ({ passedStudentResults, passedSkillGroupSummaries, match, mobileNavigation, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudentResults);
  const [studentResults, setStudentResults] = React.useState<StudentResult[]>(passedStudentResults || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState<SkillGroupSummary[]>(passedSkillGroupSummaries || []);
  const [openPopover, setOpenPopover] = React.useState<OpenPopover>({})

  const { activityId, classroomId, } = match.params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `&unit_id=${unitId}` : ''

  React.useEffect(() => {
    getResults()
  }, [])

  React.useEffect(() => {
    window.addEventListener(CLICK, closePopoverOnOutsideClick)
    return function cleanup() {
      window.removeEventListener(CLICK, closePopoverOnOutsideClick)
    }
  }, [openPopover])

  function getResults() {

    requestGet(`/teachers/progress_reports/diagnostic_results_summary?activity_id=${activityId}&classroom_id=${classroomId}${unitQueryString}`,
      (data) => {
        setStudentResults(data.student_results);
        setSkillGroupSummaries(data.skill_group_summaries);
        setLoading(false)
      }
    )
  }

  const responsesLink = (studentId) => `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}${unitQueryString}`

  function closePopoverOnOutsideClick(e) {
    if (!openPopover.studentId) { return }

    const popoverElements = document.getElementsByClassName('student-results-popover')
    if (popoverElements && (!popoverElements[0].contains(e.target) || e.target.classList.includes('interactive-wrapper'))) {
      setOpenPopover({})
    }
  }

  if (loading) { return <LoadingSpinner /> }

  const completedStudentCount = studentResults.filter(sr => sr.skill_groups).length

  const skillGroupSummaryCards = skillGroupSummaries.map(skillGroupSummary => <SkillGroupSummaryCard completedStudentCount={completedStudentCount} key={skillGroupSummary.name} skillGroupSummary={skillGroupSummary} />)

  return (<main className="results-summary-container">
    <header>
      <h1>Results summary</h1>
      <a className="focus-on-light" href="/">{fileDocumentIcon}<span>Guide</span></a>
    </header>
    {mobileNavigation}
    <section className="skill-group-summary-cards">{skillGroupSummaryCards}</section>
    <section className="student-results">
      <h2>Student results</h2>
      <StudentResultsTable openPopover={openPopover} responsesLink={responsesLink} setOpenPopover={setOpenPopover} skillGroupSummaries={skillGroupSummaries} studentResults={studentResults} />
    </section>
  </main>
  )
}

export default withRouter(Results)
