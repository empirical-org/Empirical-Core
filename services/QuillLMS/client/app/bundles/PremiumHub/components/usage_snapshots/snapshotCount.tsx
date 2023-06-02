import React from 'react'
import queryString from 'query-string';
import Pusher from 'pusher-js';
import _ from 'lodash'

import { SMALL, MEDIUM, POSITIVE, NEGATIVE, } from './shared'

import { requestGet, } from './../../../../modules/request'

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
  selectedTimeframe: string;
  adminId: number;
  customTimeframeStart?: any;
  customTimeframeEnd?: any;
  comingSoon?: boolean;
}

const SnapshotCount = ({ label, size, queryKey, comingSoon, searchCount, selectedGrades, selectedSchoolIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, adminId, passedCount, passedChange, passedChangeDirection }: SnapshotCountProps) => {
  const [count, setCount] = React.useState(passedCount || null)
  const [change, setChange] = React.useState(passedChange || 0)
  const [changeDirection, setChangeDirection] = React.useState(passedChangeDirection || null)

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
      grades: selectedGrades
    }

    const requestUrl = queryString.stringifyUrl({ url: '/snapshots/count', query: searchParams }, { arrayFormat: 'bracket' })

    requestGet(`${requestUrl}`, (body) => {
      if (!body.hasOwnProperty('current')) { return }

      const { previous, current, } = body

      const roundedCurrent = Math.round(current || 0)

      setCount(roundedCurrent)

      if (!previous) {
        setChangeDirection(POSITIVE)
        return
      }

      const roundedPrevious = Math.round(previous || 0)

      const changeTotal = Math.round(((roundedCurrent - roundedPrevious) / (roundedPrevious || 1)) * 100)
      setChange(Math.abs(changeTotal))
      setChangeDirection(changeTotal > 0 ? POSITIVE : NEGATIVE)
    })
  }

  function initializePusher() {
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminId));
    channel.bind('admin-snapshot-count-cached', (body) => {
      const { message, } = body

      const queryKeysAreEqual = message.query === queryKey
      const timeframesAreEqual = message.timeframe === selectedTimeframe
      const schoolIdsAreEqual = _.isEqual(message.school_ids, selectedSchoolIds.map(id => String(id)))
      const gradesAreEqual =  _.isEqual(message.grades, selectedGrades.map(grade => String(grade)))

      if (queryKeysAreEqual && timeframesAreEqual && schoolIdsAreEqual && gradesAreEqual) {
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
      <div className="count-and-label">
        {comingSoon ? <span className="coming-soon">Coming soon</span> : <span className="count">{count?.toLocaleString() || '—'}</span>}
        <span className="snapshot-label">{label}</span>
      </div>
      <div className="change">
        {icon}
        <span>{change}%</span>
      </div>
    </section>
  )
}

export default SnapshotCount
