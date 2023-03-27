import * as React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner';

import { requestPost } from '../../../../../modules/request/index';
import GradeLevelSection from '../shared/grade_level_section';
import SubjectAreaSection from '../shared/subject_area_section';

const teacherAtBoardSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/onboarding/packs-whole.svg`

const AddTeacherInfo = ({ subjectAreas, }) => {
  const [minimumGradeLevel, setMinimumGradeLevel] = React.useState(null)
  const [maximumGradeLevel, setMaximumGradeLevel] = React.useState(null)
  const [selectedSubjectAreaIds, setSelectedSubjectAreaIds] = React.useState([])

  function submitTeacherInfo() {
    requestPost(
      `${import.meta.env.VITE_DEFAULT_URL}/teacher_infos`,
      {
        minimum_grade_level: minimumGradeLevel.value,
        maximum_grade_level: maximumGradeLevel.value,
        subject_area_ids: selectedSubjectAreaIds
      },
      (body) => {
        window.location = '/finish_sign_up'
      }
    )
  }

  const nextButtonClassName = "quill-button primary contained medium focus-on-light"
  let nextButton = <button className={`${nextButtonClassName} disabled`} disabled type="button">Next</button>

  if (selectedSubjectAreaIds.length && minimumGradeLevel && maximumGradeLevel) {
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
          {nextButton}
        </div>
      </div>
    </div>
  )
}

export default AddTeacherInfo
