import * as React from 'react'
import * as _ from 'lodash'

import * as md5 from 'md5'

import { unorderedArraysAreEqual, } from '../../modules/unorderedArraysAreEqual'

export const RESTRICTED = 'restricted'
export const LIMITED = 'limited'
export const FULL = 'full'
export const LOADING = 'loading'

export const APPROVED = 'Approved'
export const PENDING = 'Pending'
export const DENIED = 'Denied'
export const SKIPPED = 'Skipped'

export const OVERVIEW = 'overview'
export const SKILL = 'skill'
export const STUDENT = 'student'

// AGDR Overview Tooltips
export const DIAGNOSTIC_NAME_TOOLTIP_TEXT = ["This report shows all of the diagnostics that have been assigned by teachers connected to your account.", "Each diagnostic offering includes a Pre assessment of each student's writing skills, around 40 practice activities recommended by the diagnostic based on the Pre performance, and a Post diagnostic to measure growth after the practice activities are completed.", "Diagnostic will not be displayed in this report until at least one teacher has assigned it within the filters you have selected."]
export const PRE_DIAGNOSTIC_COMPLETED_TOOLTIP_TEXT = "The total number of students who completed the Pre diagnostic of all of the students assigned the Pre diagnostic."
export const COMPLETED_ACTIVITIES_TOOLTIP_TEXT = ["The total number of students who have completed the practice activities linked to this diagnostic.", "A student is counted once the student has completed at least one practice activity linked to this diagnostic."]
export const AVERAGE_ACTIVITIES_AND_TIME_SPENT_TOOLTIP_TEXT = ["Each diagnostic is linked to recommended practice activities. For the students who have completed activities, this shows the average number of completed activities and the average time spent per student.", "This counts the practice activities connected to this particular diagnostic - not the total number of activities that the student has practiced on Quill."]
export const POST_DIAGNOSTIC_COMPLETED_TOOLTIP_TEXT = ["The total number of students who completed the Post diagnostic of all of the students assigned the Post diagnostic.", "Students are not included in this count until their teacher assigns the Post diagnostic to them."]
export const OVERALL_SKILL_GROWTH_TOOLTIP_TEXT = ["The average increase in growth scores across all of the skills. ", "The Performance by Skill report shows the average increase in questions answered correctly for each skill, and the overall growth is the average increase across all skills."]

// AGDR By Skill Tooltips
export const PRE_SKILL_SCORE_TOOLTIP_TEXT = ["The averaged number of questions answered correctly for this skill on the Pre diagnostic.", "This is the average score for all of the students selected in the filters."]
export const POST_SKILL_SCORE_TOOLTIP_TEXT = ["The averaged number of questions answered correctly for this skill on the Post diagnostic.", "This is the average score for all of the students selected in the filters."]
export const GROWTH_RESULTS_TOOLTIP_TEXT = ["The increase in the averaged number of questions answered correctly for this skill from the Pre to the Post diagnostic.", "This is the average increase for all of the students selected in the filters."]
export const STUDENTS_IMPROVED_SKILL_TOOLTIP_TEXT = ["The number of students who improved in the skill by answering more questions correctly on the Post diagnostic than they did on the Pre. This includes students who gained Some Proficiency and Gained Full Proficiency in this skill.", "This total count (”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters."]
export const STUDENTS_WITHOUT_IMPROVEMENT_TOOLTIP_TEXT = ["The total number of students who did not show improvement in this skill by not answering more questions correctly in the Post than the Pre (and who were not already proficient). Quill provides a recommended activity pack for each skill so that educators can easily assign practice activities so that students can practice this skill.", 'This total count (”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters.']
export const STUDENTS_MAINTAINED_PROFICIENCY_TOOLTIP_TEXT = ["The total number of students who answered all questions for this skill correctly on both the Pre and the Post diagnostic.", 'This total count (”of __ students”) includes all students who completed both the Pre and the Post diagnostic and are selected in the filters.']

// AGDR By Student Tooltips
export const PRE_TO_POST_IMPROVED_SKILLS_TOOLTIP_TEXT = "The number of skills the student showed improvement in on the Post diagnostic relative to the Pre diagnostic. A skill is considered improved if the student answered more questions for that skill correctly on the Post diagnostic than they did on the Pre."
export const PRE_QUESTIONS_CORRECT_TOOLTIP_TEXT = "The total number of questions answered correctly on the Pre diagnostic."
export const PRE_SKILLS_PROFICIENT_TOOLTIP_TEXT = "The number of skills the student demonstrated proficiency in on the Pre diagnostic. A student demonstrates proficiency by answering all questions for that skill correctly. If a student is not fully proficient in a skill, Quill provides a recommended activity pack so that teachers can easily assign practice activities."
export const TOTAL_ACTIVITIES_AND_TIME_SPENT_TOOLTIP_TEXT = "Each diagnostic is linked to practice activities. This is the total number of activities completed that are linked to this particular diagnostic - not the total number of activities that the student has practiced on Quill. "
export const POST_QUESTIONS_CORRECT_TOOLTIP_TEXT = "The total number of questions answered correctly on the Post diagnostic."
export const POST_SKILLS_IMPROVED_OR_MAINTAINED_TOOLTIP_TEXT = 'The number of skills the student maintained or showed improvement in on the Post diagnostic. A skill is considered “improved” if the student answered more questions for that skill correctly on the Post diagnostic than they did on the Pre. A skill is considered “maintained” if the student answered all questions for the skill correctly on both the Pre and the Post diagnostic.'

export const DIAGNOSTIC_REPORT_DEFAULT_CELL_WIDTH = '182px'
export const groupByDropdownOptions = [{ label: 'Grade', value: 'grade' }, { label: 'Teacher', value: 'teacher' }, { label: 'Classroom', value: 'classroom' }]
export const diagnosticTypeDropdownOptions = [
  { label: 'Starter Baseline Diagnostic (Pre)', value: 'Starter Baseline Diagnostic (Pre)' },
  { label: 'Starter Growth Diagnostic (Post)', value: 'Starter Growth Diagnostic (Post)' },
  { label: 'Intermediate Baseline Diagnostic (Pre)', value: 'Intermediate Baseline Diagnostic (Pre)' },
  { label: 'Intermediate Growth Diagnostic (Post)', value: 'Intermediate Growth Diagnostic (Post)' },
  { label: 'Advanced Baseline Diagnostic (Pre)', value: 'Advanced Baseline Diagnostic (Pre)' },
  { label: 'Advanced Growth Diagnostic (Post)', value: 'Advanced Growth Diagnostic (Post)' },
  { label: 'ELL Starter Baseline Diagnostic (Pre)', value: 'ELL Starter Baseline Diagnostic (Pre)' },
  { label: 'ELL Starter Growth Diagnostic (Post)', value: 'ELL Starter Growth Diagnostic (Post)' },
  { label: 'ELL Intermediate Baseline Diagnostic (Pre)', value: 'ELL Intermediate Baseline Diagnostic (Pre)' },
  { label: 'ELL Intermediate Growth Diagnostic (Post)', value: 'ELL Intermediate Growth Diagnostic (Post)' },
  { label: 'ELL Advanced Baseline Diagnostic (Pre)', value: 'ELL Advanced Baseline Diagnostic (Pre)' },
  { label: 'ELL Advanced Growth Diagnostic (Post)', value: 'ELL Advanced Growth Diagnostic (Post)' },
  { label: 'AP Writing Skills Survey', value: 'AP Writing Skills Survey' },
  { label: 'Pre-AP Writing Skills Survey 1', value: 'Pre-AP Writing Skills Survey 1' },
  { label: 'Pre-AP Writing Skills Survey 2', value: 'Pre-AP Writing Skills Survey 2' },
  { label: 'SpringBoard Writing Skills Survey', value: 'SpringBoard Writing Skills Survey' }
]

export const premiumLockImage = <img alt="Gray lock" src={`${process.env.CDN_URL}/images/pages/administrator/premium_lock.svg`} />

export const restrictedElement = (
  <div className="restricted">
    {premiumLockImage}
  </div>
)

export const restrictedPage = (
  <div className="restricted-page">
    {premiumLockImage}
  </div>
)

export function selectionsEqual(firstSelection, secondSelection) {
  return (
    firstSelection == secondSelection || // less strict comparison so that undefined and null are treated as equal
    unorderedArraysAreEqual(firstSelection, secondSelection)
  )
}

export function mapItemsIfNotAll(selectedItems, allItems, mapKey = 'id') {
  // selectedItems may, by design, be a superset of allItems, but if everything in allItems is in selectedItems, we want to treat it as "everything" being selected
  const allItemsSelected = allItems.every((item) => {
    return _.some(selectedItems, item)
  })

  if (allItemsSelected || selectionsEqual(selectedItems, allItems)) return null

  return selectedItems.map(i => i[mapKey])
}

/* Should produce the same output as backend `app/services/payload_hasher.rb:run` */
export function hashPayload(payloadArray: Array<any>) {
  const joinedPayload = payloadArray.join('-')
  return md5(joinedPayload)
}
