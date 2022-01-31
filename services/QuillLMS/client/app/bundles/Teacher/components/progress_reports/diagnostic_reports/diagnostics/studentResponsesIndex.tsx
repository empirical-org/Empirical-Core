import * as React from 'react'
import qs from 'qs'
import { withRouter, Link, } from 'react-router-dom';

import {
  fileDocumentIcon,
  lightGreenTriangleUpIcon,
} from './shared'

import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import { requestGet } from '../../../../../../modules/request/index';
import {
  DataTable,
} from '../../../../../Shared/index'

interface Student {
  name: string;
  score: number;
  proficiency: string;
  id: number;
}

const desktopHeaders = (isSortable) => ([
  {
    name: 'Name',
    attribute: 'name',
    width: '372px',
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

export const StudentResponsesIndex = ({ passedStudents, match, mobileNavigation, location, isPostDiagnostic, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudents);
  const [students, setStudents] = React.useState<Student[]>(passedStudents || []);

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

  const responsesLink = (studentId: number) => unitId ? `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}?unit=${unitId}` : `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}`

  if (loading) { return <LoadingSpinner /> }

  function alphabeticalName(name) {
    const nameArray = name.split(' ')
    const lastName = nameArray[nameArray.length - 1]
    return `${lastName} ${nameArray.join(' ')}`
  }

  const worthSorting = students.filter(s => s.total_correct_skills_count).length

  const desktopRows = students.map(student => {
    const { name, total_acquired_skills_count, total_possible_skills_count, total_correct_skills_count, id, } = student
    const skillsDelta = total_acquired_skills_count ? <div className="skills-delta">{lightGreenTriangleUpIcon}<span className="skill-count">{total_acquired_skills_count}</span></div> : null

    return {
      id: id || name,
      name,
      alphabeticalName: alphabeticalName(name),
      totalCorrectSkillsCount: total_correct_skills_count,
      skillsCorrectElement: total_correct_skills_count ? <div className="skills-correct-element">{total_correct_skills_count} of {total_possible_skills_count}{skillsDelta}</div> : null,
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
      skillsCorrectElement: total_correct_skills_count !== undefined ? <div className="skills-correct-element">{total_correct_skills_count} of {total_possible_skills_count}</div> : null,
      individualResponsesLink: total_correct_skills_count !== undefined ? <Link className="quill-button fun secondary outlined focus-on-light" to={responsesLink(id)}>View</Link> : <span className="name-section-subheader">Diagnostic not completed</span>
    }
  })

  return (
    <main className="student-responses-index-container">
      <header>
        <h1>Student responses</h1>
        <a className="focus-on-light" href="https://support.quill.org/en/articles/5698167-how-do-i-read-the-student-responses-report" rel="noopener noreferrer" target="_blank">{fileDocumentIcon}<span>Guide</span></a>
      </header>
      {mobileNavigation}
      <div className="data-table-container">
        <DataTable
          className="hide-on-mobile"
          defaultSortAttribute={worthSorting && 'totalCorrectSkillsCount'}
          defaultSortDirection='asc'
          headers={desktopHeaders(worthSorting)}
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
