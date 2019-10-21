import React from 'react';
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip';
import shouldCountForScoring from '../../../../modules/activity_classifications.js';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    premium_state: React.PropTypes.string.isRequired,
  },

  handleScores() {
    return this.props.data.scores.map((score, index) => <ActivityIconWithTooltip context={'scorebook'} data={score} key={`${this.props.data.name} ${index} ${score.cuId}`} premium_state={this.props.premium_state} />);
  },

  calculateAverageScore() {
    let totalScore = 0;
    let relevantScores = 0;
    this.props.data.scores.forEach(score => {
      if(shouldCountForScoring(score.activity_classification_id) && score.percentage) {
        relevantScores += 1;
        totalScore += parseFloat(score.percentage);
      }
    });
    const averageScore = totalScore / relevantScores;
    if(averageScore) {
      return `${Math.round(averageScore * 100)}% Avg. Score`;
    }
  },

  render() {
    return (
      <section className="overview-section">
        <header className="student-header">
          <h3 className="student-name">{this.props.data.name}</h3>
          <p className="average-score">{this.calculateAverageScore()}</p>
          <a className="activity-scores-link" href={`/teachers/progress_reports/student_overview?student_id=${this.props.data.userId}&classroom_id=${this.props.data.classroomId}`} target="_blank">View Activity Scores <i className="fa fa-star" /></a>
        </header>
        <div className="flex-row vertically-centered">
          {this.handleScores()}
        </div>
      </section>
    );
  },
});
