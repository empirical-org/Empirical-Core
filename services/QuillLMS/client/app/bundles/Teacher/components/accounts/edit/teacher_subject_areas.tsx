import React from 'react';

import SubjectAreaSection from '../shared/subject_area_section'

const TeacherSubjectAreas = ({ activateSection, active, deactivateSection, passedSelectedSubjectAreaIds, subjectAreas, updateTeacherInfo, }) => {
  const [selectedSubjectAreaIds, setSelectedSubjectAreaIds] = React.useState(passedSelectedSubjectAreaIds || [])

  React.useEffect(() => {
    if (active) { return }

    reset()
  }, [active])

  React.useEffect(reset, [passedSelectedSubjectAreaIds])

  function reset() {
    setSelectedSubjectAreaIds(passedSelectedSubjectAreaIds)
  }

  function resetAndDeactivateSection() {
    reset()
    deactivateSection()
  }

  function handleSubmit(e) {
    e?.preventDefault()
    const data = {
      subject_area_ids: selectedSubjectAreaIds,
    };
    updateTeacherInfo(data, 'Settings saved')
  }

  function renderButtonSection() {
    if (!active) { return }

    const submitButtonClassName = "quill-button primary contained medium focus-on-light"

    let submitButton = <input aria-label="Save changes" className={`${submitButtonClassName} disabled`} disabled type="submit" value="Save changes" />

    if (selectedSubjectAreaIds.length) {
      submitButton = <input aria-label="Save changes" className={submitButtonClassName} type="submit" value="Save changes" />
    }

    return (
      <div className="button-section">
        <button className="quill-button outlined secondary medium focus-on-light" id="cancel" onClick={resetAndDeactivateSection} type="button">Cancel</button>
        {submitButton}
      </div>
    )
  }

  return (
    <section className="user-account-section subject-area-section">
      <h1>Subject areas</h1>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="fields" onClick={activateSection} onKeyDown={activateSection}>
          <SubjectAreaSection
            selectedSubjectAreaIds={selectedSubjectAreaIds}
            setSelectedSubjectAreaIds={setSelectedSubjectAreaIds}
            subjectAreas={subjectAreas}
          />
        </div>
        {renderButtonSection()}
      </form>
    </section>
  )
}

export default TeacherSubjectAreas
