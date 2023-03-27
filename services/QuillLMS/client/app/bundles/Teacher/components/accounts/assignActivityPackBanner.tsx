import * as React from 'react'
import { UNIT_TEMPLATE_NAME } from '../assignment_flow/assignmentFlowConstants'

const AssignActivityPackBanner = ({ login, }) => {
  const unitTemplateName = window.localStorage.getItem(UNIT_TEMPLATE_NAME)
  if (!unitTemplateName) { return <span />}

  const copy = login ? "After you log in, you'll be assigning" : "After you create an account, you’ll be assigning"

  return (
    <div className="anonymous-assign-activity-pack-banner">
      <p>{copy}</p>
      <p className="activity-pack-name">{unitTemplateName}</p>
    </div>
  )
}


export default AssignActivityPackBanner
