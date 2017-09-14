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

  detailOrNot() {
    if (!this.props.data.concept_results || !this.props.data.concept_results.length) {
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
    const obj = this.props.data.concept_results[0].description;
    return (
      <div className="activity-detail">
        <p>
          <strong>Objectives:</strong>{` ${obj}`}
        </p>
        <p>
          <strong>{`${dateTitle}: `}</strong>{dateBody}
        </p>
      </div>
    );
  },

  // <strong>Objective:</strong>{` ${this.props.data.activity.description}`}
  render() {
    return (
      <div className={this.getClassName()}>
        <div className="activity-detail">
          <div className="activity-detail-body">
            {this.detailOrNot()}
          </div>
        </div>
      </div>
    );
  },
});
