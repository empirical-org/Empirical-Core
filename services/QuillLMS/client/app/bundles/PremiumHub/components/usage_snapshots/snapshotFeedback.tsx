import * as React from 'react'

const newTabSrc = `${process.env.CDN_URL}/images/pages/administrator/new_tab.svg`

const SnapshotFeedback = () => {
  return (
    <a aria-label="Open link to feedback forum in new tab" className="focus-on-light snapshot-item snapshot-feedback" href="https://quillorg.canny.io/admin-feedback" rel="noopener noreferrer" target="_blank">
      <div className="header">
        <h3>We’d love your feedback</h3>
        <img alt="" src={newTabSrc} />
      </div>
      <p>Looking for a specific metric? Visit our feedback forum to make a request and vote on ideas.</p>
    </a>
  )
}

export default SnapshotFeedback
