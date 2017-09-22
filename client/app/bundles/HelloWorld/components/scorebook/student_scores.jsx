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
      <section style={{ maxWidth: '950px', margin: '0 auto', }}>
        <h3 className="student-name">{this.props.data.name}</h3>
        <div className="flex-row vertically-centered" >
          {this.handleScores()}
        </div>
      </section>
    );
  },
});
