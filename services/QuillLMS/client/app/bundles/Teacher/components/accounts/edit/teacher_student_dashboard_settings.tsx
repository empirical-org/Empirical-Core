import * as React from 'react';

import { smallWhiteCheckIcon, } from '../../../../Shared'

const TeacherStudentDashboardSettings = ({ activateSection, active, deactivateSection, passedShowStudentsExactScore, updateTeacherInfo, }) => {
  const [showStudentsExactScore, setShowStudentsExactScore] = React.useState(passedShowStudentsExactScore)

  React.useEffect(() => {
    if (active) { return }

    reset()
  }, [active])

  function reset() {
    setShowStudentsExactScore(passedShowStudentsExactScore)
  }

  function toggleCheckbox() {
    setShowStudentsExactScore(!showStudentsExactScore)
  }

  function resetAndDeactivateSection() {
    reset()
    deactivateSection()
  }

  function handleSubmit(e) {
    e?.preventDefault()
    const data = {
      show_students_exact_score: showStudentsExactScore,
    };
    updateTeacherInfo(data, 'Settings saved')
  }

  function renderButtonSection() {
    if (!active) { return }

    const submitButtonClassName = "quill-button primary contained medium focus-on-light"

    let submitButton = <input aria-label="Save changes" className={`${submitButtonClassName} disabled`} disabled type="submit" value="Save changes" />

    if (showStudentsExactScore !== passedShowStudentsExactScore) {
      submitButton = <input aria-label="Save changes" className={submitButtonClassName} type="submit" value="Save changes" />
    }

    return (
      <div className="button-section">
        <button className="quill-button outlined secondary medium focus-on-light" id="cancel" onClick={resetAndDeactivateSection} type="button">Cancel</button>
        {submitButton}
      </div>
    )
  }

  function renderCheckbox() {
    let checkbox = (
      <div className="checkbox-row">
        <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" id="show-exact-score-checkbox" onClick={toggleCheckbox} type="button" />
        <label htmlFor="show-exact-score-checkbox">Show exact score for graded activities</label>
      </div>
    )
    if (showStudentsExactScore) {
      checkbox = (
        <div className="checkbox-row">
          <button aria-label="Checked checkbox" className="quill-checkbox selected" id="show-exact-score-checkbox" onClick={toggleCheckbox} type="button">
            <img alt="Checked checkbox" src={smallWhiteCheckIcon.src} />
          </button>
          <label htmlFor="show-exact-score-checkbox">Show exact score for graded activities</label>
        </div>
      )
    }
    return checkbox;
  }


  return (
    <section className="user-account-section student-dashboard-settings-section">
      <h1>Student dashboard</h1>
      <p className="student-dashboard-settings-description">Control what your classes see on their dashboard. <a href="" rel="noopener noreferrer" target="_blank">Learn more.</a></p>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="fields" onClick={activateSection} onKeyDown={activateSection}>
          {renderCheckbox()}
        </div>
        {renderButtonSection()}
      </form>
    </section>
  )
}

export default TeacherStudentDashboardSettings
