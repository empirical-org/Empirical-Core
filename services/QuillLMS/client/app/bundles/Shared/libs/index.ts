export { hashToCollection } from './hashToCollection'
export {
  isValidRegex,
  isValidAndNotEmptyRegex,
  isValidFocusPointOrIncorrectSequence,
} from './isValidRegex'
export { momentFormatConstants } from './momentFormatConstants'
export { copyToClipboard } from './copyToClipboard'
export { getLatestAttempt } from './getLatestAttempt'
export {
  getCurrentQuestion,
  getQuestionsWithAttempts,
  getFilteredQuestions,
  getDisplayedText,
  renderPreviewFeedback,
  returnActivity,
  returnActivityData,
  returnLessonData,
  renderTitleSection,
  renderIntroductionSection,
  renderQuestions,
  renderEvidenceActivityContent
} from './activityPreviewHelpers'
export { roundValuesToSeconds, roundMillisecondsToSeconds, } from './timeTrackingSharedFunctions'
export { titleCase } from './titleCase'
export { onMobile } from './onMobile'
export { fillInBlankInputLabel, } from './fillInBlankInputLabel'
export { fillInBlankInputStyle, } from './fillInBlankInputStyle'
export { findFeedbackForReport, } from './findFeedbackForReport'
export { formatAnswerStringForReport, } from './formatAnswerStringForReport'
export { splitPromptForFillInBlank, } from './splitPromptForFillInBlank'
export { getIconForActivityClassification } from './getIconForActivityClassification'
export { isTrackableStudentEvent } from './isTrackableStudentEvent'
export { hexToRGBA } from './hexToRGBA'
export { uniqueValuesArray } from './uniqueValuesArray'
export { filterNumbers } from './filterFunctions'
export { redirectToActivity } from './redirectToActivity'
export { renderNavList } from './navbarHelpers'
export { noResultsMessage } from './stringManipulationFunctions'
export { pluralize } from './pluralize'
export {
  getStatusForResponse,
  responsesWithStatus,
  sortByLevenshteinAndOptimal,
  extractConceptResultsFromResponse
} from './responseTools'
export { getlanguageOptions, renderSaveAndExitButton, showTranslations, renderExplanation } from './translations/helpers'
