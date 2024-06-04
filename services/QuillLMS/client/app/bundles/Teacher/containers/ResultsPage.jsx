import React from 'react'

import ResultsIcon from '../components/activities/results_page/results_icon.jsx'
import activityLaunchLink from '../components/modules/generate_activity_launch_link'
import ScrollToTop from '../components/shared/scroll_to_top'
import { proficiencyCutoffsAsPercentage } from '../../../modules/proficiency_cutoffs';

const diagnosticActivityType = 'diagnostic'

const ResultsPage = ({
  activityName,
  showExactScore,
  numberOfCorrectQuestions,
  numberOfQuestions,
  activityType,
  percentage,
  groupedKeyTargetSkillConcepts,
  integrationPartnerName,
  integrationPartnerSessionId,
  anonymous,
  classroomId,
  classroomUnitId,
  activityId,
  activitySessionId,
}) => {
  const isDiagnostic = activityType === diagnosticActivityType

  const cutOff = proficiencyCutoffsAsPercentage();

  const renderResultsSection = (sectionHeader, targetSkills) => {
    if (!targetSkills.length) { return }

    const targetSkillElements = targetSkills.sort((a, b) => (a.percentage > b.percentage) ? -1 : 1).map(targetSkill => {
      const { name, numberOfQuestions, numberOfCorrectQuestions, percentage, } = targetSkill
      return (
        <div className="target-skill" key={name}>
          <span>{name}</span>
          {showExactScore && !isDiagnostic ? <span>{numberOfCorrectQuestions} of {numberOfQuestions} correct ({percentage}%)</span> : <span />}
        </div>
      )
    })

    return (
      <div className="results-section">
        <h2>{sectionHeader}</h2>
        {targetSkillElements}
      </div>
    )
  }

  const renderKeepPracticingSection = () => {
    const percentageAsWholeNumber = percentage * 100

    if (percentageAsWholeNumber >= cutOff.proficient || isDiagnostic) { return }

    return (
      <div className="keep-practicing-section">
        <img alt="" src={`${process.env.CDN_URL}/images/pages/student_results_page/pencil_illustration.svg`} />
        <div>
          <h2>Keep practicing!</h2>
          <p>Becoming a strong writer takes practice. You kept going and finished the activity! By practicing, you will continue to improve and build your skills.</p>
        </div>
      </div>
    )
  }

  const bottomSection = () => {
    if (isDiagnostic) {
      return (
        <div className="results-section">
          <h2>You completed a diagnostic!</h2>
          <p className="diagnostic-explanation">You won’t see a score for diagnostics, but we’ll use the results to create a personalized learning plan just for you. Your teacher will review the results and assign practice activities to help you grow as a writer.</p>
        </div>
      )
    }

    const proficientSkills = []
    const keepPracticingSkills = []

    groupedKeyTargetSkillConcepts.forEach(groupedKeyTargetSkillConcept => {
      const { correct, incorrect, name } = groupedKeyTargetSkillConcept
      const numberOfQuestionsForSkill = correct + incorrect
      const percentage = Math.round((correct / numberOfQuestionsForSkill) * 100)

      const targetSkillData = {
        numberOfCorrectQuestions: correct,
        numberOfQuestions: numberOfQuestionsForSkill,
        percentage,
        name
      }

      if (percentage > cutOff.proficient) {
        proficientSkills.push(targetSkillData)
      } else {
        keepPracticingSkills.push(targetSkillData)
      }
    })

    return (
      <React.Fragment>
        {renderResultsSection('Proficient', proficientSkills)}
        {renderResultsSection('Keep Practicing', keepPracticingSkills)}
      </React.Fragment>
    )
  }

  const headerButtons = () => {
    const primaryButtonClassName = 'quill-button-archived primary contained large focus-on-light'
    if (integrationPartnerName && integrationPartnerSessionId) {
      const link = `/${integrationPartnerName}?session_id=${integrationPartnerSessionId}`;
      return (<a className={primaryButtonClassName} href={link}>Back to activity list</a>)
    } else if (anonymous) {
      return (<a className={primaryButtonClassName} href='/session/new'>Log in</a>)
    }

    const dashboardLink = classroomId ? `/classrooms/${classroomId}` : '/'

    return (
      <div className="header-buttons">
        <a className={primaryButtonClassName} href={dashboardLink}>Return to dashboard</a>
        {!isDiagnostic && <a className='quill-button-archived secondary outlined large focus-on-light' href={`/activity_sessions/${activitySessionId}/student_activity_report`}>View results</a>}
        {!isDiagnostic && <a className='quill-button-archived secondary outlined large focus-on-light' href={`/activity_sessions/classroom_units/${classroomUnitId}/activities/${activityId}`}>Replay activity</a>}
      </div>
    )
  }

  return (
    <div className="results-page-container white-background-accommodate-footer">
      <div id='results-page'>
        <ScrollToTop />
        <div className='top-section'>
          <h1>Activity Complete!</h1>
          {headerButtons()}
        </div>
        <div className="activity-results">
          <div className="activity-name-and-overall-score">
            <div>
              <h2>{activityName}</h2>
              {showExactScore && !isDiagnostic && <p>Total Score: {numberOfCorrectQuestions} of {numberOfQuestions} target skills correct ({Math.round(percentage * 100)}%)</p>}
            </div>
            <ResultsIcon activityType={activityType} percentage={percentage} />
          </div>
          {bottomSection()}
        </div>
        {renderKeepPracticingSection()}
      </div>
    </div>
  );

}

export default ResultsPage
