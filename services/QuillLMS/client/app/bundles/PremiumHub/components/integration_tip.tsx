import * as React from 'react'

import { baseIntegrationImgSrc, } from '../shared'

export const lightbulbSrc = `${baseIntegrationImgSrc}/lightbulb.svg`

const IntegrationTip = () => (
  <div className="integration-tip">
    <div>
      <h2>Integration Tip</h2>
      <p>Start the school year right by choosing a single integration. Changing mid-year can cause rostering challenges and may take up more of your valuable time, so decide upfront for a better experience.</p>
    </div>
    <img alt="" src={lightbulbSrc} />
  </div>
)

export default IntegrationTip
