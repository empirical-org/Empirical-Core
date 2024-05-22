import * as React from 'react';
import { withRouter } from 'react-router-dom';

import {
  OpenPopover,
  SkillGroupSummary,
  StudentResult
} from './interfaces';
import {
  fileDocumentIcon,
  gainedProficiencyTag,
  maintainedProficiencyTag,
  noProficiencyTag,
  partialProficiencyTag,
  gainedSomeProficiencyTag,
  noProficencyExplanation,
  postPartialProficiencyExplanation,
  gainedSomeProficiencyExplanation,
  gainedFullProficiencyExplanation,
  maintainedProficiencyExplanation
} from './shared';
import IneligibleForQuestionScoring from './ineligibleForQuestionScoring'
import StudentResultsTable from './studentResultsTable';

import { requestGet } from '../../../../../../modules/request/index';
import {
  CLICK,
} from '../../../../../Shared/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

export const GrowthResults = ({ passedStudentResults, passedSkillGroupSummaries, match, mobileNavigation, eligibleForQuestionScoring, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudentResults);
  const [studentResults, setStudentResults] = React.useState<StudentResult[]>(passedStudentResults || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState<SkillGroupSummary[]>(passedSkillGroupSummaries || []);
  const [openPopover, setOpenPopover] = React.useState<OpenPopover>({})

  const { activityId, classroomId, } = match.params

  React.useEffect(() => {
    if (eligibleForQuestionScoring) {
      setLoading(true)
      getResults()
    } else {
      setLoading(false)
    }
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
      {eligibleForQuestionScoring ? (
        <React.Fragment>
          <section className="proficiency-keys">
            <div className="proficiency-key">
              {noProficiencyTag}
              <p>{noProficencyExplanation}</p>
            </div>
            <div className="proficiency-key">
              {partialProficiencyTag}
              <p>{postPartialProficiencyExplanation}</p>
            </div>
            <div className="proficiency-key">
              {gainedSomeProficiencyTag}
              <p>{gainedSomeProficiencyExplanation}</p>
            </div>
            <div className="proficiency-key">
              {gainedProficiencyTag}
              <p>{gainedFullProficiencyExplanation}</p>
            </div>
            <div className="proficiency-key">
              {maintainedProficiencyTag}
              <p>{maintainedProficiencyExplanation}</p>
            </div>
          </section>
          <section className="student-results">
            <StudentResultsTable openPopover={openPopover} responsesLink={responsesLink} setOpenPopover={setOpenPopover} skillGroupSummaries={skillGroupSummaries} studentResults={studentResults} />
          </section>
        </React.Fragment>
      ) : (<IneligibleForQuestionScoring pageName="student results page" />)}
    </main>
  )
}

export default withRouter(GrowthResults)
