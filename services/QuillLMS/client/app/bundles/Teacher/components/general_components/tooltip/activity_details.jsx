import React from 'react';
import moment from 'moment';

export const ActivityDetails = ({ data }) => {

  if (!Object.keys(data).length) { return <span /> }

  const { concept_results, started_at, updated, scores, activity_description } = data;

  function getClassName() {
    if (concept_results && concept_results.length) {
      return 'activity-details';
    }
    return 'activity-details no-concept-results';
  };

  function detailOrNot() {
    let dateTitle, dateBody;
    if (!concept_results || !concept_results.length) {
      if (started_at) {
        dateTitle = 'Started'
        dateBody = started_at
      }
    } else {
      const scoresExist = scores && scores.length;
      const firstCr = concept_results[0];
      // check if scores exist and use updated for most recent activity completion date
      if (scoresExist && updated) {
        dateTitle = 'Completed';
        dateBody = updated;
      } else {
        dateTitle = 'Due';
        dateBody = firstCr.due_date;
      }
    }
    const objectiveSection = activity_description ? <p><strong>Objectives:</strong>{` ${activity_description}`}</p> : <span />
    const dateSection = dateTitle ? <p><strong>{`${dateTitle}: `}</strong>{`${moment(dateBody).format('MMMM D, YYYY')}`}</p> : <span />

    return (
      <div className="activity-detail">
        {objectiveSection}
        {dateSection}
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
