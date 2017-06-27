'use strict'
import React from 'react'

import activityTypeFromClassificationId from '../../modules/activity_type_from_classification_id.js'

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  objectiveTitle: function () {
    const activity = this.props.data.activity
    const classification = this.props.data.activity.classification
    if (activity.activity_classification_id) {
      return [activityTypeFromClassificationId(activity.activity_classification_id), "Objective"].join(' ');
    }
    else if (classification) {
      return [classification.alias, "Objective"].join(' ');
    } else {
      return "Objective"
    }
  },

  getClassName: function () {
    if (this.props.data.concept_results && this.props.data.concept_results.length) {
      return 'activity-details'
    } else {
      return 'activity-details no-concept-results'
    }
  },

  dateOrNot: function () {
    if (this.props.data.state != 'finished' && (!this.props.data.due_date || !this.props.data.due_date_or_completed_at_date)) {
      return null
    } else {
      let dateTitle, dateBody
      if (this.props.data.state == 'finished') {
        dateTitle = 'Completed:';
        dateBody = this.props.data.completed_at ? this.props.data.completed_at : this.props.data.due_date_or_completed_at_date;
      } else {
        dateTitle = 'Due:';
        dateBody = this.props.data.due_date_or_completed_at_date ? this.props.data.due_date_or_completed_at_date : this.props.data.due_date;
      }
      return (
        <div className='activity-detail'>
          <span className='activity-detail-title'>
            {dateTitle}
          </span>
          <span className='activity-detail-body'>
            {dateBody}
          </span>
        </div>
      )
    }
  },

  render: function () {
    return (
      <div className={this.getClassName()}>
        <div className='activity-detail'>
          <div className='activity-detail-title objective-title'>
            {this.objectiveTitle()}
          </div>
          <div className='activity-detail-body'>
            {this.props.data.activity.description}
            {this.dateOrNot()}
            {/* <p>{this.props.data.due_date_or_completed_at_date}</p> */}
          </div>
        </div>
      </div>
    );
  }
});
