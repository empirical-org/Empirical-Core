import * as React from 'react'
import { Link, } from 'react-router-dom';

import { PREMIUM_REPORTS, SECTION_NAME_TO_ICON_URL, iconLinkBase, } from './shared'

export const premiumReportTiles = [
  {
    name: 'Usage Snapshot Report',
    link: '/teachers/premium_hub/usage_snapshot_report',
    icon: `${iconLinkBase}/usage-snapshot-report.svg`,
    description: 'Key insights to help you succeed. View most assigned activities, average activities completed, and more.',
    new: true
  },
  {
    name: 'Diagnostic Growth Report',
    link: '/teachers/premium_hub/diagnostic_growth_report',
    icon: `${iconLinkBase}/diagnostic-growth-report.svg`,
    description: 'Get a detailed breakdown of Quill’s impact on students’ growth. View data by skill, student, and more.',
    new: true
  },
  {
    name: 'Data Export',
    link: '/teachers/premium_hub/data_export',
    icon: `${iconLinkBase}/data-export.svg`,
    description: 'Download a file containing all activities completed by students. Includes score, time spent, and more.',
    new: true
  },
  {
    name: 'Concepts Report',
    link: '/teachers/premium_hub/district_concept_reports',
    icon: `${iconLinkBase}/concepts-report.svg`,
    description: 'View the number of times a student correctly or incorrectly used a targeted concept.',
  },
  {
    name: 'Activity Scores Report',
    link: '/teachers/premium_hub/district_activity_scores',
    icon: `${iconLinkBase}/activity-scores-report.svg`,
    description: 'View the overall average score for each student per class.',
  },
  {
    name: 'Standards Report',
    link: '/teachers/premium_hub/district_standards_reports',
    icon: `${iconLinkBase}/standards-report.svg`,
    description: 'View a school’s overall progress on each of the Common Core standards.',
  }
]

const PremiumReportsSection = () => {
  const tiles = premiumReportTiles.map(tile => {
    return (
      <div className={`tile ${tile.new ? 'new' : ''}`} key={tile.name}>
        <div>
          <h3>{tile.name}{tile.new ? <span className="new-tag">NEW</span> : null}</h3>
          <p>{tile.description}</p>
        </div>
        <div className="link-and-image">
          <Link className="quill-button focus-on-light outlined secondary medium" to={tile.link}>View report</Link>
          <img alt="" src={tile.icon} />
        </div>
      </div>
    )
  })

  return (
    <section className="overview-section-wrapper premium-reports">
      <h2>
        <img alt="" src={SECTION_NAME_TO_ICON_URL[PREMIUM_REPORTS]} />
        <span>{PREMIUM_REPORTS}</span>
      </h2>
      <div className="overview-section">
        <div className="overview-section-content">
          {tiles}
        </div>
      </div>
    </section>
  )
}

export default PremiumReportsSection
