import React from 'react'

import SnapshotCount from './snapshotCount'
import SnapshotRanking from './snapshotRanking'
import SnapshotFeedback from './snapshotFeedback'
import { COUNT, RANKING, FEEDBACK, } from './shared'

const SnapshotSection = ({ name, className, itemGroupings, }) => {
  const snapshotItemGroupings = itemGroupings.map(grouping => {
    const snapshotItems = grouping.items.map(item => {
      const {label, size, type, queryKey, comingSoon, headers, } = item
      if (type === COUNT) {
        return (
          <SnapshotCount
            comingSoon={comingSoon}
            key={queryKey}
            label={label}
            queryKey={queryKey}
            size={size}
          />
        )
      } else if (type === RANKING) {
        return (
          <SnapshotRanking
            comingSoon={comingSoon}
            headers={headers}
            key={queryKey}
            label={label}
            queryKey={queryKey}
          />
        )
      } else if (type === FEEDBACK) {
        return <SnapshotFeedback />
      }
    })

    return (
      <div className={grouping.className} key={grouping.className}>
        {snapshotItems}
      </div>
    )
  })

  return (
    <section className={`snapshot-section ${className}`}>
      <h2>{name}</h2>
      <div className="snapshot-section-content">
        {snapshotItemGroupings}
      </div>
    </section>
  )
}

export default SnapshotSection
