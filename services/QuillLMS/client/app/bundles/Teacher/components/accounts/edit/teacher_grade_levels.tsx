import * as React from 'react';

import GradeLevelSection from '../shared/grade_level_section'

const TeacherGradeLevels = ({ activateSection, active, deactivateSection, passedMaximumGradeLevel, passedMinimumGradeLevel, updateTeacherInfo, }) => {
  const [minimumGradeLevel, setMinimumGradeLevel] = React.useState(passedMinimumGradeLevel)
  const [maximumGradeLevel, setMaximumGradeLevel] = React.useState(passedMaximumGradeLevel)

  React.useEffect(() => {
    if (active) { return }

    reset()
  }, [active])

  function reset() {
    setMinimumGradeLevel(passedMinimumGradeLevel)
    setMaximumGradeLevel(passedMaximumGradeLevel)
  }

  function resetAndDeactivateSection() {
    reset()
    deactivateSection()
  }

  function handleSubmit(e) {
    e?.preventDefault()
    const data = {
      minimum_grade_level: minimumGradeLevel.value,
      maximum_grade_level: maximumGradeLevel.value
    };
    updateTeacherInfo(data, 'Settings saved')
  }

  function renderButtonSection() {
    if (!active) { return }

    const submitButtonClassName = "quill-button primary contained medium focus-on-light"

    let submitButton = <input aria-label="Save changes" className={`${submitButtonClassName} disabled`} disabled type="submit" value="Save changes" />

    if (minimumGradeLevel && maximumGradeLevel) {
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
    <section className="user-account-section grade-level-section">
      <h1>Grade level</h1>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="fields" onClick={activateSection} onKeyDown={activateSection}>
          <GradeLevelSection
            maximumGradeLevel={maximumGradeLevel}
            minimumGradeLevel={minimumGradeLevel}
            setMaximumGradeLevel={setMaximumGradeLevel}
            setMinimumGradeLevel={setMinimumGradeLevel}
          />
        </div>
        {renderButtonSection()}
      </form>
    </section>
  )
}

export default TeacherGradeLevels
