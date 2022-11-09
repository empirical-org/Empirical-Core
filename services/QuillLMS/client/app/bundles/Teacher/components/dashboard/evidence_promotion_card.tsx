import * as React from 'react'

import { arrowPointingRightIcon } from '../../../Shared/index'

const EvidencePromotionCard = () => {

  return (
    <section className="evidence-promotion-card">
      <div>
        <div className="badge-section">
          <span className="new-tag">NEW TOOL</span>
          <span className="title-tag">QUILL READING FOR EVIDENCE</span>
        </div>
        <h2>Provide reading texts that enable students to write with evidence</h2>
        <div className="link-section">
          <a href={`${process.env.DEFAULT_URL}/teacher-center/introducing-quills-new-writing-and-reading-tool-quill-evidence`}><span>Learn more</span><img alt={arrowPointingRightIcon.alt} src={arrowPointingRightIcon.src} /></a>
          <a href={`${process.env.DEFAULT_URL}/assign/activity-library?activityClassificationFilters[]=evidence`}><span>View activities</span><img alt={arrowPointingRightIcon.alt} src={arrowPointingRightIcon.src} /></a>
          <a href={`${process.env.DEFAULT_URL}/tools/evidence`}><span>See tool demo</span><img alt={arrowPointingRightIcon.alt} src={arrowPointingRightIcon.src} /></a>
        </div>
      </div>
    </section>
  )
}

export default EvidencePromotionCard
