import * as React from 'react'

import { requestPost, } from '../../../../modules/request'
import { arrowPointingRightIcon, closeIcon, } from '../../../Shared/index'

const chartIllustrationSrc = `${process.env.CDN_URL}/images/pages/dashboard/chart-growth-green-illustration.svg`

const GrowthDiagnosticsPromotionCard = () => {
  const [cardShowing, setCardShowing] = React.useState(true)

  function hideCard() {
    setCardShowing(false)

    requestPost('/milestones/complete_acknowledge_growth_diagnostic_promotion_card')
  }

  if (!cardShowing) { return <span /> }

  return (
    <section className="growth-diagnostics-promotion-card">
      <div>
        <span className="new-tag">NEW</span>
        <h2>Measure student gains with Growth Diagnostics</h2>
        <a href="https://www.quill.org/teacher-center/growth-diagnostic-guide"><span>See guide</span><img alt={arrowPointingRightIcon.alt} src={arrowPointingRightIcon.src} /></a>
      </div>
      <button className="interactive-wrapper" onClick={hideCard} type="button"><img alt={closeIcon.alt} className="close-icon" src={closeIcon.src} /></button>
      <img alt="Chart showing growth illustration" className="chart-illustration" src={chartIllustrationSrc} />
    </section>
  )
}

export default GrowthDiagnosticsPromotionCard
