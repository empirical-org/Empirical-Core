import qs from 'qs';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import {
  SkillGroupSummary,
  StudentResult
} from './interfaces';
import PercentageCircle from './percentageCircle';
import {
  baseDiagnosticImageSrc, fileDocumentIcon, noDataYet
} from './shared';
import SkillGroupTooltip from './skillGroupTooltip';

import { requestGet } from '../../../../../../modules/request/index';
import {
  Tooltip
} from '../../../../../Shared/index';
import DemoOnboardingTour, { DEMO_ONBOARDING_DIAGNOSTIC_RESULTS_SUMMARY } from '../../../shared/demo_onboarding_tour';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

const timeRewindIllustration = <img alt="Illustration of a clock with an arrow pointing backwards" src={`${baseDiagnosticImageSrc}/time-rewind.svg`} />

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
  return (
    <section className="skill-group-summary-card">
      <div className="card-header">
        <span className="skill-group-name">{name}</span>
        <SkillGroupTooltip description={description} name={name} />
      </div>
      {cardContent}
    </section>
  )
}

export const Summary = ({ passedStudentResults, passedSkillGroupSummaries, match, mobileNavigation, location, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudentResults);
  const [studentResults, setStudentResults] = React.useState<StudentResult[]>(passedStudentResults || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState<SkillGroupSummary[]>(passedSkillGroupSummaries || []);

  const { activityId, classroomId, } = match.params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `&unit_id=${unitId}` : ''

  React.useEffect(() => {
    getResults()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getResults()
  }, [activityId, classroomId, unitId])

  function getResults() {
    requestGet(`/teachers/progress_reports/diagnostic_results_summary?activity_id=${activityId}&classroom_id=${classroomId}${unitQueryString}`,
      (data) => {
        setStudentResults(data.student_results);
        setSkillGroupSummaries(data.skill_group_summaries);
        setLoading(false)
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }

  let emptyState

  if (!skillGroupSummaries.length) {
    emptyState = (<section className="results-empty-state">
      {timeRewindIllustration}
      <h2>This report is unavailable for diagnostics assigned before a certain date.</h2>
      <p>If you have questions, please reach out to support@quill.org.</p>
    </section>)
  }

  const completedStudentCount = studentResults.filter(sr => sr.skill_groups).length

  const skillGroupSummaryCards = skillGroupSummaries.map(skillGroupSummary => <SkillGroupSummaryCard completedStudentCount={completedStudentCount} key={skillGroupSummary.name} skillGroupSummary={skillGroupSummary} />)

  return (
    <main className="results-summary-container">
      <DemoOnboardingTour pageKey={DEMO_ONBOARDING_DIAGNOSTIC_RESULTS_SUMMARY} />
      <header>
        <h1>Class summary</h1>
        {!!skillGroupSummaries.length && <a className="focus-on-light" href="https://support.quill.org/en/articles/5698112-how-do-i-read-the-results-summary-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>}
      </header>
      {mobileNavigation}
      {emptyState}
      {!!skillGroupSummaries.length && <section className="skill-group-summary-cards">{skillGroupSummaryCards}</section>}
    </main>
  )
}

export default withRouter(Summary)
