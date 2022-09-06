import * as React from 'react'

import { baseDiagnosticImageSrc, triangleUpIcon, } from './shared'

const barGraphIncreasingIcon = <img alt="Bar chart growth icon" src={`${baseDiagnosticImageSrc}/icons-bar-graph-increasing.svg`} />

interface GrowthSummaryProps {
  showGrowthSummary?: boolean;
  skillsGrowth?: number;
  name?: string;
  growthSummaryLink?: string;
}

const GrowthSummarySection = ({ showGrowthSummary, skillsGrowth, name, growthSummaryLink, }: GrowthSummaryProps) => {

  if (showGrowthSummary) {
    const growth = skillsGrowth > 0 ? <span className="growth">{triangleUpIcon}{skillsGrowth}</span> : <span className="no-growth">No growth yet</span>
    return (
      <section className="growth-summary">
        <div>
          <h4>Growth summary</h4>
          {skillsGrowth !== null && <p>{barGraphIncreasingIcon}<span>Skills growth: {growth}</span></p>}
        </div>
        <div>
          <a className="diagnostic-reports-button quill-button fun secondary outlined unbolded focus-on-light" href={growthSummaryLink}>View growth</a>
        </div>
      </section>
    )
  }

  return (
    <section className="growth-summary">
      <div>
        <h4>Growth summary</h4>
        <p>{barGraphIncreasingIcon}<span>To see how your students have grown, first assign the {name} (Post)</span></p>
      </div>
    </section>
  )
}

export default GrowthSummarySection
