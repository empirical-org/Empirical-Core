import * as React from 'react'

import { Grade, School, Timeframe, } from './shared'
import { ButtonLoadingSpinner, } from '../../../Shared/index'

interface SnapshotRankingProps {
  label: string;
  headers: Array<string>;
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

const SnapshotRanking = ({ label, queryKey, headers, comingSoon, searchCount, selectedGrades, selectedSchoolIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, adminId, }: SnapshotRankingProps) => {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  // query goes here

  let className = "snapshot-item snapshot-ranking"
  className+= data ? ' has-data' : ' no-data'

  const headerElements = headers.map(header => (<span key={header}>{header}</span>))

  const rowElements = Array.from(Array(3)).map(i => {
    const rowSections = headers.map(header => (<span key={`${header}-${i}`}>—</span>))
    return (
      <div className="data-row" key={i}>
        {rowSections}
      </div>
    )
  })

  return (
    <section className={className}>
      <div className="header">
        {comingSoon ? <h3 className="coming-soon">{label} (coming soon)</h3> : <h3>{label}</h3>}
        {loading && <div className="loading-spinner-wrapper"><ButtonLoadingSpinner /></div>}
      </div>
      <div className="table">
        <div className="header-row">
          {headerElements}
        </div>
        {rowElements}
      </div>
    </section>
  )
}

export default SnapshotRanking
