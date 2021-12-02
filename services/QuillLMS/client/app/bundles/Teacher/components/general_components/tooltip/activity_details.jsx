import React from 'react';
import moment from 'moment';

export const ActivityDetails = ({ data }) => {

  function getClassName() {
    if (data.concept_results && data.concept_results.length) {
      return 'activity-details';
    }
    return 'activity-details no-concept-results';
  };

  function getTimeSpent(seconds) {
    if(seconds < 60) {
      return `${seconds} seconds`;
    }
    if(seconds > 60 && seconds < 120) {
      return '1 minute';
    }
    return `${moment(data.timespent * 1000).format('m')} minutes`;
  }


  function detailOrNot() {
    let dateTitle, dateBody, scoreBody;
    if ((!data.concept_results || !data.concept_results.length) && data.started_at) {
      dateTitle = 'Started'
      dateBody = data.started_at
    } else {
      const firstScore = data.scores && data.scores[0]
      const firstCr = data.concept_results && data.concept_results[0];
      if (firstScore && firstScore.completed_at) {
        dateTitle = 'Completed';
        dateBody = firstScore.completed_at;
        scoreBody = `${(firstScore.percentage * 100)}%`;
      } else {
        dateTitle = 'Due';
        dateBody = firstCr && firstCr.due_date;
      }
    }
    const objective = data.activity_description;
    const timeSpent = data.timespent && getTimeSpent(data.timespent)
    const objSection = objective ? <p><strong>Objectives:</strong>{` ${objective}`}</p> : <span />
    const dateSection = dateTitle ? <p><strong>{`${dateTitle}: `}</strong>{`${moment(dateBody).format('MMMM D, YYYY')}`}</p> : <span />
    const scoreSection = scoreBody ? <p><strong>1st Score:</strong>{` ${scoreBody}`}</p> : <span />
    const timeSpentSection = timeSpent ? <p><strong>Time spent:</strong>{` ${timeSpent}`}</p> : <span />
    return (
      <div className="activity-detail">
        {objSection}
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
