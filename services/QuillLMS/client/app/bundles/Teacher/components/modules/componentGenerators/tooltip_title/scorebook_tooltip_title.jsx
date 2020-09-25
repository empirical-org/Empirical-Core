import React from 'react';
import ReactDOMServer from 'react-dom/server';

import AboutPremium from '../../../general_components/tooltip/about_premium.jsx';
import ConceptResultStats from '../../../general_components/tooltip/concept_result_stats.jsx';
import ActivityDetails from '../../../general_components/tooltip/activity_details.jsx';
import LoadingDots from '../../../shared/loading_dots.jsx';
import numberSuffixBuilder from '../../numberSuffixBuilder'
import PercentageDisplayer from '../../percentage_displayer.jsx';
const percentageDisplayer = new PercentageDisplayer()

export default class ScorebookTooltip extends React.Component {
  aboutPremiumOrNot = () => {
    const data = this.props.data
    if (data.concept_results && data.concept_results.length && !['trial', 'school', 'paid'].includes(data.premium_state)) {
      return <AboutPremium />;
    }
  };

  activityOverview() {
    const data = this.props.data
    return (<div className="activity-overview">
      <ActivityDetails data={data} />
      {this.totalScoreOrNot()}
    </div>)
  }

  conceptResultsOrLoadingOrNotCompleted = () => {
    const data = this.props.data
    if (data.marked_complete === 't' && data.completed_attempts === 0) {
      return <span>This student has missed this lesson. To make up this material, you can assign this lesson again to the students who missed it.</span>
    } else if (!data.percentage) {
      return <span>This activity has not been completed.</span>;
    } else if (data.concept_results && data.concept_results.length) {
      return <ConceptResultStats results={data.concept_results} />;
    } else {
      return <LoadingDots loadingMessage={'Loading concept results'} />;
    }
  };

  displayScores = () => {
    const data = this.props.data
    const attemptInProgress = data.started > 0
    return data.scores.map((score, i) => {
      const ordinalNumber = numberSuffixBuilder(i + 1)
      const percentage = percentageDisplayer.run(score.percentage)
      const scoreLength = data.scores.length
      let attemptText = ''
      if (attemptInProgress && i === scoreLength - 1) {
        const ordinalNumbers = ['Zeroth', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth']
        const nextNumber = scoreLength + 1
        const textifiedNextNumber = nextNumber > 10 ? numberSuffixBuilder(textifiedNextNumber) : ordinalNumbers[nextNumber]
        attemptText = `(${textifiedNextNumber} attempt in progress)`
      }
      return <p key={i} style={{ fontSize: '13px', color: '#3b3b3b', }}><strong>{ordinalNumber} Score:</strong> <span className="percentage">{percentage}</span> {attemptText}</p>
    })
  };

  totalScoreOrNot = () => {
    let totalScoreOrNot
    const data = this.props.data
    const actClassId = data.activity ? data.activity.classification.id : data.activity_classification_id;
     if (Number(actClassId) === 4 && data.percentage) {
      totalScoreOrNot = <p style={{ fontSize: '13px', color: '#3b3b3b', }}>Quill Diagnostic does not provide a score. You can click to view recommended activities based on the student's performance.</p>;
    } else if (Number(actClassId) === 6 && data.percentage) {
      totalScoreOrNot = <p style={{ fontSize: '13px', color: '#3b3b3b', }}>Quill Lessons are facilitated by the teachers and not graded. You can click to view your student’s’ answers from this lesson.</p>;
    } else if (data.percentage && data.scores && data.scores.length > 0) {
      totalScoreOrNot = this.displayScores()
    } else {
      totalScoreOrNot = <span />
    }
    return totalScoreOrNot
  };

  render() {
    const data = this.props.data
    const conceptResults = data.conceptResults && data.conceptResults.length
    const name = data.activity ? data.activity.name : data.name;
    return (
      <div className="scorebook-tooltip" style={{ position: 'relative', }}>
        <i className="fas fa-caret-up" />
        <i className="fas fa-caret-up border-color" />
        <div className="title">
          {name}
        </div>
        <div className="main">
          {this.activityOverview()}
          <div className={conceptResults ? 'concept-results' : 'loading flex-row vertically-centered space-around'}>
            {this.conceptResultsOrLoadingOrNotCompleted()}
          </div>
        </div>
      </div>
    )
  }
};
