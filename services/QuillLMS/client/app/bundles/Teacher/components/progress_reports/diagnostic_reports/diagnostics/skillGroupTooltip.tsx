import * as React from 'react'

import {
    helpIcon,
    Tooltip
} from '../../../../../Shared/index'

const SkillGroupTooltip = ({ name, description, }) => (
  <Tooltip
    tooltipText={`<p>${name}<br/><br/>${description}</p>`}
    tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
  />
)

export default SkillGroupTooltip
