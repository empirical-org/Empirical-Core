import React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { DropdownInput, } from '../../../../Shared/index'
import { requestPost, } from '../../../../../modules/request/index'

const teacherAtBoardSrc = `${process.env.CDN_URL}/images/onboarding/packs-whole.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const KINDERGARTEN = 'K'
const defaultGradeLevelOptions = [KINDERGARTEN, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const formatDropdownOptions = (options) => options.map(opt => ({ value: opt, label: opt, }))

const SubjectAreaRow = ({ clickCheckbox, subjectArea, subjectAreaIds, }) => {
  function handleClickCheckbox() { clickCheckbox(subjectArea.id) }

  let checkbox = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={handleClickCheckbox} type="button" />
  if (subjectAreaIds.includes(subjectArea.id)) {
    checkbox = (<button aria-label="Checked checkbox" className="quill-checkbox selected" onClick={handleClickCheckbox} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  return (
    <div className="subject-area-row">
      {checkbox}
      <span>{subjectArea.name}</span>
    </div>
  )
}

const AddTeacherInfo = ({ subjectAreas, }) => {
  const [minimumGradeLevel, setMinimumGradeLevel] = React.useState(null)
  const [maximumGradeLevel, setMaximumGradeLevel] = React.useState(null)
  const [subjectAreaIds, setSubjectAreaIds] = React.useState([])

  function submitTeacherInfo() {
    requestPost(
      `${process.env.DEFAULT_URL}/teacher_infos`,
      {
        minimum_grade_level: minimumGradeLevel.value,
        maximum_grade_level: maximumGradeLevel.value,
        subject_area_ids: subjectAreaIds
      },
      (body) => {
        window.location = '/finish_sign_up'
      }
    )
  }

  function clickCheckbox(subjectAreaId) {
    if (subjectAreaIds.includes(subjectAreaId)) {
      setSubjectAreaIds(subjectAreas.filter(sa => sa.id !== subjectAreaId))
    } else {
      setSubjectAreaIds(subjectAreaIds.concat(subjectAreaId))
    }
  }

  const minimumGradeLevelOptions = maximumGradeLevel ? defaultGradeLevelOptions.filter(gradeLevel => gradeLevel <= maximumGradeLevel.value || gradeLevel === KINDERGARTEN) : defaultGradeLevelOptions
  const maximumGradeLevelOptions = minimumGradeLevel && minimumGradeLevel.value !== KINDERGARTEN ? defaultGradeLevelOptions.filter(gradeLevel => gradeLevel >= minimumGradeLevel.value) : defaultGradeLevelOptions

  const nextButtonClassName = "quill-button primary contained medium focus-on-light"
  let nextButton = <button className={`${nextButtonClassName} disabled`} disabled type="button">Next</button>

  if (subjectAreaIds.length && minimumGradeLevel && maximumGradeLevel) {
    nextButton = <button className={nextButtonClassName} onClick={submitTeacherInfo} type="button">Next</button>
  }

  return (
    <div>
      <AssignActivityPackBanner />
      <div className="container account-form add-teacher-info">
        <img alt="" src={teacherAtBoardSrc} />
        <h1>Now select the grade level and subjects you teach</h1>
        <p className="sub-header">Sharing the grade level and subjects you teach helps us make better decisions about what kind of content to create and what new product features to build. The more information we have, the better we can support you and your students!</p>
        <section className="user-account-section grade-level-section">
          <h2>Grade level</h2>
          <div className="grade-dropdowns-wrapper">
            <DropdownInput
              handleChange={setMinimumGradeLevel}
              label="Lowest grade level"
              options={formatDropdownOptions(minimumGradeLevelOptions)}
              value={minimumGradeLevel}
            />
            <DropdownInput
              handleChange={setMaximumGradeLevel}
              label="Highest grade level"
              options={formatDropdownOptions(maximumGradeLevelOptions)}
              value={maximumGradeLevel}
            />
          </div>
          {minimumGradeLevel && minimumGradeLevel.value < 4 && <p className="grade-level-explanation">Note: Quill requires students to type out sentences, so we generally recommend using Quill at 4th grade. For younger students, we recommend using Quill only if students have some basic typing experience (typing at more than 15 words per minute).</p>}
        </section>
        <section className="user-account-section subject-area-section">
          <h2>Subject areas</h2>
          {subjectAreas.map(sa => <SubjectAreaRow clickCheckbox={clickCheckbox} key={sa.id} subjectArea={sa} subjectAreaIds={subjectAreaIds} />)}
        </section>
        <div className="button-wrapper">
          {nextButton}
        </div>
      </div>
    </div>
  )
}

export default AddTeacherInfo
