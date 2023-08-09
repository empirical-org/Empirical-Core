import * as React from 'react'

import { arrowPointingRightIcon } from '../../../Shared/index'

const closeIconSrc = `${process.env.CDN_URL}/images/pages/dashboard/bulk_archive_close_icon.svg`

const ScoringUpdatesCard = ({ handleCloseCard, }) => {
  return (
    <section className="scoring-updates-card">
      <div>
        <div className="badge-section">
          <span className="title-tag">UPDATE FOR THE 2023-2024 SCHOOL YEAR</span>
        </div>
        <h2>Educators, we have updated our approach to scoring activities</h2>
        <div className="link-section">
          <a href={`${process.env.DEFAULT_URL}/teacher-center/introducing-quills-new-writing-and-reading-tool-quill-evidence`}><span>Learn more about Quill&#39;s updates to activity scores</span><img alt={arrowPointingRightIcon.alt} src={arrowPointingRightIcon.src} /></a>
        </div>
      </div>
      <button aria-label="Hide card until next school year" className="interactive-wrapper close-button" onClick={handleCloseCard} type="button"><img alt="" src={closeIconSrc} /></button>
    </section>
  )
}

export default ScoringUpdatesCard
