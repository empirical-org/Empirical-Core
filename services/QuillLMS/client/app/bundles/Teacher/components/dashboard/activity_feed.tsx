import * as React from 'react';

import { DataTable, expandIcon, } from '../../../Shared/index'
import { requestGet } from '../../../../modules/request';

const listIllustrationSrc = `${process.env.CDN_URL}/images/pages/dashboard/illustrations-list.svg`

const headers = [
  {
    width: '125px',
    name: 'Student',
    attribute: 'studentName',
  }, {
    width: '380px',
    name: 'Activity',
    attribute: 'activityName',
  }, {
    width: '124px',
    name: 'Score',
    attribute: 'scoreTag',
  }, {
    width: '84px',
    name: 'Completed',
    attribute: 'completed',
    noTooltip: true,
    headerClassName: 'completed-section',
    rowSectionClassName: 'completed-section'
  }
]

const ABSOLUTE_MAX = 40
const INITIAL_MAX = 20

const MobileActivityRow = ({ row, }) => {
  const {
    studentName,
    activityName,
    scoreTag,
    link,
    completed,
  } = row
  return (
    <a className="mobile-data-row focus-on-light" href={link}>
      <div className="top-row">
        <span>{studentName}</span>
        <span>{completed}</span>
      </div>
      <div>{activityName}</div>
      <div>{scoreTag}</div>
    </a>
  )
}

const ActivityFeed = ({ onMobile, activityFeed, }) => {
  const [showAll, setShowAll] = React.useState(false)

  function handleShowMoreClick() { setShowAll(true) }

  const rows = activityFeed.slice(0, showAll ? ABSOLUTE_MAX : INITIAL_MAX).map(act => {
    const { student_name, activity_name, score, completed, id, unit_id, classroom_id, user_id, activity_id, } = act
    return {
      className: "focus-on-light",
      studentName: student_name,
      activityName: activity_name,
      scoreTag: <span className={`score-tag ${score.toLowerCase().split(' ').join('-')}`}>{score}</span>,
      link: `/teachers/progress_reports/report_from_classroom_and_unit_and_activity_and_user/classroom/${classroom_id}/unit/${unit_id}/user/${user_id}/activity/${activity_id}`,
      completed,
      id,
    }
  })

  if (activityFeed.length === 0) {
    return (
      <section className="activity-feed empty">
        <img alt="Document with a bulleted list illustration" src={listIllustrationSrc} />
        <h2>Activity feed</h2>
        <p>Once your students complete activities, you’ll be able to see them here.</p>
      </section>
    )
  }

  let bottomButton
  if (activityFeed.length > INITIAL_MAX) {
    bottomButton = showAll ? <a className="bottom-button focus-on-light interactive-wrapper" href="/teachers/classrooms/scorebook">See all activities</a> : <button className="bottom-button focus-on-light interactive-wrapper" onClick={handleShowMoreClick} type="button">Show more <img alt={expandIcon.alt} src={expandIcon.src} /></button>
  }

  const dataDisplay = onMobile ? rows.map(r => <MobileActivityRow key={r.id} row={r} />) : <DataTable headers={headers} rows={rows} />

  return (
    <section className="activity-feed populated">
      <h2>Activity feed</h2>
      {dataDisplay}
      {bottomButton}
    </section>
  )

}

export default ActivityFeed
