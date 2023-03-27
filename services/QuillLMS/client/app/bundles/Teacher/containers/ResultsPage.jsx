import React from 'react'
import ResultsIcon from '../components/activities/results_page/results_icon.jsx'
import activityLaunchLink from '../components/modules/generate_activity_launch_link'
import ScrollToTop from '../components/shared/scroll_to_top'

export default class ResultsPage extends React.Component {
  bottomSection = () => {
    const { activityName, } = this.props
    return (
      <div className="bottom-section">
        <h2>Results for {activityName}</h2>
        {this.resultsSection()}
        {this.replayButtonSection()}
      </div>
    )
  }

  coloredSquareClassName = (category) => {
    const { resultCategoryNames, } = this.props
    switch(category) {
      case resultCategoryNames.PROFICIENT:
        return 'proficient'
      case resultCategoryNames.NEARLY_PROFICIENT:
        return 'nearly-proficient'
      default:
        return 'not-yet-proficient'
    }
  }

  headerButton = () => {
    const { integrationPartnerName, integrationPartnerSessionId, anonymous, classroomId, } = this.props
    const buttonClassName = 'quill-button primary contained large focus-on-light'
    if (integrationPartnerName && integrationPartnerSessionId) {
      const link = `/${integrationPartnerName}?session_id=${integrationPartnerSessionId}`;
      return (<a className={buttonClassName} href={link}>Back to activity list</a>)
    } else if (anonymous) {
      return (<a className={buttonClassName} href='/account/new'>Sign up</a>)
    }

    const link = classroomId ? `/classrooms/${classroomId}` : '/'
    return <a className={buttonClassName} href={link}>Back to your dashboard</a>
  }

  replayButtonSection = () => {
    const { percentage, anonymous, integrationPartnerName, classroomUnitId, activityId, } = this.props
    if (percentage >= 0.8 || anonymous || integrationPartnerName) { return }

    return (
      <div className="replay-button-container">
        <p>All writers revise their work. Try this activity again.</p>
        <a className="quill-button primary outlined large focus-on-light" href={activityLaunchLink(classroomUnitId, activityId)}>Replay</a>
      </div>
    )
  }

  resultSectionDescription = category => {
    const { resultCategoryNames, } = this.props
    switch(category) {
      case resultCategoryNames.PROFICIENT:
        return 'Concepts you have mastered. Good work!'
      case resultCategoryNames.NEARLY_PROFICIENT:
        return 'Concepts you have almost mastered. Keep practicing!'
      default:
        return 'Concepts you have not mastered yet. Try again!'
    }
  }

  resultsSection = () => {
    const { results, } = this.props
    const resultSections = Object.keys(results).map(category => this.renderResultSection(category, results[category]))
    return (
      <div className="results-container">
        {resultSections}
      </div>
    )
  }

  renderResultSection = (category, concepts) => {
    if (!concepts.length) { return }

    const results = concepts.map(c => <li key={c}>{c}</li>)

    return (
      <div className="result-section" key={category}>
        <div className="result-section-header">
          <div className={`colored-square ${this.coloredSquareClassName(category)}`} />
          <span>{category}</span>
        </div>
        <h2>{this.resultSectionDescription(category)}</h2>
        <ul>{results}</ul>
      </div>
    )
  }

  render() {
    const { activityType, percentage, } = this.props
    return (
      <div id='results-page'>
        <ScrollToTop />
        <div className='top-section'>
          <ResultsIcon
            activityType={activityType}
            percentage={percentage}
          />
          <h1>Activity Complete!</h1>
          {this.headerButton()}
        </div>
        {this.bottomSection()}
      </div>
    );
  }

}
