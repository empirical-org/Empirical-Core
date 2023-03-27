import * as React from 'react';
import { withRouter } from 'react-router-dom';

import {
    OpenPopover, SkillGroupSummary,
    StudentResult
} from './interfaces';
import {
    fileDocumentIcon, gainedProficiencyTag,
    maintainedProficiencyTag, noProficiencyTag,
    partialProficiencyTag
} from './shared';
import StudentResultsTable from './studentResultsTable';

import { requestGet } from '../../../../../../modules/request/index';
import {
    CLICK
} from '../../../../../Shared/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

export const GrowthResults = ({ passedStudentResults, passedSkillGroupSummaries, match, mobileNavigation, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudentResults);
  const [studentResults, setStudentResults] = React.useState<StudentResult[]>(passedStudentResults || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState<SkillGroupSummary[]>(passedSkillGroupSummaries || []);
  const [openPopover, setOpenPopover] = React.useState<OpenPopover>({})

  const { activityId, classroomId, } = match.params

  React.useEffect(() => {
    getResults()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getResults()
  }, [activityId, classroomId])

  React.useEffect(() => {
    window.addEventListener(CLICK, closePopoverOnOutsideClick)
    return function cleanup() {
      window.removeEventListener(CLICK, closePopoverOnOutsideClick)
    }
  }, [openPopover])

  function getResults() {
    requestGet(`/teachers/progress_reports/diagnostic_growth_results_summary?activity_id=${activityId}&classroom_id=${classroomId}`,
      (data) => {
        setStudentResults(data.student_results);
        setSkillGroupSummaries(data.skill_group_summaries);
        setLoading(false)
      }
    )
  }

  const responsesLink = (studentId) => `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}`

  function closePopoverOnOutsideClick(e) {
    if (!openPopover.studentId) { return }

    const popoverElements = document.getElementsByClassName('student-results-popover')
    const studentRow = document.getElementById(String(openPopover.studentId))
    if (popoverElements && (!popoverElements[0].contains(e.target) && !studentRow.contains(e.target))) {
      setOpenPopover({})
    }
  }

  if (loading) { return <LoadingSpinner /> }

  return (
    <main className="results-summary-container growth-results-summary-container">
      <header className="results-header">
        <h1>Student results</h1>
        <a className="focus-on-light" href="https://support.quill.org/en/articles/5698227-how-do-i-read-the-growth-results-summary-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>
      </header>
      {mobileNavigation}
      <section className="proficiency-keys">
        <div className="proficiency-key">
          {noProficiencyTag}
          <p>The student did not use any of the skills correctly.</p>
        </div>
        <div className="proficiency-key">
          {partialProficiencyTag}
          <p>The student’s response contained some correct responses, but not all of the responses were marked correct.</p>
        </div>
        <div className="proficiency-key">
          {maintainedProficiencyTag}
          <p>The student used all skills correctly 100% of the time on both the baseline diagnostic and the growth diagnostic.</p>
        </div>
        <div className="proficiency-key">
          {gainedProficiencyTag}
          <p>The student used one or more skills incorrectly on the baseline diagnostic but used all skills correctly on the growth diagnostic.</p>
        </div>
      </section>
      <section className="student-results">
        <StudentResultsTable openPopover={openPopover} responsesLink={responsesLink} setOpenPopover={setOpenPopover} skillGroupSummaries={skillGroupSummaries} studentResults={studentResults} />
      </section>
    </main>
  )
}

export default withRouter(GrowthResults)
