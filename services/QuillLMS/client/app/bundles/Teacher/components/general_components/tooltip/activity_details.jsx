import React from 'react'
import moment from 'moment'

export const ActivityDetails = ({ data }) => {

  if (!Object.keys(data).length) { return <span /> }

  const { concept_results, started_at, completed_at, updated, scores, activity_description } = data

  function getClassName() {
    if (concept_results && concept_results.length) {
      return 'activity-details'
    }
    return 'activity-details no-concept-results'
  }

  function detailOrNot() {
    let dateTitle, dateBody, completedTitle, completedBody

    if (!concept_results || !concept_results.length) {
      if (started_at) {
        dateTitle = 'Started'
        dateBody = started_at
      }
    } else {
      const scoresExist = scores && scores.length
      const firstCr = concept_results[0]

      if (scoresExist) {
        const completedAt = scores[0].completed_at

        if (completedAt) {
          completedTitle = 'Completed'
          completedBody = completedAt
        }

        if (updated) {
          dateTitle = 'Most Recent Attempt'
          dateBody = updated
        }

      } else {
        dateTitle = 'Due'
        dateBody = firstCr.due_date
      }
    }

    const objectiveSection = activity_description ? <p><strong>Objectives:</strong>{` ${activity_description}`}</p> : <span />
    const dateSection = dateTitle ? <p><strong>{`${dateTitle}: `}</strong>{`${moment(dateBody).format('MMMM D, YYYY')}`}</p> : <span />
    const completedSection = completedTitle ? <p><strong>{`${completedTitle}: `}</strong>{`${moment(completedBody).format('MMMM D, YYYY')}`}</p> : <span />

    return (
      <div className="activity-detail">
        {objectiveSection}
        {dateSection}
        {completedSection}
      </div>
    )
  }

  return (
    <div className={getClassName()}>
      <div className="activity-detail">
        <div className="activity-detail-body">
          {detailOrNot()}
        </div>
      </div>
    </div>
  )
}

export default ActivityDetails
