import * as React from 'react'

import {
  Tooltip
} from '../../../../Shared/index'

const multipleAccountOutlinedSrc = `${process.env.CDN_URL}/images/icons/icons-account-multiple-check-outlined.svg`
const AVERAGE_FONT_WIDTH = 7

const IndividualClassroom = ({ classroom, }) => {
  // following code accounts for CSS rules that determine width
  let maxWidth = 840
  if (window.innerWidth < 985) { maxWidth = 635 }
  if (window.innerWidth < 800) { maxWidth = window.innerWidth - 32 - 32 - 16 }

  const classroomNameElement = classroom.name.length * AVERAGE_FONT_WIDTH >= maxWidth ? <Tooltip tooltipText={classroom.name} tooltipTriggerText={classroom.name} tooltipTriggerTextClass="tooltip-trigger-text" /> : <span>{classroom.name}</span>

  return (
    <div className="individual-classroom">
      <img alt="Multiple people outlined with a check icon" src={multipleAccountOutlinedSrc} />
      <div className="name-and-count">
        {classroomNameElement}
        <span className="count">{classroom.assignedStudentCount} of {classroom.totalStudentCount} student{classroom.totalStudentCount === 1 ? '' : 's'}</span>
      </div>
    </div>
  )
}

export default IndividualClassroom
