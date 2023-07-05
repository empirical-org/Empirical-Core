import * as React from 'react'
import queryString from 'query-string';
import * as Pusher from 'pusher-js';

import { SMALL, POSITIVE, NEGATIVE, } from './shared'

import { requestGet, } from './../../../../modules/request'
import { ButtonLoadingSpinner, } from '../../../Shared/index'
import { unorderedArraysAreEqual, } from '../../../../modules/unorderedArraysAreEqual'

const smallArrowUpIcon = <img alt="Arrow pointing up" src={`${process.env.CDN_URL}/images/pages/administrator/small_arrow_up_icon.svg`} />
const smallArrowDownIcon = <img alt="Arrow pointing down" src={`${process.env.CDN_URL}/images/pages/administrator/small_arrow_down_icon.svg`} />
const mediumArrowUpIcon = <img alt="Arrow pointing up" src={`${process.env.CDN_URL}/images/pages/administrator/medium_arrow_up_icon.svg`} />
const mediumArrowDownIcon = <img alt="Arrow pointing down" src={`${process.env.CDN_URL}/images/pages/administrator/medium_arrow_down_icon.svg`} />

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
  adminId: number;
  customTimeframeStart?: any;
  customTimeframeEnd?: any;
  comingSoon?: boolean;
  passedCount?: number;
  passedChange?: number;
  passedChangeDirection?: 'negative'|'positive';
  singularLabel?: string;
}

const SnapshotCount = ({ label, size, queryKey, comingSoon, searchCount, selectedGrades, selectedSchoolIds, selectedTeacherIds, selectedClassroomIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, adminId, passedCount, passedChange, passedChangeDirection, singularLabel, }: SnapshotCountProps) => {
  const [count, setCount] = React.useState(passedCount || null)
  const [change, setChange] = React.useState(passedChange || 0)
  const [changeDirection, setChangeDirection] = React.useState(passedChangeDirection || null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (comingSoon) { return }

    resetToDefault()

    getData()
  }, [searchCount])

  function resetToDefault() {
    setCount(passedCount || null)
    setChangeDirection(passedChangeDirection || null)
    setChange(passedChange || 0)
  }

  function getData() {
    initializePusher()

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

    const requestUrl = queryString.stringifyUrl({ url: '/snapshots/count', query: searchParams }, { arrayFormat: 'bracket' })

    requestGet(`${requestUrl}`, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        const { previous, current, } = results

        const roundedCurrent = Math.round(current || 0)

        setCount(roundedCurrent)

        if (!previous) {
          setChangeDirection(POSITIVE)
          setLoading(false)
          return
        }

        const roundedPrevious = Math.round(previous || 0)

        const changeTotal = Math.round(((roundedCurrent - roundedPrevious) / (roundedPrevious || 1)) * 100)
        setChange(Math.abs(changeTotal))
        setChangeDirection(changeTotal > 0 ? POSITIVE : NEGATIVE)
        setLoading(false)
      }
    })
  }

  function initializePusher() {
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminId));
    channel.bind('admin-snapshot-count-cached', (body) => {
      const { message, } = body

      const queryKeysAreEqual = message.query === queryKey
      const timeframesAreEqual = message.timeframe === selectedTimeframe
      const schoolIdsAreEqual = unorderedArraysAreEqual(message.school_ids, selectedSchoolIds.map(id => String(id)))
      const teacherIdsAreEqual = unorderedArraysAreEqual(message.teacher_ids, selectedTeacherIds.map(id => String(id)))
      const classroomIdsAreEqual = unorderedArraysAreEqual(message.classroom_ids, selectedClassroomIds.map(id => String(id)))
      const gradesAreEqual =  unorderedArraysAreEqual(message.grades, selectedGrades.map(grade => String(grade))) || (!message.grades && !selectedGrades.length)

      if (queryKeysAreEqual && timeframesAreEqual && schoolIdsAreEqual && gradesAreEqual && teacherIdsAreEqual && classroomIdsAreEqual) {
        getData()
      }
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
        {comingSoon ? <span className="coming-soon">Coming soon</span> : <span className="count">{count?.toLocaleString() || '—'}</span>}
        <span className="snapshot-label">{count === 1 && singularLabel ? singularLabel : label}</span>
      </div>
      <div className="change">
        {icon}
        <span>{change}%</span>
      </div>
    </section>
  )
}

export default SnapshotCount
