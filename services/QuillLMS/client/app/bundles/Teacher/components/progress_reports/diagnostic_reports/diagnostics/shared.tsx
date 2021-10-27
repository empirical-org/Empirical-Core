import * as React from 'react'

import * as assignmentFlowConstants from '../../../assignment_flow/assignmentFlowConstants'

export const baseDiagnosticImageSrc = `${process.env.CDN_URL}/images/pages/diagnostic_reports`
export const accountCommentIcon = <img alt="Person messaging icon" src={`${baseDiagnosticImageSrc}/icons-comment-account.svg`} />
export const triangleUpIcon = <img alt="Triangle up icon" src={`${baseDiagnosticImageSrc}/icons-triangle-up-green.svg`} />
export const closeIcon = <img alt="Close icon" src={`${process.env.CDN_URL}/images/icons/close.svg`} />

export function goToAssign(unitTemplateId, name, activityId) {
  const unitTemplateIdString = unitTemplateId.toString();
  window.localStorage.setItem(assignmentFlowConstants.UNIT_TEMPLATE_NAME, `${name} (Post)`)
  window.localStorage.setItem(assignmentFlowConstants.UNIT_NAME, `${name} (Post)`)
  window.localStorage.setItem(assignmentFlowConstants.ACTIVITY_IDS_ARRAY, [activityId])
  window.localStorage.setItem(assignmentFlowConstants.UNIT_TEMPLATE_ID, unitTemplateIdString)
  window.location.href = `/assign/select-classes?diagnostic_unit_template_id=${unitTemplateIdString}`
}
