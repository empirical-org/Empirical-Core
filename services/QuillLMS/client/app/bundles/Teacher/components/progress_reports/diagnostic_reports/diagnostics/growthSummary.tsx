import * as React from 'react';
import { withRouter } from 'react-router-dom';

import {
    SkillGroupSummary,
    StudentResult
} from './interfaces';
import PercentageCircle from './percentageCircle';
import {
    fileDocumentIcon, noDataYet, triangleUpIcon
} from './shared';
import SkillGroupTooltip from './skillGroupTooltip';

import { requestGet } from '../../../../../../modules/request/index';
import {
    Tooltip
} from '../../../../../Shared/index';
import DemoOnboardingTour, { DEMO_ONBOARDING_DIAGNOSTIC_GROWTH_SUMMARY } from '../../../shared/demo_onboarding_tour';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

const SkillGroupSummaryCard = ({ skillGroupSummary, completedStudentCount }: { skillGroupSummary: SkillGroupSummary, completedStudentCount: number }) => {
  const { name, description, not_yet_proficient_in_post_test_student_names, not_yet_proficient_in_pre_test_student_names, } = skillGroupSummary
  let cardContent = noDataYet

  if (completedStudentCount) {
    const numberOfStudentsNeedingPracticeInPost = not_yet_proficient_in_post_test_student_names.length
    const postPercentageNotProficient = (numberOfStudentsNeedingPracticeInPost/completedStudentCount) * 100
    const postPercentageProficient = 100 - Math.round(postPercentageNotProficient)
    const numberOfStudentsNeedingPracticeInPre = not_yet_proficient_in_pre_test_student_names.length
    const prePercentageNotProficient = (numberOfStudentsNeedingPracticeInPre/completedStudentCount) * 100
    const prePercentageProficient = 100 - Math.round(prePercentageNotProficient)
    const delta = prePercentageProficient ? postPercentageProficient - prePercentageProficient : postPercentageProficient

    let needPracticeElement = <span className="need-practice-element no-practice-needed">No practice needed</span>
    let growthElement = delta > 0 ? <span className="growth-element">{triangleUpIcon}<span>{Math.round(delta)}% growth</span></span> : <span className="growth-element no-growth">No growth</span>

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

export const GrowthResults = ({ passedStudentResults, passedSkillGroupSummaries, match, mobileNavigation, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudentResults);
  const [studentResults, setStudentResults] = React.useState<StudentResult[]>(passedStudentResults || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState<SkillGroupSummary[]>(passedSkillGroupSummaries || []);

  const { activityId, classroomId, } = match.params

  React.useEffect(() => {
    getResults()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getResults()
  }, [activityId, classroomId])

  function getResults() {
    requestGet(`/teachers/progress_reports/diagnostic_growth_results_summary?activity_id=${activityId}&classroom_id=${classroomId}`,
      (data) => {
        setStudentResults(data.student_results);
        setSkillGroupSummaries(data.skill_group_summaries);
        setLoading(false)
      }
    )
  }

  if (loading) { return <LoadingSpinner /> }

  const completedStudentCount = studentResults.filter(sr => sr.skill_groups).length

  const skillGroupSummaryCards = skillGroupSummaries.map(skillGroupSummary => <SkillGroupSummaryCard completedStudentCount={completedStudentCount} key={skillGroupSummary.name} skillGroupSummary={skillGroupSummary} />)

  return (
    <main className="results-summary-container growth-results-summary-container">
      <DemoOnboardingTour pageKey={DEMO_ONBOARDING_DIAGNOSTIC_GROWTH_SUMMARY} />
      <header>
        <h1>Class summary</h1>
        <a className="focus-on-light" href="https://support.quill.org/en/articles/5698227-how-do-i-read-the-growth-results-summary-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>
      </header>
      {mobileNavigation}
      <section className="skill-group-summary-cards">{skillGroupSummaryCards}</section>
    </main>
  )
}

export default withRouter(GrowthResults)
