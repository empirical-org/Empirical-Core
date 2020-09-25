import React from 'react';
import moment from 'moment';

import activityTypeFromClassificationId from '../../modules/activity_type_from_classification_id.js';

export default class ActivityDetails extends React.Component {
  getClassName = () => {
    if (this.props.data.concept_results && this.props.data.concept_results.length) {
      return 'activity-details';
    }
    return 'activity-details no-concept-results';
  };

  detailOrNot = () => {
    let dateTitle,
    dateBody;
    if (!this.props.data.concept_results || !this.props.data.concept_results.length) {
      if (this.props.data.started_at) {
        dateTitle = 'Started'
        dateBody = this.props.data.started_at
      }
    } else {
      const firstScore = this.props.data.scores[0]
      const firstCr = this.props.data.concept_results[0];
      if (firstScore && firstScore.completed_at) {
        dateTitle = 'Completed';
        dateBody = firstScore.completed_at;
      } else {
        dateTitle = 'Due';
        dateBody = firstCr.due_date;
      }
    }
    const obj = this.props.data.activity_description;
    const objSection = obj ? <p><strong>Objectives:</strong>{` ${obj}`}</p> : <span />
    const dateSection = dateTitle ? <p><strong>{`${dateTitle}: `}</strong>{`${moment(dateBody).format('MMMM D, YYYY')}`}</p> : <span />
    return (
      <div className="activity-detail">
        {objSection}
        {dateSection}
      </div>
    );
  };

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
  }
}
