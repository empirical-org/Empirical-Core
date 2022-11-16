import * as React from 'react'

import GradeLevelSection from '../accounts/shared/grade_level_section'
import SubjectAreaSection from '../accounts/shared/subject_area_section'
import { requestPost, } from '../../../../modules/request/index'

const teacherAtBoardSrc = `${process.env.CDN_URL}/images/onboarding/packs-whole.svg`

const TeacherInfoModal = ({ close, subjectAreas, }) => {
  const [minimumGradeLevel, setMinimumGradeLevel] = React.useState(null)
  const [maximumGradeLevel, setMaximumGradeLevel] = React.useState(null)
  const [selectedSubjectAreaIds, setSelectedSubjectAreaIds] = React.useState([])

  function submitTeacherInfo() {
    requestPost(
      `${process.env.DEFAULT_URL}/teacher_infos`,
      {
        minimum_grade_level: minimumGradeLevel.value,
        maximum_grade_level: maximumGradeLevel.value,
        subject_area_ids: selectedSubjectAreaIds
      },
      (body) => {
        close()
      }
    )
  }

  function skipForNow() {
    requestPost(
      `${process.env.DEFAULT_URL}/milestones/create_or_touch_dismiss_teacher_info_modal`,
      {},
      (body) => {
        close()
      }
    )
  }

  const saveButtonClassName = "quill-button primary contained medium focus-on-light"
  let saveButton = <button className={`${saveButtonClassName} disabled`} disabled type="button">Save</button>

  if (selectedSubjectAreaIds.length && minimumGradeLevel && maximumGradeLevel) {
    saveButton = <button className={saveButtonClassName} onClick={submitTeacherInfo} type="button">Save</button>
  }

  return (
    <div className="modal-container welcome-modal-container">
      <div className="modal-background" />
      <div className="quill-modal teacher-info-modal">
        <div className="modal-body">
          <div className="account-form add-teacher-info">
            <img alt="" src={teacherAtBoardSrc} />
            <h1>Select the grade level and subjects you teach</h1>
            <p className="sub-header">Sharing the grade level and subjects you teach helps us make better decisions about what kind of content to create and what new product features to build. The more information we have, the better we can support you and your students!</p>
            <section className="user-account-section grade-level-section">
              <h2>Grade level</h2>
              <GradeLevelSection
                maximumGradeLevel={maximumGradeLevel}
                minimumGradeLevel={minimumGradeLevel}
                setMaximumGradeLevel={setMaximumGradeLevel}
                setMinimumGradeLevel={setMinimumGradeLevel}
              />
            </section>
            <section className="user-account-section subject-area-section">
              <h2>Subject areas</h2>
              <SubjectAreaSection
                selectedSubjectAreaIds={selectedSubjectAreaIds}
                setSelectedSubjectAreaIds={setSelectedSubjectAreaIds}
                subjectAreas={subjectAreas}
              />
            </section>
            <div className="button-wrapper">
              <p>You can edit this later in account settings</p>
              {saveButton}
              <button className="interactive-wrapper focus-on-light skip-for-now" onClick={skipForNow} type="button">Skip for now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherInfoModal
