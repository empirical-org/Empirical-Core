import * as React from 'react'

import { requestPost, } from './../../../../modules/request'
import { ButtonLoadingSpinner, } from '../../../Shared/index'
import { hashPayload, selectionsEqual } from '../../shared'

const expandImg = <img alt="" src={`${process.env.CDN_URL}/images/pages/administrator/expand.svg`} />

interface SnapshotRankingProps {
  label: string;
  headers: Array<string>;
  queryKey: string;
  searchCount: number;
  selectedGrades: Array<string>;
  selectedSchoolIds: Array<number>;
  selectedTeacherIds: Array<number>;
  selectedClassroomIds: Array<number>;
  selectedTimeframe: string;
  customTimeframeStart?: any;
  customTimeframeEnd?: any;
  pusherChannel?: any;
}

const PUSHER_EVENT_KEY = 'admin-snapshot-top-x-cached'
const RETRY_TIMEOUT = 20000

const RankingModal = ({ label, closeModal, headers, data, }) => {
  return (
    <div className="modal-container ranking-modal-container">
      <div className="modal-background" />
      <div className="ranking-modal quill-modal modal-body">
        <h2>{label}</h2>
        <DataTable
          data={data}
          headers={headers}
          numberOfRows={10}
        />
        <div className="button-section">
          <button className="quill-button medium secondary outlined focus-on-light" onClick={closeModal} type="button">Close</button>
        </div>
      </div>
    </div>
  )
}

const DataTable = ({ headers, data, numberOfRows, }) => {
  const headerElements = headers.map(header => (<th key={header}>{header}</th>))

  const dataRowsForTable = data ? data.slice(0, numberOfRows) : [{}, {}, {}]

  const rowElements = dataRowsForTable.map((row, i) => {
    const { value, count, } = row

    return (
      <tr className="data-row" key={i}>
        <td>{value || '—'}</td>
        <td>{value ? count?.toLocaleString() : '—'}</td>
      </tr>
    )
  })

  return (
    <table className="table">
      <tr className="header-row">
        {headerElements}
      </tr>
      {rowElements}
    </table>
  )
}

const SnapshotRanking = ({ label, queryKey, headers, searchCount, selectedGrades, selectedSchoolIds, selectedTeacherIds, selectedClassroomIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, passedData, pusherChannel, }: SnapshotRankingProps) => {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [retryTimeout, setRetryTimeout] = React.useState(null)
  const [showModal, setShowModal] = React.useState(false)
  const [pusherMessage, setPusherMessage] = React.useState(null)
  const [customTimeframeStartString, setCustomTimeframeStartString] = React.useState(null)
  const [customTimeframeEndString, setCustomTimeframeEndString] = React.useState(null)

  React.useEffect(() => {
    initializePusher()
  }, [pusherChannel, searchCount])

  React.useEffect(() => {
    resetToDefault()

    getData()
  }, [searchCount])

  React.useEffect(() => {
    if (!customTimeframeStart) return

    setCustomTimeframeStartString(customTimeframeStart.toISOString())
  }, [customTimeframeStart])

  React.useEffect(() => {
    if (!customTimeframeEnd) return setCustomTimeframeEndString(null)

    setCustomTimeframeEndString(customTimeframeEnd.toISOString())
  }, [customTimeframeEnd])

  React.useEffect(() => {
    if (!pusherMessage) return

    if (filtersMatchHash(pusherMessage)) getData()
  }, [pusherMessage])

  function resetToDefault() {
    setData(passedData || null)
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

    requestPost(`/snapshots/top_x`, searchParams, (body) => {
      if (!body.hasOwnProperty('results')) {
        setRetryTimeout(setTimeout(getData, RETRY_TIMEOUT))
        setLoading(true)
      } else {
        clearTimeout(retryTimeout)

        const { results, } = body
        // We consider `null` to be a lack of data, so if the result is `[]` we need to explicitly `setData(null)`
        const data = results.length > 0 ? results : null
        setData(data)

        setLoading(false)
      }
    })
  }

  function filtersMatchHash(hashMessage) {
    const filterTarget = [].concat(
      queryKey,
      selectedTimeframe,
      customTimeframeStartString,
      customTimeframeEndString,
      selectedSchoolIds,
      selectedGrades,
      selectedTeacherIds,
      selectedClassroomIds
    )

    const filterHash = hashPayload(filterTarget)

    return hashMessage == filterHash
  }

  function initializePusher() {
    pusherChannel?.bind(`${PUSHER_EVENT_KEY}:${queryKey}`, (body) => {
      const { message, } = body
      setPusherMessage(message)
    });
  };

  function openModal() {
    if (!data) { return }
    setShowModal(true)
  }

  function closeModal() { setShowModal(false) }

  let className = "snapshot-item snapshot-ranking"
  className+= data ? ' has-data' : ' no-data'

  // disabling these rules for the div container because the behavior is handled by the button for keyboard users
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  return (
    <section className={className}>
      {showModal && (
        <RankingModal
          closeModal={closeModal}
          data={data}
          headers={headers}
          label={label}
        />
      )}
      <div onClick={openModal}>
        <div className="header">
          <h3>{label}</h3>
          {loading && <div className="loading-spinner-wrapper"><ButtonLoadingSpinner /></div>}
          {data && <button aria-label="Open modal with additional seven lines of table data" className="interactive-wrapper focus-on-light" onClick={openModal} type="button">{expandImg}</button>}
        </div>
        <DataTable
          data={data}
          headers={headers}
          numberOfRows={3}
        />
      </div>
    </section>
  )
}
/* eslint-enable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */

export default SnapshotRanking
