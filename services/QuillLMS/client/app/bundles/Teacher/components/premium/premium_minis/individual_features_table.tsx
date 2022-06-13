import * as React from 'react'

import InfoTooltip from '../infoTooltip'

const expandSrc = `${process.env.CDN_URL}/images/icons/expand.svg`

const IndividualFeaturesTable = ({ premiumFeatureData, type, }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  function toggleIsOpen() { setIsOpen(!isOpen) }

  const expandImgAltText = `Arrow pointing ${isOpen ? 'up' : 'down'}`

  if (!isOpen) {
    return (
      <div className="individual-features-table-container">
        <button className="interactive-wrapper focus-on-light" onClick={toggleIsOpen} type="button">Show all features <img alt={expandImgAltText} src={expandSrc} /></button>
      </div>
    )
  }

  const table = premiumFeatureData.map(section => {
    const rows = section.features.filter(feature => feature[type]).map(feature => (
      <div className="label-and-tooltip" key={feature.label}>
        <p>{feature.label}</p>
        <InfoTooltip tooltipText={feature.tooltipText} />
      </div>
    ))
    return (
      <React.Fragment key={section.header}>
        <div className="header-row">
          <h3>{section.header}</h3>
        </div>
        {rows}
      </React.Fragment>
    )
  })

  return (
    <div className="individual-features-table-container is-open">
      <button className="interactive-wrapper focus-on-light" onClick={toggleIsOpen} type="button">Hide all features <img alt={expandImgAltText} src={expandSrc} /></button>
      {table}
    </div>
  )
}

export default IndividualFeaturesTable
