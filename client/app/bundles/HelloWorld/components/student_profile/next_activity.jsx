import React from 'react';
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip.jsx';
import LoadingIndicator from '../shared/loading_indicator';
import activityLaunchLink from '../modules/generate_activity_launch_link.js';

export default React.createClass({

  dataForActivityIconWithToolTip() {
    return {
      percentage: this.props.data.max_percentage,
      activity_classification_id: this.props.data.activity_classification_id,
    };
  },

  render() {
    if (this.props.data) {
      const text = this.props.data.activity_classification_id === '6' ? 'Join Lesson' : 'Start Activity';
      return (
        <div className="next-activity">
          <div className="next-activity-name">
            <ActivityIconWithTooltip data={this.dataForActivityIconWithToolTip()} context={'studentProfile'} placement={'bottom'} />
            <p>{this.props.data.name}</p>
          </div>
          <div className="start-activity-wrapper">
            <a href={activityLaunchLink(this.props.data.ca_id)}>
              <button className="button-green pull-right">{text}</button>
            </a>
          </div>
        </div>
      );
    } else if (this.props.loading) {
      return (<LoadingIndicator />);
    } else if (this.props.hasActivities) {
      return (<span />);
    }
    return (<div className="container">
      <p style={{ fontSize: '18px', margin: '2em', }}>Your teacher hasn't assigned any activities to you yet.</p>
    </div>);
  },
});
