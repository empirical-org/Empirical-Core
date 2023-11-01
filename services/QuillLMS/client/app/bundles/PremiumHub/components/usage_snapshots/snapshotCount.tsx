import * as React from 'react'

import { SMALL, POSITIVE, NEGATIVE, NONE } from './shared'

import { requestPost, } from './../../../../modules/request'
import { ButtonLoadingSpinner, } from '../../../Shared/index'
import { hashPayload, selectionsEqual } from '../../shared'

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

const PUSHER_CURRENT_EVENT_KEY = 'admin-snapshot-count-cached'
const PUSHER_PREVIOUS_EVENT_KEY = 'admin-snapshot-previous-count-cached'
const NOT_APPLICABLE = 'N/A'

const SnapshotCount = ({ label, size, queryKey, searchCount, selectedGrades, selectedSchoolIds, selectedTeacherIds, selectedClassroomIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, passedCount, passedPrevious, passedChange, passedChangeDirection, singularLabel, pusherChannel, }: SnapshotCountProps) => {
  const [count, setCount] = React.useState(passedCount || null)
  const [previous, setPrevious] = React.useState(passedPrevious)
  const [change, setChange] = React.useState(passedChange)
  const [changeDirection, setChangeDirection] = React.useState(passedChangeDirection || null)
  const [loading, setLoading] = React.useState(false)
  const [currentRetryTimeout, setCurrentRetryTimeout] = React.useState(null)
  const [previousRetryTimeout, setPreviousRetryTimeout] = React.useState(null)

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel])

  React.useEffect(() => {
    initializePusher()

    resetToDefault()

    setCurrentRetryTimeout(setTimeout(getCurrentData, 20000))
    setPreviousRetryTimeout(setTimeout(getPreviousData, 20000))
  }, [searchCount])

  React.useEffect(() => {
    if (currentRetryTimeout) getCurrentData()
  }, [currentRetryTimeout])

  React.useEffect(() => {
    if (previousRetryTimeout) getPreviousData()
  }, [previousRetryTimeout])

  React.useEffect(() => {
    if (!previous || count === NOT_APPLICABLE || count === null) {
      setChangeDirection(NONE)
      return
    }

    const roundedPrevious = Math.round(previous || 0)

    const changeTotal = Math.round(((count - roundedPrevious) / (roundedPrevious || 1)) * 100)
    setChange(Math.abs(changeTotal))
    if (changeTotal) {
      setChangeDirection(changeTotal > 0 ? POSITIVE : NEGATIVE)
    } else {
      setChangeDirection(NONE)
    }
  }, [count, previous])

  function resetToDefault() {
    setCount(passedCount || null)
    setChangeDirection(passedChangeDirection || null)
    setChange(passedChange || 0)
  }

  function getSearchParams() {
    return {
      query: queryKey,
      timeframe: selectedTimeframe,
      timeframe_custom_start: customTimeframeStart,
      timeframe_custom_end: customTimeframeEnd,
      school_ids: selectedSchoolIds,
      teacher_ids: selectedTeacherIds,
      classroom_ids: selectedClassroomIds,
      grades: selectedGrades
    }
  }

  function getCurrentData() {

    requestPost(`/snapshots/count`, getSearchParams(), (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
        return
      }

      clearTimeout(currentRetryTimeout)

      const { results, } = body
      const { count } = results

      setCount((count === null) ? NOT_APPLICABLE : Math.round(count || 0))

      setLoading(false)
    })
  }

  function getPreviousData() {
    requestPost(`/snapshots/count?previous_timeframe=true`, getSearchParams(), (body) => {
      if (!body.hasOwnProperty('results')) return

      clearTimeout(previousRetryTimeout)

      const { results, } = body
      const { count } = results

      setPrevious(Math.round(count || 0))
    })
  }

  function filtersMatchHash(hashMessage) {
    const filterTarget = [].concat(
      queryKey,
      selectedTimeframe,
      selectedSchoolIds,
      selectedGrades,
      selectedTeacherIds,
      selectedClassroomIds
    )

    const filterHash = hashPayload(filterTarget)

    return hashMessage == filterHash
  }

  function initializePusher() {
    pusherChannel?.bind(PUSHER_CURRENT_EVENT_KEY, (body) => {
      const { message, } = body

      if (filtersMatchHash(message)) getCurrentData()
    });

    pusherChannel?.bind(PUSHER_PREVIOUS_EVENT_KEY, (body) => {
      const { message, } = body

      if (filtersMatchHash(message)) getPreviousData()
    });
  };

  let className = `snapshot-item snapshot-count ${size}`
  if (changeDirection === NONE && count !== NOT_APPLICABLE) {
    className += ' no-change'
  } else if (changeDirection !== NONE) {
    className += ` ${changeDirection}`
  }

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
