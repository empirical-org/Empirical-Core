import React from 'react';

import moment from 'moment';
import ActivityIconWithTooltip from '../general_components/activity_icon_with_tooltip.jsx';
import activityLaunchLink from '../modules/generate_activity_launch_link.js';

export default React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {showLockedTooltip: false, showMissedTooltip: false}
  },

  renderDueDate() {
    return this.props.data.due_date ? <span className="due-date">{moment(this.props.data.due_date).format('MM-DD-YYYY')}</span> : <span />;
  },

  renderLockedTooltip() {
    if (this.state.showLockedTooltip) {
      return <div className="locked-tooltip">
        <p className="tooltip-header">This is a whole group activity and is launched by the teacher.</p>
        <p className="text">Your teacher will press the “Launch Lesson” button from the teacher dashboard to start the activity. You will then be able to join it.</p>
        <i className="fa fa-caret-down"/>
      </div>
    }
  },

  renderMissedTooltip() {
    if (this.state.showMissedTooltip) {
      return <div className="missed-tooltip">
        <p className="tooltip-header">Your teacher has launched and completed this group lesson in class.</p>
        <p className="text">This activity is now locked. Be sure to ask your teacher what you missed.</p>
        <i className="fa fa-caret-down"/>
      </div>
    }
  },

  showLockedTooltip() {
    this.setState({showLockedTooltip: true})
  },

  hideLockedTooltip() {
    this.setState({showLockedTooltip: false})
  },

  showMissedTooltip() {
    this.setState({showMissedTooltip: true})
  },

  hideMissedTooltip() {
    this.setState({showMissedTooltip: false})
  },

  dataForActivityIconWithToolTip() {
    return {
      percentage: this.props.data.max_percentage,
      activity_classification_id: this.props.data.activity_classification_id,
    };
  },

  renderStartButtonOrLockMessage() {
    let linkText;
    if (this.props.data.repeatable === 'f' && this.props.data.max_percentage) {
      return (<p className="title-v-centered text-right">Completed</p>);
    } else if (this.props.data.max_percentage === null && this.props.data.marked_complete === 't'){
      return (<p
        className="title-v-centered text-right"
        style={{ color: '#969696', }}
        onMouseEnter={this.showMissedTooltip}
        onMouseLeave={this.hideMissedTooltip}
        >Missed Lesson</p>);
    } else if (this.props.data.locked === 't') {
      return (<p
        className="title-v-centered text-right"
        style={{ color: '#969696', }}
        onMouseEnter={this.showLockedTooltip}
        onMouseLeave={this.hideLockedTooltip}
        >Needs Teacher</p>);
    } else if (this.props.data.max_percentage) {
      linkText = 'Replay Activity';
    } else if (this.props.data.activity_classification_id === '6') {
      linkText = 'Join Lesson';
    } else if (this.props.data.resume_link === '1') {
      linkText = 'Resume Activity';
    } else {
      linkText = 'Start Activity';
    }
    return <a href={activityLaunchLink(this.props.data.ca_id, this.props.data.activity_id)}>{linkText}</a>;
  },

  render() {
    return (
      <div className="line">
        <div className="row-list-beginning pull-left">
          <ActivityIconWithTooltip data={this.dataForActivityIconWithToolTip()} context={'studentProfile'} />
          <div className="icons-description-wrapper">
            <p className="title title-v-centered">{this.props.data.name}</p>
          </div>
        </div>
        <span className="row-list-end">
          {this.renderDueDate()}
          {this.renderStartButtonOrLockMessage()}
          {this.renderLockedTooltip()}
          {this.renderMissedTooltip()}
        </span>
      </div>
    );
  },
});
