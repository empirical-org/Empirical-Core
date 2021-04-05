import * as React from 'react'

import { Tooltip, } from '../../../Shared/index'

const helpIconSrc = `${process.env.CDN_URL}/images/icons/icons-help.svg`

const InfoTooltip = ({ tooltipText, }) => (
  <Tooltip
    tooltipText={tooltipText}
    tooltipTriggerText={<img alt='Question mark icon' src={helpIconSrc} />}
  />
)

export default InfoTooltip
