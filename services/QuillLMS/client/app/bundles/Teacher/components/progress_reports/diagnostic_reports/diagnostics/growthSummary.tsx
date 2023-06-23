import * as React from 'react';
import { withRouter } from 'react-router-dom';

import {
  SkillGroupSummary,
  StudentResult,
} from './interfaces';
import PercentageCircle from './percentageCircle';
import {
  fileDocumentIcon,
  noDataYet,
  triangleUpIcon,
  PRE,
  POST,
  sumProficiencyScores,
  calculateClassGrowthPercentage
} from './shared';
import SkillGroupTooltip from './skillGroupTooltip';

import { requestGet } from '../../../../../../modules/request/index';
import {
  Tooltip,
} from '../../../../../Shared/index';
import DemoOnboardingTour, { DEMO_ONBOARDING_DIAGNOSTIC_GROWTH_SUMMARY, } from '../../../shared/demo_onboarding_tour';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

function renderGrowthElement(delta: number, text: string) {
  return delta > 0 ? <span className="growth-element">{triangleUpIcon}<span>{Math.round(delta)}{`% ${text}`}</span></span> : <span className="growth-element no-growth">No growth</span>
}

const SkillGroupSummaryCard = ({ skillGroupSummary, completedStudentCount }: { skillGroupSummary: SkillGroupSummary, completedStudentCount: number }) => {
  const { name, description, not_yet_proficient_in_post_test_student_names, proficiency_scores_by_student } = skillGroupSummary
  let cardContent = noDataYet

  if (completedStudentCount) {
    const numberOfStudentsNeedingPracticeInPost = not_yet_proficient_in_post_test_student_names.length
    const preProficiencyScoreTotalSum = sumProficiencyScores(proficiency_scores_by_student, PRE)
    const postProficiencyScoreTotalSum = sumProficiencyScores(proficiency_scores_by_student, POST)
    const preProficiencyClassPercentage = Math.round((preProficiencyScoreTotalSum / completedStudentCount) * 100)
    const postProficiencyClassPercentage = Math.round((postProficiencyScoreTotalSum / completedStudentCount) * 100)
    const delta = postProficiencyClassPercentage - preProficiencyClassPercentage

    let needPracticeElement = <span className="need-practice-element no-practice-needed">No practice needed</span>
    const growthElement = renderGrowthElement(delta, 'growth')

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
            percent={preProficiencyClassPercentage}
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
            percent={postProficiencyClassPercentage}
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

export const GrowthResults = ({ activityName, passedStudentResults, passedSkillGroupSummaries, match, mobileNavigation, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudentResults);
  const [studentResults, setStudentResults] = React.useState<StudentResult[]>(passedStudentResults || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState<SkillGroupSummary[]>(passedSkillGroupSummaries || []);
  const [classwideGrowthAverage, setClasswideGrowthAverage] = React.useState<number>(null);

  const { activityId, classroomId, } = match.params
  const completedStudentCount = studentResults.filter(sr => sr.skill_groups).length

  React.useEffect(() => {
    getResults()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getResults()
  }, [activityId, classroomId])

  React.useEffect(() => {
    // classwideGrowthAverage result may be 0 in some instances so we check for initial null value
    if (skillGroupSummaries.length && completedStudentCount && classwideGrowthAverage === null) {
      calculateClassGrowthPercentage({ skillGroupSummaries, completedStudentCount, setClasswideGrowthAverage })
    }
  }, [skillGroupSummaries])

  function getResults() {
    requestGet(`/teachers/progress_reports/diagnostic_growth_results_summary?activity_id=${activityId}&classroom_id=${classroomId}`,
      (data) => {
        setStudentResults(data.student_results);
        setSkillGroupSummaries(data.skill_group_summaries);
        setLoading(false)
      }
    )
  }

  function renderClasswideGrowthAverage() {
    if(classwideGrowthAverage === null) { return }

    const classwideGrowthDisplayedAverage = classwideGrowthAverage > 0 ? classwideGrowthAverage: 0;
    const activityDisplayedName = activityName.replace('(Post)', '').trim();
    return(
      <section className="lower-header-section">
        <span className="activity-name">{`${activityDisplayedName}:`}</span>
        {renderGrowthElement(classwideGrowthDisplayedAverage, 'Class-wide skill growth')}
      </section>
    )
  }

  if (loading) { return <LoadingSpinner /> }


  const skillGroupSummaryCards = skillGroupSummaries.map(skillGroupSummary => <SkillGroupSummaryCard completedStudentCount={completedStudentCount} key={skillGroupSummary.name} skillGroupSummary={skillGroupSummary} />)

  return (
    <main className="results-summary-container growth-results-summary-container">
      <DemoOnboardingTour pageKey={DEMO_ONBOARDING_DIAGNOSTIC_GROWTH_SUMMARY} />
      <header>
        <section className="upper-header-section">
          <h1>Class summary</h1>
          <a className="focus-on-light" href="https://support.quill.org/en/articles/5698227-how-do-i-read-the-growth-results-summary-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>
        </section>
        {renderClasswideGrowthAverage()}
      </header>
      {mobileNavigation}
      <section className="skill-group-summary-cards">{skillGroupSummaryCards}</section>
    </main>
  )
}

export default withRouter(GrowthResults)
