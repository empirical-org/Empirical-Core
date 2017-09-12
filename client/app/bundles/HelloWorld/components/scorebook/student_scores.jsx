import _ from 'underscore';
import React from 'react';
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    premium_state: React.PropTypes.string.isRequired,
  },

  render() {
    const scores = this.props.data.scores.map(score => <ActivityIconWithTooltip key={`${this.props.data.name} ${score.caId}`} data={score} premium_state={this.props.premium_state} context={'scorebook'} />);
    return (
      <div className="container">
        <section>
          <h3 className="student-name">{this.props.data.name}</h3>
          <div className="row">
            <div className="flex-row vertically-centered" />
            {scores}
          </div>
        </section>
      </div>
    );
  },
});
