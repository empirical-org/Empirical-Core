import * as React from 'react'
import { UNIT_TEMPLATE_NAME, ANONYMOUS_ASSIGN_UNIT_TEMPLATE_ID, } from '../assignment_flow/localStorageKeyConstants'

const AssignActivityPackBanner = ({ login, }) => {
  const unitTemplateId = window.localStorage.getItem(ANONYMOUS_ASSIGN_UNIT_TEMPLATE_ID)
  if (!unitTemplateId) { return <span />}

  const unitTemplateName = window.localStorage.getItem(UNIT_TEMPLATE_NAME)
  const copy = login ? "After you log in, you'll be assigning" : "After you create an account, you’ll be assigning"

  return (<div className="anonymous-assign-activity-pack-banner">
    <p>{copy}</p>
    <p className="activity-pack-name">{unitTemplateName}</p>
  </div>)
}


export default AssignActivityPackBanner
