import * as React from 'react'

import * as assignmentFlowConstants from '../../../assignment_flow/assignmentFlowConstants'

export const baseImageSrc = `${process.env.CDN_URL}/images`
export const baseDiagnosticImageSrc = `${baseImageSrc}/pages/diagnostic_reports`
export const accountCommentIcon = <img alt="Person messaging icon" src={`${baseDiagnosticImageSrc}/icons-comment-account.svg`} />
export const triangleUpIcon = <img alt="Triangle up icon" src={`${baseDiagnosticImageSrc}/icons-triangle-up-green.svg`} />
export const brightGreenTriangleUpIcon = <img alt="Bright green triangle up icon" src={`${baseDiagnosticImageSrc}/icons-triangle-up-bright-green.svg`} />
export const lightGreenTriangleUpIcon = <img alt="Light green triangle up icon" src={`${baseDiagnosticImageSrc}/icons-triangle-up-light-green.svg`} />
export const closeIcon = <img alt="Close icon" src={`${baseImageSrc}/icons/close.svg`} />
export const fileDocumentIcon = <img alt="File document icon" src={`${baseDiagnosticImageSrc}/icons-file-document.svg`} />
export const expandIcon = <img alt="Expand icon" className="expand-icon" src={`${baseImageSrc}/icons/expand.svg`} />
export const asteriskIcon = <img alt="Recommended asterisk icon" className="asterisk-icon" src={`${baseDiagnosticImageSrc}/icons-asterisk.svg`} />
export const recommendedGlyph = <img alt="Recommended glyph" className="recommended-glyph" src={`${baseDiagnosticImageSrc}/recommended_glyph.svg`} />
export const correctImage = <img alt="Correct check icon" src={`${baseDiagnosticImageSrc}/icons-check-small-green.svg`} />
export const greenCircleWithCheckIcon = <img alt="Correct check icon" src={`${baseDiagnosticImageSrc}/circle-check-green.svg`} />
export const informationIcon = <img alt="Information icon" src={`${baseImageSrc}/icons/information.svg`} />
export const timeRewindIllustration = <img alt="Illustration of a clock with an arrow pointing backwards" src={`${baseDiagnosticImageSrc}/time-rewind.svg`} />

export function goToAssign(unitTemplateId, name, activityId) {
  const unitTemplateIdString = unitTemplateId.toString();
  window.localStorage.setItem(assignmentFlowConstants.UNIT_TEMPLATE_NAME, name)
  window.localStorage.setItem(assignmentFlowConstants.UNIT_NAME, name)
  window.localStorage.setItem(assignmentFlowConstants.ACTIVITY_IDS_ARRAY, [activityId])
  window.localStorage.setItem(assignmentFlowConstants.UNIT_TEMPLATE_ID, unitTemplateIdString)
  window.location.href = `/assign/select-classes?diagnostic_unit_template_id=${unitTemplateIdString}`
}

export function sumProficiencyScores(proficiencyScoresByStudent: { [name: string]: { pre: number, post: number } }, type: string) {
  return proficiencyScoresByStudent && Object.values(proficiencyScoresByStudent).reduce((total, student_score) => total += student_score[type], 0)
}

export function calculateClassGrowthPercentage({ skillGroupSummaries, completedStudentCount, setClasswideGrowthAverage }) {
  let preTestTotal = 0
  let postTestTotal = 0
  const summariesCount = skillGroupSummaries.length
  skillGroupSummaries.forEach(summary => {
    const { proficiency_scores_by_student } = summary
    /*
      example payload for average proficiency score per student across a skill group, i.e. "Adjectives and Adverbs"
      "proficiency_scores_by_student": {
        "Ken Liu": {
          "pre": 0.3333333333333333,
          "post": 1
        },
        "Tahereh Mafi": {
          "pre": 0.6666666666666666,
          "post": 0.3333333333333333
        },
        "Jason Reynolds": {
          "pre": 0.5,
          "post": 0.8333333333333334
        },
        "Angie Thomas": {
          "pre": 0.6666666666666666,
          "post": 0.6666666666666666
        }
      }
    */
    const preScoresSum = sumProficiencyScores(proficiency_scores_by_student, PRE)
    const postScoresSum = sumProficiencyScores(proficiency_scores_by_student, POST)
    // we don't want to account for no growth instances so we add the pre test average for both totals
    if(preScoresSum > postScoresSum) {
      const sum = preScoresSum / completedStudentCount
      preTestTotal += sum
      postTestTotal += sum
    } else {
      preTestTotal += (preScoresSum / completedStudentCount)
      postTestTotal += (postScoresSum / completedStudentCount)
    }
  })
  // for the pre and post test final sums, we divide by the total number of skill groups to get the average
  preTestTotal = preTestTotal / summariesCount
  postTestTotal = postTestTotal / summariesCount
  const classAverage = Math.round((postTestTotal - preTestTotal) * 100)
  setClasswideGrowthAverage(classAverage)
}

export const noDataYet = (<div className="no-data-yet">
  <h5>No data yet</h5>
  <p>Data will appear in this report shortly after your students complete the diagnostic.</p>
</div>)

export const PRE = 'pre'
export const POST = 'post'

export const PROFICIENCY = 'Full Proficiency'
const PARTIAL_PROFICIENCY = 'Partial Proficiency'
const NO_PROFICIENCY = 'No Proficiency'
const MAINTAINED_PROFICIENCY = 'Maintained Proficiency'
export const GAINED_SOME_PROFICIENCY = 'Gained Some Proficiency'
export const GAINED_PROFICIENCY = 'Gained Full Proficiency'

export const noProficencyExplanation = "The student did not answer any questions for this skill correctly."
export const prePartialProficiencyExplanation = "The student answered some questions for this skill correctly."
export const postPartialProficiencyExplanation = "The student answered some questions for this skill correctly but did not improve in this skill from the pre-diagnostic."
export const gainedSomeProficiencyExplanation = "The student showed growth by answering more questions for this skill correctly on the post-diagnostic than on the pre, but still answered one or more questions for this skill incorrectly."
export const gainedFullProficiencyExplanation = "The student showed growth by answering all questions for this skill correctly on the post, while not answering all questions correctly on the pre."
export const maintainedProficiencyExplanation = "The student answered all questions for this skill correctly on both the pre and the post-diagnostic."
export const proficiencyExplanation = "The student answered all questions for this skill correctly."

export const preToPostImprovedSkillsTooltipText = 'The number of skills the student showed improvement in on the post-diagnostic. A skill is considered “improved” if the student answered more questions for that skill correctly on the post-diagnostic than they did on the pre.'
export const preQuestionsCorrectTooltipText = 'The total number of questions answered correctly on the pre-diagnostic.'
export const preSkillsProficientTooltipText = 'The number of skills the student demonstrated proficiency in on the pre-diagnostic. A student demonstrates proficiency by answering all questions for that skill correctly. If a student is not fully proficient in a skill, Quill provides a recommended activity pack so that you can assign  practice activities.'
export const postQuestionsCorrectTooltipText = 'The total number of questions answered correctly on the post-diagnostic.'
export const postSkillsImprovedOrMaintainTooltipText = 'The number of skills the student maintained or showed improvement in on the post-diagnostic. A skill is considered “improved” if the student answered more questions for that skill correctly on the post-diagnostic than they did on the pre. A skill is considered “maintained” if the student answered all questions for the skill correctly on both the pre and the post-diagnostic.'

export const FULLY_CORRECT = 'Fully correct'

const proficiencyIcon = <img alt="Filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-proficiency.svg`} />
const gainedSomeProficiencyIcon = <img alt="Filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-gained-some-proficiency.svg`} />
const partialProficiencyIcon = <img alt="Half filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-partial-proficiency.svg`} />
const noProficiencyIcon = <img alt="Outlined circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-no-proficient.svg`} />
const grayProficiencyIcon = <img alt="Filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-gray-proficiency.svg`} />
const grayPartialProficiencyIcon = <img alt="Half filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-gray-partial-proficient.svg`} />
const grayNoProficiencyIcon = <img alt="Outlined circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-gray-no-proficient.svg`} />

export const proficiencyTag = <div className="proficiency-tag proficiency">{proficiencyIcon}<span>{PROFICIENCY}</span></div>
export const partialProficiencyTag = <div className="proficiency-tag partial-proficiency">{partialProficiencyIcon}<span>{PARTIAL_PROFICIENCY}</span></div>
export const noProficiencyTag = <div className="proficiency-tag no-proficiency">{noProficiencyIcon}<span>{NO_PROFICIENCY}</span></div>
export const maintainedProficiencyTag = <div className="proficiency-tag maintained-proficiency">{proficiencyIcon}<span>{MAINTAINED_PROFICIENCY}</span></div>
export const gainedSomeProficiencyTag = <div className="proficiency-tag gained-some-proficiency">{gainedSomeProficiencyIcon}<span>{GAINED_SOME_PROFICIENCY}</span></div>
export const gainedProficiencyTag = <div className="proficiency-tag proficiency">{proficiencyIcon}<span>{GAINED_PROFICIENCY}</span></div>

export const proficiencyTextToTag = {
  [PROFICIENCY]: proficiencyTag,
  [PARTIAL_PROFICIENCY]: partialProficiencyTag,
  [NO_PROFICIENCY]: noProficiencyTag,
  [MAINTAINED_PROFICIENCY]: maintainedProficiencyTag,
  [GAINED_SOME_PROFICIENCY]: gainedSomeProficiencyTag,
  [GAINED_PROFICIENCY]: gainedProficiencyTag
}

export const proficiencyTextToGrayIcon = {
  [PROFICIENCY]: grayProficiencyIcon,
  [PARTIAL_PROFICIENCY]: grayPartialProficiencyIcon,
  [NO_PROFICIENCY]: grayNoProficiencyIcon
}

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

export function sortSkillGroupsByQuestionNumbers(skillGroups, questions) {
  // Step 1: Create a mapping of question_uid to question_number
  const questionNumberMap = questions.reduce((acc, question) => {
    acc[question.question_uid] = question.question_number;
    return acc;
  }, {});


  // Step 2: Sort the skill groups based on the minimum question number in each group
  return skillGroups.sort((a, b) => {
    const minQuestionNumberA = Math.min(...a.question_uids.map(uid => questionNumberMap[uid]).filter(Boolean));
    const minQuestionNumberB = Math.min(...b.question_uids.map(uid => questionNumberMap[uid]).filter(Boolean));
    return minQuestionNumberA - minQuestionNumberB;
  });

}
