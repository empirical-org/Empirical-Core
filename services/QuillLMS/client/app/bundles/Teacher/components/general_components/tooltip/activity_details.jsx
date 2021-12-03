import React from 'react';
import moment from 'moment';

import { getTimeSpent } from '../../../helpers/studentReports';

export const ActivityDetails = ({ data }) => {

  if (!Object.keys(data).length) { return <span /> }

  const { concept_results, started_at, scores, activity_description, timespent } = data;

  function getClassName() {
    if (concept_results && concept_results.length) {
      return 'activity-details';
    }
    return 'activity-details no-concept-results';
  };

  function detailOrNot() {
    let dateTitle, dateBody, scoreBody;
    if ((!concept_results || !concept_results.length) && started_at) {
      dateTitle = 'Started'
      dateBody = started_at
    } else {
      const firstScore = scores && scores[0]
      const firstCr = concept_results && concept_results[0];
      if (firstScore && firstScore.completed_at) {
        dateTitle = 'Completed';
        dateBody = firstScore.completed_at;
        scoreBody = `${(firstScore.percentage * 100)}%`;
      } else {
        dateTitle = 'Due';
        dateBody = firstCr && firstCr.due_date;
      }
    }
    const objectiveSection = activity_description ? <p><strong>Objectives:</strong>{` ${activity_description}`}</p> : <span />
    const dateSection = dateTitle ? <p><strong>{`${dateTitle}: `}</strong>{`${moment(dateBody).format('MMMM D, YYYY')}`}</p> : <span />
    const scoreSection = scoreBody ? <p><strong>1st Score:</strong>{` ${scoreBody}`}</p> : <span />
    const timeSpentSection = timespent ? <p><strong>Time spent:</strong>{` ${getTimeSpent(timespent)}`}</p> : <span />
    return (
      <div className="activity-detail">
        {objectiveSection}
        {dateSection}
        {scoreSection}
        {timeSpentSection}
      </div>
    );
  };

  return (
    <div className={getClassName()}>
      <div className="activity-detail">
        <div className="activity-detail-body">
          {detailOrNot()}
        </div>
      </div>
    </div>
  );
}

export default ActivityDetails
