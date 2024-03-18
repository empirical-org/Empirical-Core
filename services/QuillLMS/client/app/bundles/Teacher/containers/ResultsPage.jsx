import React from 'react'

import ResultsIcon from '../components/activities/results_page/results_icon.jsx'
import activityLaunchLink from '../components/modules/generate_activity_launch_link'
import ScrollToTop from '../components/shared/scroll_to_top'
import { proficiencyCutoffsAsPercentage } from '../../../modules/proficiency_cutoffs';

export default class ResultsPage extends React.Component {
  renderResultsSection = (sectionHeader, targetSkills) => {
    const { showExactScore, } = this.props

    if (!targetSkills.length) { return }

    const targetSkillElements = targetSkills.sort((a, b) => (a.percentage > b.percentage) ? -1 : 1).map(targetSkill => {
      const { name, numberOfQuestions, numberOfCorrectQuestions, percentage, } = targetSkill
      return (
        <div className="target-skill" key={name}>
          <span>{name}</span>
          {showExactScore ? <span>{numberOfCorrectQuestions} of {numberOfQuestions} correct ({percentage}%)</span> : <span />}
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

  bottomSection = () => {
    const { activityName, showExactScore, numberOfCorrectQuestions, numberOfQuestions, activityType, percentage, groupedKeyTargetSkillConcepts, } = this.props

    const proficientSkills = []
    const keepPracticingSkills = []

    const cutOff = proficiencyCutoffsAsPercentage();

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
      <div className="activity-results">
        <div className="activity-name-and-overall-score">
          <div>
            <h2>{activityName}</h2>
            {showExactScore && <p>Total Score: {numberOfCorrectQuestions} of {numberOfQuestions} target skills correct ({Math.round(percentage * 100)}%)</p>}
          </div>
          <ResultsIcon activityType={activityType} percentage={percentage} />
        </div>
        {this.renderResultsSection('Proficient', proficientSkills)}
        {this.renderResultsSection('Keep Practicing', keepPracticingSkills)}
      </div>
    )
  }

  headerButtons = () => {
    const { integrationPartnerName, integrationPartnerSessionId, anonymous, classroomId, classroomUnitId, activityId, } = this.props
    const primaryButtonClassName = 'quill-button primary contained large focus-on-light'
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
        <a className='quill-button secondary outlined large focus-on-light' href={`/activity_sessions/classroom_units/${classroomUnitId}/activities/${activityId}`}>Replay activity</a>
      </div>
    )
  }

  render() {
    return (
      <div className="results-page-container">
        <div id='results-page'>
          <ScrollToTop />
          <div className='top-section'>
            <h1>Activity Complete!</h1>
            {this.headerButtons()}
          </div>
          {this.bottomSection()}
        </div>
      </div>
    );
  }

}
