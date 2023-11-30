import moment from 'moment'
import * as React from 'react'
import ActivityDetailsSection from './activity_details_section'
import { NOT_APPLICABLE } from '../../../../Shared'

export const ActivityDetails = ({ data }) => {

  if (!Object.keys(data).length) { return <span /> }

  function getClassName() {
    const { sessions, } = data
    if (sessions && sessions.length) {
      return 'activity-details'
    }
    return 'activity-details no-concept-results'
  }

  function detailOrNot() {
    const { activity_description, dueDate, publishDate, scheduled, unitActivityCreatedAt, } = data

    const publishDateForDisplay = publishDate || unitActivityCreatedAt
    const objectiveSection = activity_description ? <ActivityDetailsSection customClass="no-border-top" description={activity_description} header="Objectives" /> : <span />
    const publishDateSection = <ActivityDetailsSection customClass="no-border-top" description={moment.utc(publishDateForDisplay).format('MMMM D, YYYY [at] h:mm a')} header={scheduled ? 'Scheduled For' : 'Published'} />
    const dueDateSection = <ActivityDetailsSection customClass="no-border-top" description={dueDate ? `${moment.utc(dueDate).format('MMMM D, YYYY [at] h:mm a')}` : NOT_APPLICABLE} header="Due" />

    return (
      <div className="activity-detail">
        {objectiveSection}
        {publishDateSection}
        {dueDateSection}
      </div>
    )
  }

  return (
    <div className={getClassName()}>
      {detailOrNot()}
    </div>
  )
}

export default ActivityDetails
