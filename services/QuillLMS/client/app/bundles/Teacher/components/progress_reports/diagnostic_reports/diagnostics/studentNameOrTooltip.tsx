import * as React from 'react'

import {
  Tooltip,
} from '../../../../../Shared/index'

const AVERAGE_FONT_WIDTH = 8
const ALLOTTED_WIDTH = 182

const StudentNameOrTooltip = ({ name, }) => {
  if ((name.length * AVERAGE_FONT_WIDTH) >= ALLOTTED_WIDTH) {
    return (<Tooltip
      tooltipText={name}
      tooltipTriggerText={`${name.slice(0, (ALLOTTED_WIDTH/AVERAGE_FONT_WIDTH))}...`}
    />)
  }
  return <span>{name}</span>
}

export default StudentNameOrTooltip
