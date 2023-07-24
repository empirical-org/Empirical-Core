import * as React from 'react'

import SnapshotCount from './snapshotCount'
import SnapshotRanking from './snapshotRanking'
import SnapshotFeedback from './snapshotFeedback'
import { COUNT, RANKING, FEEDBACK, } from './shared'

const SnapshotSection = ({ name, className, itemGroupings, searchCount, selectedGrades, selectedSchoolIds, selectedClassroomIds, selectedTeacherIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, pusherChannel, }) => {
  const snapshotItemGroupings = itemGroupings.map(grouping => {
    const snapshotItems = grouping.items.map(item => {
      const { label, size, type, queryKey, headers, singularLabel, } = item
      const sharedProps = {
        key: queryKey,
        label,
        queryKey,
        searchCount,
        selectedGrades,
        selectedSchoolIds,
        selectedTeacherIds,
        selectedClassroomIds,
        selectedTimeframe,
        customTimeframeEnd,
        customTimeframeStart,
        pusherChannel,
      }

      if (type === COUNT) {
        return (
          <SnapshotCount
            {...sharedProps}
            singularLabel={singularLabel}
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
