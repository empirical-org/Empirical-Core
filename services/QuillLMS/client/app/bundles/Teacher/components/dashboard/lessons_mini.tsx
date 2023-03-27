import * as React from 'react';

import {
    DataTable, expandIcon, fileChartIcon, fileDownloadIcon, helpIcon, playBoxIcon,
    previewIcon
} from '../../../Shared/index';

const INITIAL_MAX = 5

interface Lessons {
  classroom_name: string,
  activity_name: string,
  activity_id: number,
  unit_id: number,
  classroom_id: number,
  classroom_unit_id: number,
  supporting_info?: string
}

interface LessonsMiniState {
  loading: boolean;
  lessons: Array<Lessons>;
  showAll: boolean;
}

const headers = [
  {
    name: 'Quill Lesson',
    attribute: 'lesson',
    width: '290px'
  },
  {
    name: 'Class',
    attribute: 'classroom',
    width: '300px'
  },
  {
    name: 'More',
    attribute: 'actions',
    isActions: true,
  },
  {
    name: 'Present',
    attribute: 'present',
    width: '78px',
    noTooltip: true,
    rowSectionClassName: "last-row-section",
    headerClassName: 'last-header'
  }
]

const MobileLessonRow = ({ row, }) => {
  const {
    lesson,
    presentHref,
    classroom
  } = row
  return (
    <div className="mobile-data-row">
      <div className="top-row">
        <span>{lesson}</span>
        <a className="focus-on-light" href={presentHref}>Present</a>
      </div>
      <div>{classroom}</div>
    </div>
  )
}

const LessonsMini = ({ lessons, onMobile, }) => {
  const [showAll, setShowAll] = React.useState<LessonsMiniState>(false);

  function handleShowMoreClick() { setShowAll(true) }

  if (!lessons.length) { return <span /> }

  const rows = lessons.slice(0, showAll ? lessons.length : INITIAL_MAX).map(lesson => {
    const {
      classroom_name,
      activity_name,
      activity_id,
      unit_id,
      classroom_id,
      classroom_unit_id,
      supporting_info,
    } = lesson
    const previewHref = `/preview_lesson/${activity_id}`
    const customizeHref = `/customize/${activity_id}`
    const downloadLessonPlanHref = `/activities/${activity_id}/supporting_info`
    const presentHref = `/teachers/classroom_units/${classroom_unit_id}/launch_lesson/${activity_id}`

    const previewActionObject = { element: <a className="action focus-on-light" href={previewHref}><img alt={previewIcon.alt} src={previewIcon.src} /><span>Preview</span></a> }
    const customizeActionObject = { element: <a className="action focus-on-light" href={customizeHref}><img alt={fileChartIcon.alt} src={fileChartIcon.src} /><span>Customize</span></a> }
    const downloadLessonPlanActionObject = { element: <a className="action focus-on-light" href={downloadLessonPlanHref}><img alt={fileDownloadIcon.alt} src={fileDownloadIcon.src} /><span>Download lesson plan</span></a> }

    const actions = supporting_info ? [previewActionObject, customizeActionObject, downloadLessonPlanActionObject] : [previewActionObject, customizeActionObject]

    return {
      id: `${activity_id}-${classroom_id}-${unit_id}`,
      classroom: classroom_name,
      lesson: activity_name,
      actions,
      present: <a className="focus-on-light" href={presentHref}><img alt={playBoxIcon.alt} src={playBoxIcon.src} /><span>Present</span></a>,
      presentHref
    }
  })

  const dataDisplay = onMobile ? rows.map(r => <MobileLessonRow key={r.id} row={r} />) : <DataTable headers={headers} rows={rows} showActions={true} />

  return (
    <section className="lessons-mini">
      <header>
        <h2>
          <span>Present a live </span>
          <span className="no-break">
            <span>lesson</span>
            <a className="focus-on-light" href="https://support.quill.org/en/articles/5014099-how-does-the-present-a-live-lesson-section-on-the-teacher-home-page-work" rel="noopener noreferrer" target="_blank"><img alt={helpIcon.alt} src={helpIcon.src} /></a>
          </span>
        </h2>
      </header>
      {dataDisplay}
      {lessons.length > INITIAL_MAX && !showAll && <button className="bottom-button focus-on-light interactive-wrapper" onClick={handleShowMoreClick} type="button">Show more <img alt={expandIcon.alt} src={expandIcon.src} /></button>}
    </section>
  )
}

export default LessonsMini
