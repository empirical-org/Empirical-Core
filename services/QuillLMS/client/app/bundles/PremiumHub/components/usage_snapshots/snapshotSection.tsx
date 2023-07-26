import * as React from 'react'

import SnapshotCount from './snapshotCount'
import SnapshotRanking from './snapshotRanking'
import SnapshotFeedback from './snapshotFeedback'
import { COUNT, RANKING, FEEDBACK, SECTION_NAME_TO_ICON_URL, } from './shared'

const SnapshotSection = ({ active, name, className, itemGroupings, searchCount, selectedGrades, selectedSchoolIds, selectedClassroomIds, selectedTeacherIds, selectedTimeframe, customTimeframeStart, customTimeframeEnd, pusherChannel, }) => {
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
    <section className="snapshot-section-wrapper">
      {!active && <h2>
        <img alt="" src={SECTION_NAME_TO_ICON_URL[name]} />
        <span>{name}</span>
      </h2>}
      <div className={`snapshot-section ${className}`}>
        <div className="snapshot-section-content">
          {snapshotItemGroupings}
        </div>
      </div>
    </section>
  )
}

export default SnapshotSection
