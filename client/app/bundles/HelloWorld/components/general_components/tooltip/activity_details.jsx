import React from 'react';
import moment from 'moment';
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
    const firstCr = this.props.data.concept_results[0];
    if (firstCr.completed_at) {
      dateTitle = 'Completed';
      dateBody = firstCr.completed_at;
    } else {
      dateTitle = 'Due';
      dateBody = firstCr.due_date;
    }
    const obj = firstCr.description;
    return (
      <div className="activity-detail">
        <p>
          <strong>Objectives:</strong>{` ${obj}`}
        </p>
        <p>
          <strong>{`${dateTitle}: `}</strong>{`${moment(dateBody).format('MMMM D, YYYY')}`}
        </p>
      </div>
    );
  },

  // <strong>Objective:</strong>{` ${this.props.data.activity.description}`}
  render() {
    console.log(JSON.stringify(this.props));
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
