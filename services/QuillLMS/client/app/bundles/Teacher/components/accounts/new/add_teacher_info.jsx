import React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { DropdownInput, } from '../../../../Shared/index'
import { requestPut, } from '../../../../../modules/request/index'

const teacherAtBoardSrc = `${process.env.CDN_URL}/images/onboarding/packs-whole.svg`
const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

const KINDERGARTEN = 'K'
const defaultGradeLevelOptions = [KINDERGARTEN, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const subjectAreas = [
  'English / Language Arts / Reading',
  'English as a New Language',
  'General Elementary',
  'Math',
  'Science',
  'History / Social Studies',
  'Other'
]

const formatDropdownOptions = (options) => options.map(opt => ({ value: opt, label: opt, }))

const SubjectAreaRow = ({ clickCheckbox, subjectArea, subjectAreas, }) => {
  let checkbox = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={clickCheckbox} type="button" />
  if (subjectAreas.include(subjectArea)) {
    checkbox = (<button aria-label="Checked checkbox" className="quill-checkbox selected" onClick={clickCheckbox} type="button">
      <img alt="Checked checkbox" src={smallWhiteCheckSrc} />
    </button>)
  }

  return (
    <div className="subject-area-row">
      {checkbox}
      <span>{subjectArea}</span>
    </div>
  )
}

const AddTeacherInfo = () => {
  const [minimumGradeLevel, setMinimumGradeLevel] = React.useState(null)
  const [maximumGradeLevel, setMaximumGradeLevel] = React.useState(null)
  const [subjectAreas, setSubjectAreas] = React.useState([])

  function submitTeacherInfo() {
    requestPut(
      `${process.env.DEFAULT_URL}/select_school`,
      { school_id_or_type: idOrType, },
      (body) => {
        window.location = '/finish_sign_up'
      }
    )
  }

  function clickCheckbox(subjectArea) {
    if (subjectAreas.includes(subjectArea)) {
      setSubjectAreas(subjectAreas.filter(sa => sa !== subjectArea))
    } else {
      setSubjectAreas(subjectAreas.concat(subjectArea))
    }
  }

  const minimumGradeLevelOptions = maximumGradeLevel ? defaultGradeLevelOptions.filter(gradeLevel => gradeLevel <= maximumGradeLevel.value || gradeLevel === KINDERGARTEN) : defaultGradeLevelOptions
  const maximumGradeLevelOptions = minimumGradeLevel && minimumGradeLevel.value !== KINDERGARTEN ? defaultGradeLevelOptions.filter(gradeLevel => gradeLevel >= minimumGradeLevel.value) : defaultGradeLevelOptions

  return (
    <div>
      <AssignActivityPackBanner />
      <div className="container account-form add-teacher-info">
        <img alt="" src={teacherAtBoardSrc} />
        <h1>Now select the grade level and subjects you teach</h1>
        <p className="sub-header">Sharing the grade level and subjects you teach helps us make better decisions about what kind of content to create and what new product features to build. The more information we have, the better we can support you and your students!</p>
        <section className="user-account-section">
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
        <section className="user-account-section">
          <h2>Subject areas</h2>
          {subjectAreas.map(sa => <SubjectAreaRow handleClick={clickCheckbox} key={sa} subjectArea={sa} subjectAreas={subjectAreas} />)}
        </section>
      </div>
    </div>
  )
}

export default AddTeacherInfo
