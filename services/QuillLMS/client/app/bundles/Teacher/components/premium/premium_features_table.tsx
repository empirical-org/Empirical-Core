import * as React from 'react'

import InfoTooltip from './infoTooltip'
import { premiumFeatures } from './premium_features_data'

const greenCheckSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/icons/icons-check-green.svg`

const greenCheckCell = (<span className="check-or-empty-wrapper">
  <img alt="Check icon" src={greenCheckSrc} />
</span>)

const emptyCell = (<span className="check-or-empty-wrapper" />)

const schoolElement = (school, schoolText) => {
  if (school) return greenCheckCell
  if (schoolText) return <span className="check-or-empty-wrapper">{schoolText}</span>
  return emptyCell
}

const Row = ({ label, tooltipText, basic, teacher, school, schoolText }) => (
  <div className="premium-features-table-row">
    <span className="label-and-tooltip">
      <p>{label}</p>
      <InfoTooltip tooltipText={tooltipText} />
    </span>
    {basic ? greenCheckCell : emptyCell}
    {teacher ? greenCheckCell : emptyCell}
    {schoolElement(school, schoolText)}
  </div>
)

const premiumFeaturesComponents = ({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, }) => premiumFeatures({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, }).map(section =>
  (
    <React.Fragment key={section.header}>
      <div className="header-row">
        <h4>{section.header}</h4>
      </div>
      {section.features.map(feature => <Row key={feature.label} {...feature} />)}
    </React.Fragment>
  )
)

const PremiumFeaturesTable = ({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, }) => (
  <section className="premium-features-table">
    {premiumFeaturesComponents({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, })}
  </section>
)

export default PremiumFeaturesTable
