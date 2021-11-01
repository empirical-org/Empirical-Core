import * as React from 'react'
import { withRouter, Link, } from 'react-router-dom';

import {
  triangleUpIcon,
  noDataYet,
  fileDocumentIcon,
} from './shared'
import PercentageCircle from './percentageCircle'
import SkillGroupTooltip from './skillGroupTooltip'
import StudentResultsTable from './studentResultsTable'

import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import { requestGet } from '../../../../../../modules/request/index';
import {
  Tooltip,
  CLICK,
} from '../../../../../Shared/index'

interface SkillGroupSummary {
  name: string;
  description?: string;
  not_yet_proficient_in_post_test_student_names: string[];
}

interface StudentResult {
  name: string;
}

const SkillGroupSummaryCard = ({ skillGroupSummary, completedStudentCount }) => {
  const { name, description, not_yet_proficient_in_post_test_student_names, not_yet_proficient_in_pre_test_student_names, } = skillGroupSummary
  let cardContent = noDataYet

  if (completedStudentCount) {
    const numberOfStudentsNeedingPracticeInPost = not_yet_proficient_in_post_test_student_names.length
    const postPercentageNotProficient = (numberOfStudentsNeedingPracticeInPost/completedStudentCount) * 100
    const postPercentageProficient = 100 - Math.round(postPercentageNotProficient)
    const numberOfStudentsNeedingPracticeInPre = not_yet_proficient_in_pre_test_student_names.length
    const prePercentageNotProficient = (numberOfStudentsNeedingPracticeInPre/completedStudentCount) * 100
    const prePercentageProficient = 100 - Math.round(prePercentageNotProficient)
    const delta = prePercentageProficient ? ((postPercentageProficient - prePercentageProficient) / prePercentageProficient) * 100 : postPercentageProficient

    let needPracticeElement = <span className="need-practice-element no-practice-needed">No practice needed</span>
    let growthElement = delta > 0 ? <span className="growth-element">{triangleUpIcon}<span>{delta}% growth</span></span> : <span className="growth-element no-growth">No growth</span>

    if (numberOfStudentsNeedingPracticeInPost) {
      const tooltipText = `<p>${not_yet_proficient_in_post_test_student_names.join('<br>')}</p>`
      const tooltipTriggerText = numberOfStudentsNeedingPracticeInPost === 1 ? "1 student needs practice" : `${numberOfStudentsNeedingPracticeInPost} students need practice`
      needPracticeElement = (<Tooltip
        tooltipText={tooltipText}
        tooltipTriggerText={tooltipTriggerText}
        tooltipTriggerTextClass="need-practice-element"
      />)
    }

    cardContent = (<React.Fragment>
      <div className="percentage-circles">
        <div>
          <span className="percentage-circle-label">Pre proficient</span>
          <PercentageCircle
            bgcolor="#ebebeb"
            borderWidth={8}
            color="#9e9e9e"
            innerColor="#ffffff"
            percent={prePercentageProficient}
            radius={52}
          />
        </div>
        <div>
          <span className="percentage-circle-label">Post proficient</span>
          <PercentageCircle
            bgcolor="#ebebeb"
            borderWidth={8}
            color="#4ea500"
            innerColor="#ffffff"
            percent={postPercentageProficient}
            radius={52}
          />
        </div>
      </div>
      <div className="card-footer">
        {needPracticeElement}
        {growthElement}
      </div>
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

const GrowthResults = ({ passedStudentResults, passedSkillGroupSummaries, match, mobileNavigation, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudentResults);
  const [studentResults, setStudentResults] = React.useState(passedStudentResults || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState(passedSkillGroupSummaries || []);
  const [openPopover, setOpenPopover] = React.useState({})

  const { activityId, classroomId, } = match.params

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
    requestGet(`/teachers/progress_reports/diagnostic_growth_results_summary?activity_id=${activityId}&classroom_id=${classroomId}`,
      (data) => {
        setStudentResults(data.student_results);
        setSkillGroupSummaries(data.skill_group_summaries);
        setLoading(false)
      }
    )
  }

  const responsesLink = (studentId) => `diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}`

  function closePopoverOnOutsideClick(e) {
    if (!openPopover.studentId) { return }

    const popoverElements = document.getElementsByClassName('student-results-popover')
    if (popoverElements && !popoverElements[0].contains(e.target)) {
      setOpenPopover({})
    }
  }

  if (loading) { return <LoadingSpinner /> }

  const completedStudentCount = studentResults.filter(sr => sr.skill_groups).length

  const skillGroupSummaryCards = skillGroupSummaries.map(skillGroupSummary => <SkillGroupSummaryCard completedStudentCount={completedStudentCount} key={skillGroupSummary.name} skillGroupSummary={skillGroupSummary} />)

  return (<main className="results-summary-container growth-results-summary-container">
    <header>
      <h1>Growth results summary</h1>
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

export default withRouter(GrowthResults)
