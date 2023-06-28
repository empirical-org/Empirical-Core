import * as React from 'react'
import queryString from 'query-string';
import * as Pusher from 'pusher-js';

import { Grade, School, Timeframe, } from './shared'

import { requestGet, } from './../../../../modules/request'
import { ButtonLoadingSpinner, } from '../../../Shared/index'
import { unorderedArraysAreEqual, } from '../../../../modules/unorderedArraysAreEqual'

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
  adminId: number;
  customTimeframeStart?: any;
  customTimeframeEnd?: any;
  comingSoon?: boolean;
}

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
        <td>{value ? count : '—'}</td>
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

const SnapshotRanking = ({ label, queryKey, headers, comingSoon, searchCount, selectedGrades, selectedSchoolIds, selectedTeacherIds, selectedClassroomIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, adminId, passedData, }: SnapshotRankingProps) => {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)

  React.useEffect(() => {
    if (comingSoon) { return }

    resetToDefault()

    getData()
  }, [searchCount])

  function resetToDefault() {
    setData(passedData || null)
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

    const requestUrl = queryString.stringifyUrl({ url: '/snapshots/top_x', query: searchParams }, { arrayFormat: 'bracket' })

    requestGet(`${requestUrl}`, (body) => {
      if (!body.hasOwnProperty('results')) {
        setLoading(true)
      } else {
        const { results, } = body
        // We consider `null` to be a lack of data, so if the result is `[]` we need to explicitly `setData(null)`
        const data = results.length > 0 ? results : null
        setData(data)
        setLoading(false)
      }
    })
  }

  function initializePusher() {
    const pusher = new Pusher(process.env.PUSHER_KEY, { encrypted: true, });
    const channel = pusher.subscribe(String(adminId));
    channel.bind('admin-snapshot-top-x-cached', (body) => {
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
          {comingSoon ? <h3 className="coming-soon">{label} (coming soon)</h3> : <h3>{label}</h3>}
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
