import _ from 'underscore';
import React from 'react';
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    premium_state: React.PropTypes.string.isRequired,
  },

  handleScores() {
    return this.props.data.scores.map((score, index) => <ActivityIconWithTooltip key={`${this.props.data.name} ${index} ${score.caId}`} data={score} premium_state={this.props.premium_state} context={'scorebook'} />);
  },

  render() {
    return (
      <section className="overview-section">
        <header className="student-header">
          <h3 className="student-name">{this.props.data.name}</h3>
          <a target="_blank" href={`/teachers/progress_reports/activity_sessions?student_id=${this.props.data.userId}&classroom_id=${this.props.data.classroomId}`}><i className="fa fa-list" /> View List</a>
        </header>
        <div className="flex-row vertically-centered">
          {this.handleScores()}
        </div>
      </section>
    );
  },
});
