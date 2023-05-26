import React from 'react'

import SnapshotCount from './snapshotCount'
import SnapshotRanking from './snapshotRanking'
import SnapshotFeedback from './snapshotFeedback'
import { COUNT, RANKING, FEEDBACK, } from './shared'

const SnapshotSection = ({ name, className, itemGroupings, searchCount, selectedGrades, selectedSchools, selectedTimeframe }) => {
  const snapshotItemGroupings = itemGroupings.map(grouping => {
    const snapshotItems = grouping.items.map(item => {
      const {label, size, type, queryKey, comingSoon, headers, } = item
      const sharedProps = {
        comingSoon,
        key: queryKey,
        label,
        queryKey,
        searchCount,
        selectedGrades,
        selectedSchools,
        selectedTimeframe
      }

      if (type === COUNT) {
        return (
          <SnapshotCount
            {...sharedProps}
            size={size}
          />
        )
      } else if (type === RANKING) {
        return (
          <SnapshotRanking
            {...sharedProps}
            headers={headers}
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
