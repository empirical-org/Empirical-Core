import * as React from 'react'

import { Tooltip, } from '../../../Shared/index'

const ComingSoonTooltip = ({ tooltipTrigger, }) => {
  return (
    <Tooltip
      tooltipText="Coming soon!"
      tooltipTriggerText={tooltipTrigger}
    />
  )
}

export default ComingSoonTooltip
