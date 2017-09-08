import React from 'react';

import activityTypeFromClassificationId from '../../modules/activity_type_from_classification_id.js';

export default React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  getClassName() {
    if (this.props.data.concept_results && this.props.data.concept_results.length) {
      return 'activity-details';
    }
    return 'activity-details no-concept-results';
  },

  dateOrNot() {
    if (this.props.data.state != 'finished' && (!this.props.data.due_date || !this.props.data.due_date_or_completed_at_date)) {
      return null;
    }
    let dateTitle,
      dateBody;
    if (this.props.data.state == 'finished') {
      dateTitle = 'Completed';
      dateBody = this.props.data.completed_at ? this.props.data.completed_at : this.props.data.due_date_or_completed_at_date;
    } else {
      dateTitle = 'Due';
      dateBody = this.props.data.due_date_or_completed_at_date ? this.props.data.due_date_or_completed_at_date : this.props.data.due_date;
    }
    return (
      <div className="activity-detail">
        <p>
          <strong>{`${dateTitle}: `}</strong>{dateBody}
        </p>
      </div>
    );
  },

  render() {
    return (
      <div className={this.getClassName()}>
        <div className="activity-detail">
          <div className="activity-detail-body">
            <strong>Objective:</strong>{` ${this.props.data.activity.description}`}
            {this.dateOrNot()}
          </div>
        </div>
      </div>
    );
  },
});
