import * as assignmentFlowConstants from '../../../assignment_flow/assignmentFlowConstants'

export function goToAssign(unitTemplateId, name, activityId) {
  const unitTemplateIdString = unitTemplateId.toString();
  window.localStorage.setItem(assignmentFlowConstants.UNIT_TEMPLATE_NAME, `${name} (Post)`)
  window.localStorage.setItem(assignmentFlowConstants.UNIT_NAME, `${name} (Post)`)
  window.localStorage.setItem(assignmentFlowConstants.ACTIVITY_IDS_ARRAY, [activityId])
  window.localStorage.setItem(assignmentFlowConstants.UNIT_TEMPLATE_ID, unitTemplateIdString)
  window.location.href = `/assign/select-classes?diagnostic_unit_template_id=${unitTemplateIdString}`
}
