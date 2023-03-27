import qs from 'qs';
import * as React from 'react';
import { withRouter } from 'react-router-dom';

import {
    OpenPopover, SkillGroupSummary,
    StudentResult
} from './interfaces';
import {
    baseDiagnosticImageSrc,
    fileDocumentIcon, noProficiencyTag, partialProficiencyTag, proficiencyTag
} from './shared';
import StudentResultsTable from './studentResultsTable';

import { requestGet } from '../../../../../../modules/request/index';
import {
    CLICK
} from '../../../../../Shared/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

const timeRewindIllustration = <img alt="Illustration of a clock with an arrow pointing backwards" src={`${baseDiagnosticImageSrc}/time-rewind.svg`} />

export const Results = ({ passedStudentResults, passedSkillGroupSummaries, match, mobileNavigation, location, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudentResults);
  const [studentResults, setStudentResults] = React.useState<StudentResult[]>(passedStudentResults || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState<SkillGroupSummary[]>(passedSkillGroupSummaries || []);
  const [openPopover, setOpenPopover] = React.useState<OpenPopover>({})

  const { activityId, classroomId, } = match.params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `&unit_id=${unitId}` : ''

  React.useEffect(() => {
    getResults()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getResults()
  }, [activityId, classroomId, unitId])

  React.useEffect(() => {
    window.addEventListener(CLICK, closePopoverOnOutsideClick)
    return function cleanup() {
      window.removeEventListener(CLICK, closePopoverOnOutsideClick)
    }
  }, [openPopover])

  function getResults() {
    requestGet(`/teachers/progress_reports/diagnostic_results_summary?activity_id=${activityId}&classroom_id=${classroomId}${unitQueryString}`,
      (data) => {
        setStudentResults(data.student_results);
        setSkillGroupSummaries(data.skill_group_summaries);
        setLoading(false)
      }
    )
  }

  const responsesLink = (studentId: number) => unitId ? `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}?unit=${unitId}` : `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}`

  function closePopoverOnOutsideClick(e) {
    if (!openPopover.studentId) { return }

    const popoverElements = document.getElementsByClassName('student-results-popover')
    const studentRow = document.getElementById(String(openPopover.studentId))
    if (popoverElements && (!popoverElements[0].contains(e.target) && !studentRow.contains(e.target))) {
      setOpenPopover({})
    }
  }

  if (loading) { return <LoadingSpinner /> }

  let emptyState

  if (!skillGroupSummaries.length) {
    emptyState = (<section className="results-empty-state">
      {timeRewindIllustration}
      <h2>This report is unavailable for diagnostics assigned before a certain date.</h2>
      <p>If you have questions, please reach out to support@quill.org.</p>
    </section>)
  }

  return (
    <main className="results-summary-container">
      <header className="results-header">
        <h1>Student results</h1>
        {!!skillGroupSummaries.length && <a className="focus-on-light" href="https://support.quill.org/en/articles/5698112-how-do-i-read-the-results-summary-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>}
      </header>
      {mobileNavigation}
      {emptyState || (
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
            {proficiencyTag}
            <p>The student used each skill correctly 100% of the time.</p>
          </div>
        </section>
      )}
      {!!skillGroupSummaries.length && (<section className="student-results">
        <StudentResultsTable openPopover={openPopover} responsesLink={responsesLink} setOpenPopover={setOpenPopover} skillGroupSummaries={skillGroupSummaries} studentResults={studentResults} />
      </section>)}
    </main>
  )
}

export default withRouter(Results)
