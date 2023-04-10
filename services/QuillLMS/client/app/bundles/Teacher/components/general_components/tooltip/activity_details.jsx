import moment from 'moment'
import React from 'react'

export const ActivityDetails = ({ data }) => {

  if (!Object.keys(data).length) { return <span /> }

  function getClassName() {
    const { concept_results, } = data
    if (concept_results && concept_results.length) {
      return 'activity-details'
    }
    return 'activity-details no-concept-results'
  }

  function detailOrNot() {
    const { concept_results, started_at, updated, scores, activity_description, dueDate, publishDate, scheduled, unitActivityCreatedAt, } = data
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

      }
    }

    const publishDateForDisplay = publishDate || unitActivityCreatedAt
    const objectiveSection = activity_description ? <p><strong>Objectives:</strong>{` ${activity_description}`}</p> : <span />
    const publishDateSection = <p><strong>{scheduled ? 'Scheduled For: ' : 'Published: '}</strong>{`${moment.utc(publishDateForDisplay).format('MMMM D, YYYY [at] h:mm a')}`}</p>
    const dueDateSection = <p><strong>Due: </strong>{dueDate ? `${moment.utc(dueDate).format('MMMM D, YYYY [at] h:mm a')}` : 'N/A'}</p>
    const dateSection = dateTitle ? <p><strong>{`${dateTitle}: `}</strong>{`${moment.utc(dateBody).format('MMMM D, YYYY')}`}</p> : <span />
    const completedSection = completedTitle ? <p><strong>{`${completedTitle}: `}</strong>{`${moment.utc(completedBody).format('MMMM D, YYYY')}`}</p> : <span />

    return (
      <div className="activity-detail">
        {objectiveSection}
        {publishDateSection}
        {dueDateSection}
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
