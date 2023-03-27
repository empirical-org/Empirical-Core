import * as React from 'react'

import { helpIcon, Tooltip } from '../../../Shared/index'

const InfoTooltip = ({ tooltipText, }) => (
  <Tooltip
    tooltipText={tooltipText}
    tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
  />
)

export default InfoTooltip
