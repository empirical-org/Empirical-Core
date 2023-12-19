import * as React from 'react'

import { USAGE_HIGHLIGHTS, SECTION_NAME_TO_ICON_URL, } from './shared'

import SnapshotCount from '../usage_snapshots/snapshotCount'
import { sentencesWrittenSnapshotInfo, studentLearningHoursSnapshotInfo, } from '../usage_snapshots/shared'

const HighlightsSection = ({ pusherChannel, model, }) => {
  function renderHighlights() {
    const snapshotItems = [sentencesWrittenSnapshotInfo, studentLearningHoursSnapshotInfo].map(item => {
      const { label, size, queryKey, singularLabel, } = item
      const props = {
        label,
        queryKey,
        searchCount: 0,
        pusherChannel,
        singularLabel,
        size,
        selectedSchoolIds: model.schools.map(s => s.id),
        labelSubText: <span className="label-sub-text">This school year</span>
      }

      return (
        <SnapshotCount
          {...props}
          key={queryKey}
        />
      )
    })

    return (
      <div className="counts">
        {snapshotItems}
      </div>
    )
  }

  return (
    <section className="snapshot-section-wrapper overview-section-wrapper">
      <h2>
        <img alt="" src={SECTION_NAME_TO_ICON_URL[USAGE_HIGHLIGHTS]} />
        <span>{USAGE_HIGHLIGHTS}</span>
      </h2>
      <div className="snapshot-section highlights overview-section">
        <div className="snapshot-section-content overview-section-content">
          {renderHighlights()}
        </div>
      </div>
    </section>
  )
}

export default HighlightsSection
