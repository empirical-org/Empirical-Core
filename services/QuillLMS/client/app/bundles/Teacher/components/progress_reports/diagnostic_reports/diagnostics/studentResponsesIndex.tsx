import qs from 'qs';
import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';

import {
  fileDocumentIcon
} from './shared';

import { requestGet } from '../../../../../../modules/request/index';
import {
  DataTable,
  expandIcon
} from '../../../../../Shared/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

interface Student {
  name: string;
  id: number;
  total_acquired_skills_count: number;
  total_possible_skills_count: number;
  total_correct_skills_count: number;
  total_pre_correct_skills_count: number;
}

const preTestDesktopHeaders = (isSortable) => ([
  {
    name: 'Name',
    attribute: 'name',
    width: '372px',
    sortAttribute: 'alphabeticalName',
    isSortable: true
  },
  {
    name: 'Pre - Skills',
    attribute: 'activeDiagnosticSkillsCorrectElement',
    sortAttribute: 'totalCorrectSkillsCount',
    width: '102px',
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    noTooltip: true,
    isSortable
  },
  {
    name: 'Responses',
    attribute: 'individualResponsesLink',
    width: '84px',
    noTooltip: true,
    rowSectionClassName: 'individual-responses-link',
    headerClassName: 'individual-responses-header'
  }
])

const postTestDesktopHeaders = (isSortable) => ([
  {
    name: 'Name',
    attribute: 'name',
    width: '372px',
    sortAttribute: 'alphabeticalName',
    isSortable: true
  },
  {
    name: 'Pre - Skills',
    attribute: 'preSkillsCorrectElement',
    sortAttribute: 'totalPreCorrectSkillsCount',
    width: '102px',
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    noTooltip: true,
    isSortable
  },
  {
    name: 'Post - Skills',
    attribute: 'activeDiagnosticSkillsCorrectElement',
    sortAttribute: 'totalCorrectSkillsCount',
    width: '102px',
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    noTooltip: true,
    isSortable
  },
  {
    name: 'Responses',
    attribute: 'individualResponsesLink',
    width: '84px',
    noTooltip: true,
    rowSectionClassName: 'individual-responses-link',
    headerClassName: 'individual-responses-header'
  }
])


const mobileHeaders = (isSortable) => ([
  {
    name: 'Name',
    attribute: 'name',
    width: '146px',
    rowSectionClassName: 'name-section',
    headerClassName: 'name-header',
    sortAttribute: 'alphabeticalName',
    isSortable: true
  },
  {
    name: 'Skills correct',
    attribute: 'skillsCorrectElement',
    sortAttribute: 'totalCorrectSkillsCount',
    width: '102px',
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    noTooltip: true,
    isSortable
  }
])

function calculateSkillsPercentage(correct, total) {
  return Math.round((correct/total) * 100)
}

function alphabeticalName(name) {
  const nameArray = name.split(' ')
  const lastName = nameArray[nameArray.length - 1]
  return `${lastName} ${nameArray.join(' ')}`
}

export const StudentResponsesIndex = ({ passedStudents, match, mobileNavigation, location, isPostDiagnostic, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudents);
  const [students, setStudents] = React.useState<Student[]>(passedStudents || []);
  const [scoringExplanationIsOpen, setScoringExplanationIsOpen] = React.useState<boolean>(false);

  const { activityId, classroomId, } = match.params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `&unit_id=${unitId}` : ''

  React.useEffect(() => {
    getStudents()
  }, [])

  React.useEffect(() => {
    setLoading(true)
    getStudents()
  }, [activityId, classroomId, unitId])

  function getStudents() {
    const link = isPostDiagnostic ? `/teachers/progress_reports/diagnostic_growth_results_summary?activity_id=${activityId}&classroom_id=${classroomId}` : `/teachers/progress_reports/diagnostic_results_summary?activity_id=${activityId}&classroom_id=${classroomId}${unitQueryString}`
    requestGet(link,
      (data) => {
        setStudents(data.student_results);
        setLoading(false)
      }

    )
  }

  function handleToggleExplanation() { setScoringExplanationIsOpen(!scoringExplanationIsOpen) }

  const responsesLink = (studentId: number) => unitId ? `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}?unit=${unitId}` : `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}`

  if (loading) { return <LoadingSpinner /> }

  const worthSorting = students.filter(s => s.total_correct_skills_count).length

  const desktopRows = students.map(student => {
    const { name, total_possible_skills_count, total_correct_skills_count, total_pre_correct_skills_count, id, } = student

    return {
      id: id || name,
      name,
      alphabeticalName: alphabeticalName(name),
      totalCorrectSkillsCount: total_correct_skills_count,
      totalPreCorrectSkillsCount: total_pre_correct_skills_count,
      preSkillsCorrectElement: total_pre_correct_skills_count ? <div className="skills-correct-element">{total_pre_correct_skills_count} of {total_possible_skills_count} ({calculateSkillsPercentage(total_pre_correct_skills_count, total_possible_skills_count)}%)</div> : null,
      activeDiagnosticSkillsCorrectElement: total_correct_skills_count !== undefined ? <div className="skills-correct-element">{total_correct_skills_count} of {total_possible_skills_count} ({calculateSkillsPercentage(total_correct_skills_count, total_possible_skills_count)}%)</div> : null,
      individualResponsesLink: total_correct_skills_count !== undefined ? <Link className="quill-button fun secondary outlined focus-on-light" to={responsesLink(id)}>View</Link> : <span className="name-section-subheader">Diagnostic not completed</span>
    }
  })

  const mobileRows = students.map(student => {
    const { name, total_acquired_skills_count, total_possible_skills_count, total_correct_skills_count, id, } = student
    const nameElement = total_correct_skills_count !== undefined ? <Link to={responsesLink(id)}>{name}</Link> : <React.Fragment><span>{name}</span><span className="name-section-subheader">Diagnostic not completed</span></React.Fragment>
    return {
      id: id || name,
      name: nameElement,
      alphabeticalName: alphabeticalName(name),
      totalCorrectSkillsCount: total_correct_skills_count,
      skillsCorrectElement: total_correct_skills_count !== undefined ? <div className="skills-correct-element">{total_correct_skills_count} of {total_possible_skills_count} ({calculateSkillsPercentage(total_correct_skills_count, total_possible_skills_count)}%)</div> : null,
      individualResponsesLink: total_correct_skills_count !== undefined ? <Link className="quill-button fun secondary outlined focus-on-light" to={responsesLink(id)}>View</Link> : <span className="name-section-subheader">Diagnostic not completed</span>
    }
  })

  let scoringExplanation = (
    <button className="toggle-explanation is-closed" onClick={handleToggleExplanation} type="button">
      <div>
        <h3><b>Update:</b> This report now shows the number of skills each student answered correctly on their diagnostic. Previously, it showed the number of questions answered correctly.</h3>
        <p>(Expand to show more information)</p>
      </div>
      <img alt={expandIcon.alt} src={expandIcon.src} />
    </button>
  )

  if (scoringExplanationIsOpen) {
    scoringExplanation = (
      <button className="toggle-explanation is-open" onClick={handleToggleExplanation} type="button">
        <div>
          <h3><b>Update:</b> This report now shows the number of skills each student answered correctly on their diagnostic. Previously, it showed the number of questions answered correctly.</h3>
          <p>In an effort to provide teachers with the most accurate and valuable data, Quill has made an update to how students’ skill understanding and growth are displayed in this report. Our focus is on measuring the development of key writing skills by making this the primary metric in the reporting, but we also understand that this growth metric needs to be contextualized as a percentage.</p>
          <p>Each diagnostic assess a distinct number of specific skills. That skill number is different than the total number of questions, as some skills are aligned to more than one question. In this report, you’ll see the number of skills each student answered correctly on their assessment rather than the number of questions answered correctly. This change in calculation means that the percentages you now see are slightly different than the percentages you may have previously seen when Quill reported the number of questions correct on any diagnostic assessment.</p>
        </div>
        <img alt={expandIcon.alt} src={expandIcon.src} />
      </button>
    )
  }


  return (
    <main className="student-responses-index-container">
      <header>
        <h1>Student responses</h1>
        <a className="focus-on-light" href="https://support.quill.org/en/articles/5698167-how-do-i-read-the-student-responses-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>
      </header>
      {mobileNavigation}
      <div className="scoring-explanation-container">{scoringExplanation}</div>
      <div className="data-table-container">
        <DataTable
          className={`hide-on-mobile ${isPostDiagnostic ? 'post-test' : 'pre-test'}`}
          defaultSortAttribute={worthSorting && 'totalCorrectSkillsCount'}
          defaultSortDirection='asc'
          headers={isPostDiagnostic ? postTestDesktopHeaders(worthSorting) : preTestDesktopHeaders(worthSorting)}
          rows={desktopRows}
        />
        <DataTable
          className="hide-on-desktop"
          defaultSortAttribute={worthSorting && 'totalCorrectSkillsCount'}
          defaultSortDirection='asc'
          headers={mobileHeaders(worthSorting)}
          rows={mobileRows}
        />
      </div>
    </main>
  )
}

export default withRouter(StudentResponsesIndex)
