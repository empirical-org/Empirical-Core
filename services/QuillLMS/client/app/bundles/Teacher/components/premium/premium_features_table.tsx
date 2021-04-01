import * as React from 'react'

import { premiumFeatures, } from './premium_features_data'

import { Tooltip, } from '../../../Shared/index'

const helpIconSrc = `${process.env.CDN_URL}/images/icons/icons-help.svg`
const greenCheckSrc = `${process.env.CDN_URL}/images/icons/icons-check-green.svg`

const greenCheckCell = (<span className="check-or-empty-wrapper">
  <img alt="Check icon" src={greenCheckSrc} />
</span>)

const emptyCell = (<span className="check-or-empty-wrapper" />)

const InfoTooltip = ({ tooltipText, }) => (
  <Tooltip
    tooltipText={tooltipText}
    tooltipTriggerText={<img alt='Question mark icon' src={helpIconSrc} />}
  />
)

const Row = ({ label, tooltipText, basic, teacher, school, }) => (
  <div className="premium-features-table-row">
    <span className="label-and-tooltip">
      <p>{label}</p>
      <InfoTooltip tooltipText={tooltipText} />
    </span>
    {basic ? greenCheckCell : emptyCell}
    {teacher ? greenCheckCell : emptyCell}
    {school ? greenCheckCell : emptyCell}
  </div>
)

const premiumFeaturesComponents = ({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, }) => premiumFeatures({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, }).map(section => (
  <React.Fragment key={section.header}>
    <div className="header-row">
      <h4>{section.header}</h4>
    </div>
    {section.features.map(feature => <Row key={feature.label} {...feature} />)}
  </React.Fragment>
))

const PremiumFeaturesTable = ({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, }) => (
  <section className="premium-features-table">
    {premiumFeaturesComponents({ independentPracticeActivityCount, lessonsActivityCount, diagnosticActivityCount, })}
  </section>
)

export default PremiumFeaturesTable
