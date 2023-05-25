import React from 'react'

interface SnapshotRankingProps {
  label: string;
  headers: Array<string>;
  queryKey: string;
  comingSoon?: boolean;
}

const SnapshotRanking = ({ label, queryKey, headers, comingSoon, }: SnapshotRankingProps) => {
  const [data, setData] = React.useState(null)

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
        {comingSoon ? <span className="coming-soon">Coming soon</span> : <h3>{label}</h3>}
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
