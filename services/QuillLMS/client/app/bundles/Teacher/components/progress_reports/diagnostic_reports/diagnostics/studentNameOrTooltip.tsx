import * as React from 'react'

import {
  Tooltip,
} from '../../../../../Shared/index'

const AVERAGE_FONT_WIDTH = 7
const ALLOTTED_WIDTH = 182

const StudentNameOrTooltip = ({ name, }) => {
  if ((name.length * AVERAGE_FONT_WIDTH) >= ALLOTTED_WIDTH) {
    return (
      <Tooltip
        tooltipText={name}
        tooltipTriggerText={name}
        tooltipTriggerTextClass='student-name'
      />
    )
  }
  return <span className="student-name">{name}</span>
}

export default StudentNameOrTooltip
