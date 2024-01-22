import * as React from 'react'

const baseAdminImgSrc = `${process.env.CDN_URL}/images/pages/administrator`
const baseUsageSnapshotImgSrc = `${baseAdminImgSrc}/usage_snapshot_report`

const NonPremiumUsageSnapshotReport = () => {
  return (
    <div className="white-background-accommodate-footer">
      <div className="container non-premium-usage-snapshot-report">
        <section className="top-section">
          <h1>Usage Snapshot Report</h1>
          <p>Key insights to help you succeed. Included with Quill Premium.</p>
          <div className="buttons">
            <a className="quill-button contained primary large focus-on-light" href="https://calendly.com/alex-quill" rel="noopener noreferrer" target="_blank">Talk to sales</a>
            <a className="quill-button contained primary large focus-on-light" href="/premium" target="_blank">Explore premium</a>
          </div>
          <img alt="" className="bezel" src={`${baseUsageSnapshotImgSrc}/product_bezel.svg`} />
        </section>
        <section className="middle-section">
          <h2>Why Quill Admins Love This Report</h2>
          <div className="items">
            <div>
              <img alt="" src={`${baseUsageSnapshotImgSrc}/student_accounts_orange.svg`} />
              <h3>In-Depth Insights</h3>
              <p>Unlock 25 key metrics, from active users to most assigned concepts and activities.</p>
            </div>
            <div>
              <img alt="" src={`${baseUsageSnapshotImgSrc}/teacher_at_board_orange.svg`} />
              <h3>Data-Driven Success</h3>
              <p>Make data-driven decisions and drive educational excellence by harnessing the power of your data.</p>
            </div>
            <div>
              <img alt="" src={`${baseUsageSnapshotImgSrc}/sheets_of_paper_orange.svg`} />
              <h3>Effortless Reporting</h3>
              <p>Filter by timeframe, school, grade, teacher, or classroom. Download or subscribe to receive by email.</p>
            </div>
          </div>
        </section>
        <section className="bottom-section testimonial">
          <img alt="" src={`${baseAdminImgSrc}/overview/shannon_headshot.png`} />
          <p className="quote">&#34;The Usage Snapshot Report completely redefines the way administrators use Quill. It enables them to make faster, more informed decisions that directly benefit their students&#39; success. This report is a game-changer for any administrator seeking to enhance educational outcomes.&#34;</p>
          <p className="attribution">Shannon Browne, Professional Learning Manager</p>
        </section>
      </div>
    </div>
  )
}

export default NonPremiumUsageSnapshotReport
