import * as React from 'react'

import * as assignmentFlowConstants from '../../../assignment_flow/assignmentFlowConstants'

export const baseImageSrc = `${process.env.CDN_URL}/images`
export const baseDiagnosticImageSrc = `${baseImageSrc}/pages/diagnostic_reports`
export const accountCommentIcon = <img alt="Person messaging icon" src={`${baseDiagnosticImageSrc}/icons-comment-account.svg`} />
export const triangleUpIcon = <img alt="Triangle up icon" src={`${baseDiagnosticImageSrc}/icons-triangle-up-green.svg`} />
export const lightGreenTriangleUpIcon = <img alt="Triangle up icon" src={`${baseDiagnosticImageSrc}/icons-triangle-up-light-green.svg`} />
export const closeIcon = <img alt="Close icon" src={`${baseImageSrc}/icons/close.svg`} />
export const fileDocumentIcon = <img alt="File document icon" src={`${baseDiagnosticImageSrc}/icons-file-document.svg`} />
export const expandIcon = <img alt="Expand icon" className="expand-icon" src={`${baseImageSrc}/icons/expand.svg`} />
export const asteriskIcon = <img alt="Recommended asterisk icon" className="asterisk-icon" src={`${baseDiagnosticImageSrc}/icons-asterisk.svg`} />
export const recommendedGlyph = <img alt="Recommended glyph" className="recommended-glyph" src={`${baseDiagnosticImageSrc}/recommended_glyph.svg`} />
export const correctImage = <img alt="Correct check icon" src={`${baseDiagnosticImageSrc}/icons-check-small-green.svg`} />
export const informationIcon = <img alt="Information icon" src={`${baseImageSrc}/icons/information.svg`} />

export function goToAssign(unitTemplateId, name, activityId) {
  const unitTemplateIdString = unitTemplateId.toString();
  window.localStorage.setItem(assignmentFlowConstants.UNIT_TEMPLATE_NAME, name)
  window.localStorage.setItem(assignmentFlowConstants.UNIT_NAME, name)
  window.localStorage.setItem(assignmentFlowConstants.ACTIVITY_IDS_ARRAY, [activityId])
  window.localStorage.setItem(assignmentFlowConstants.UNIT_TEMPLATE_ID, unitTemplateIdString)
  window.location.href = `/assign/select-classes?diagnostic_unit_template_id=${unitTemplateIdString}`
}

export const noDataYet = (<div className="no-data-yet">
  <h5>No data yet</h5>
  <p>Data will appear in this report shortly after your students complete the diagnostic.</p>
</div>)

const PROFICIENCY = 'Proficiency'
const PARTIAL_PROFICIENCY = 'Partial proficiency'
const NO_PROFICIENCY = 'No proficiency'
const MAINTAINED_PROFICIENCY = 'Maintained proficiency'
const GAINED_PROFICIENCY = 'Gained proficiency'

export const FULLY_CORRECT = 'Fully correct'

const proficiencyIcon = <img alt="Filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-proficiency.svg`} />
const maintainedProficiencyIcon = <img alt="Filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-maintained-proficiency.svg`} />
const partialProficiencyIcon = <img alt="Half filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-partial-proficiency.svg`} />
const noProficiencyIcon = <img alt="Outlined circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-no-proficient.svg`} />
const grayProficiencyIcon = <img alt="Filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-gray-proficiency.svg`} />
const grayPartialProficiencyIcon = <img alt="Half filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-gray-partial-proficient.svg`} />
const grayNoProficiencyIcon = <img alt="Outlined circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-gray-no-proficient.svg`} />

export const proficiencyTag = <div className="proficiency-tag proficiency">{proficiencyIcon}<span>{PROFICIENCY}</span></div>
export const partialProficiencyTag = <div className="proficiency-tag partial-proficiency">{partialProficiencyIcon}<span>{PARTIAL_PROFICIENCY}</span></div>
export const noProficiencyTag = <div className="proficiency-tag no-proficiency">{noProficiencyIcon}<span>{NO_PROFICIENCY}</span></div>
export const maintainedProficiencyTag = <div className="proficiency-tag maintained-proficiency">{maintainedProficiencyIcon}<span>{MAINTAINED_PROFICIENCY}</span></div>
export const gainedProficiencyTag = <div className="proficiency-tag proficiency">{proficiencyIcon}<span>{GAINED_PROFICIENCY}</span></div>

export const proficiencyTextToTag = {
  [PROFICIENCY]: proficiencyTag,
  [PARTIAL_PROFICIENCY]: partialProficiencyTag,
  [NO_PROFICIENCY]: noProficiencyTag,
  [MAINTAINED_PROFICIENCY]: maintainedProficiencyTag,
  [GAINED_PROFICIENCY]: gainedProficiencyTag
}

export const proficiencyTextToGrayIcon = {
  [PROFICIENCY]: grayProficiencyIcon,
  [PARTIAL_PROFICIENCY]: grayPartialProficiencyIcon,
  [NO_PROFICIENCY]: grayNoProficiencyIcon
}

export const PROFICIENT = 'Proficient'
export const NEARLY_PROFICIENT = 'Nearly proficient'
export const NOT_YET_PROFICIENT = 'Not yet proficient'

// shared consts for handling table scroll at wide view
export const LEFT_OFFSET = 260 // width of the left-hand navigation
export const DEFAULT_LEFT_PADDING = 32
export const MOBILE_WIDTH = 930
export const DEFAULT_LEFT_PADDING_FOR_MOBILE = 0

// release methods
export const IMMEDIATE = 'immediate'
export const STAGGERED = 'staggered'

export const releaseMethodToDisplayName = {
  [IMMEDIATE]: 'Immediate',
  [STAGGERED]: 'Staggered'
}
