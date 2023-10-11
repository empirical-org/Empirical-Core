import * as React from 'react'

import md5 from 'md5'

import { SMALL, POSITIVE, NEGATIVE, NONE } from './shared'

import { requestPost, } from './../../../../modules/request'
import { ButtonLoadingSpinner, } from '../../../Shared/index'
import { selectionsEqual } from '../../shared'

const smallArrowUpIcon = <img alt="Arrow pointing up" className="small" src={`${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/arrow_up_icon.svg`} />
const smallArrowDownIcon = <img alt="Arrow pointing down" className="small" src={`${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/arrow_down_icon.svg`} />
const mediumArrowUpIcon = <img alt="Arrow pointing up" className="medium" src={`${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/arrow_up_icon.svg`} />
const mediumArrowDownIcon = <img alt="Arrow pointing down" className="medium" src={`${process.env.CDN_URL}/images/pages/administrator/usage_snapshot_report/arrow_down_icon.svg`} />

interface SnapshotCountProps {
  label: string;
  size: 'small'|'medium';
  queryKey: string;
  searchCount: number;
  selectedGrades: Array<string>;
  selectedSchoolIds: Array<number>;
  selectedClassroomIds: Array<number>;
  selectedTeacherIds: Array<number>;
  selectedTimeframe: string;
  customTimeframeStart?: any;
  customTimeframeEnd?: any;
  passedCount?: number;
  passedChange?: number;
  passedChangeDirection?: 'negative'|'positive'|'none';
  singularLabel?: string;
  pusherChannel?: any;
}

const PUSHER_EVENT_KEY = 'admin-snapshot-count-cached'

const SnapshotCount = ({ label, size, queryKey, searchCount, selectedGrades, selectedSchoolIds, selectedTeacherIds, selectedClassroomIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, passedCount, passedChange, passedChangeDirection, singularLabel, pusherChannel, }: SnapshotCountProps) => {
  const [count, setCount] = React.useState(passedCount || null)
  const [change, setChange] = React.useState(passedChange || 0)
  const [changeDirection, setChangeDirection] = React.useState(passedChangeDirection || null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    initializePusher()

    resetToDefault()

    getData()
  }, [searchCount])

  function resetToDefault() {
    setCount(passedCount || null)
    setChangeDirection(passedChangeDirection || null)
    setChange(passedChange || 0)
  }

  function getData() {
    const searchParams = {
      query: queryKey,
      timeframe: selectedTimeframe,
      timeframe_custom_start: customTimeframeStart,
      timeframe_custom_end: customTimeframeEnd,
      school_ids: selectedSchoolIds,
      teacher_ids: selectedTeacherIds,
      classroom_ids: selectedClassroomIds,
      grades: selectedGrades
    }

    requestPost(`/snapshots/count`, searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        const { previous, current, } = results

        const roundedCurrent = (current === null) ? 'N/A' : Math.round(current || 0)

        setCount(roundedCurrent)

        if (!previous || current === null) {
          setChangeDirection(NONE)
          setLoading(false)
          return
        }

        const roundedPrevious = Math.round(previous || 0)

        const changeTotal = Math.round(((roundedCurrent - roundedPrevious) / (roundedPrevious || 1)) * 100)
        setChange(Math.abs(changeTotal))
        if (changeTotal) {
          setChangeDirection(changeTotal > 0 ? POSITIVE : NEGATIVE)
        } else {
          setChangeDirection(NONE)
        }
        setLoading(false)
      }
    })
  }

  function initializePusher() {
    pusherChannel?.bind(PUSHER_EVENT_KEY, (body) => {
      const { message, } = body

      const filterHash = md5([
        queryKey,
        selectedTimeframe,
        selectedSchoolIds.join('-'),
        selectedGrades?.join('-'),
        selectedTeacherIds?.join('-'),
        selectedClassroomIds?.join('-')
      ].join('-'))

      console.log(`${message} == ${filterHash} ? ${message == filterHash}`)

      if (message == filterHash) getData()
//      const queryKeysAreEqual = message.query === queryKey
//      const timeframesAreEqual = message.timeframe === selectedTimeframe
//      const schoolIdsAreEqual = selectionsEqual(message.school_ids, selectedSchoolIds)
//      const teacherIdsAreEqual = selectionsEqual(message.teacher_ids, selectedTeacherIds)
//      const classroomIdsAreEqual = selectionsEqual(message.classroom_ids, selectedClassroomIds)
//      const gradesAreEqual =  selectionsEqual(message.grades, selectedGrades?.map(grade => String(grade))) || (!message.grades && !selectedGrades.length)
//
//      if (queryKeysAreEqual && timeframesAreEqual && schoolIdsAreEqual && gradesAreEqual && teacherIdsAreEqual && classroomIdsAreEqual) {
//        getData()
//      }
    });
  };

  const className = `snapshot-item snapshot-count ${size} ${changeDirection || ''}`

  let icon

  if (changeDirection === POSITIVE) {
    icon = size === SMALL ? smallArrowUpIcon : mediumArrowUpIcon
  } else if (changeDirection === NEGATIVE) {
    icon = size === SMALL ? smallArrowDownIcon : mediumArrowDownIcon
  }

  return (
    <section className={className}>
      {loading && <div className="loading-spinner-wrapper"><ButtonLoadingSpinner /></div>}
      <div className="count-and-label">
        <span className="count">{count?.toLocaleString() || '—'}</span>
        <span className="snapshot-label">{count === 1 && singularLabel ? singularLabel : label}</span>
      </div>
      <div className="change">
        {icon}
        <span>{change === 0 ? null : `${change}%`}</span>
      </div>
    </section>
  )
}

export default SnapshotCount
