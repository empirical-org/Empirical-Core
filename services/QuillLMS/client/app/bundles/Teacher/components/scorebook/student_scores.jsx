import React from 'react';

import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip';
import shouldCountForScoring from '../../../../modules/activity_classifications.js';

export default class StudentScores extends React.Component {

  calculateAverageScore() {
    const { data, } = this.props

    let totalScore = 0;
    let relevantScores = 0;
    data.scores.forEach(score => {
      if(shouldCountForScoring(score.activity_classification_id) && score.percentage) {
        relevantScores += 1;
        totalScore += parseFloat(score.percentage);
      }
    });
    const averageScore = totalScore / relevantScores;
    if(averageScore) {
      return `${Math.round(averageScore * 100)}% Avg. Score`;
    }
  }

  handleScores() {
    const { data, premium_state, } = this.props
    return data.scores.map((score, index) => <ActivityIconWithTooltip context='scorebook' data={score} key={`${data.name} ${index} ${score.cuId}`} premium_state={premium_state} />);
  }

  render() {
    const { data, } = this.props
    /* eslint-disable react/jsx-no-target-blank */
    const activityScoresLink = <a className="activity-scores-link" href={`/teachers/progress_reports/student_overview?student_id=${data.userId}&classroom_id=${data.classroomId}`} target="_blank">View Activity Scores <i className="fas fa-star" /></a>
    /* eslint-enable react/jsx-no-target-blank */
    return (
      <section className="overview-section">
        <header className="student-header">
          <h3 className="student-name">{data.name}</h3>
          <p className="average-score">{this.calculateAverageScore()}</p>
          {activityScoresLink}
        </header>
        <div className="flex-row vertically-centered">
          {this.handleScores()}
        </div>
      </section>
    );
  }
}
