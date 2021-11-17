import * as React from 'react'
import qs from 'qs'
import { withRouter, Link, } from 'react-router-dom';

import {
  fileDocumentIcon,
  PROFICIENT,
  NEARLY_PROFICIENT,
  NOT_YET_PROFICIENT,
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
    width: '432px',
    sortAttribute: 'alphabeticalName',
    isSortable: true
  },
  {
    name: 'Score',
    attribute: 'scoreElement',
    sortAttribute: 'score',
    width: '62px',
    noTooltip: true,
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
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
    width: '196px',
    rowSectionClassName: 'name-section',
    headerClassName: 'name-header',
    sortAttribute: 'alphabeticalName',
    isSortable: true
  },
  {
    name: 'Score',
    attribute: 'scoreElement',
    sortAttribute: 'score',
    width: '52px',
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    noTooltip: true,
    isSortable
  }
])

const proficiencyToClassName = {
  [PROFICIENT]: 'proficient',
  [NEARLY_PROFICIENT]: 'nearly-proficient',
  [NOT_YET_PROFICIENT]: 'not-yet-proficient'
}

const ProficiencyKey = ({ className, studentCount, range, title, }) => {
  return (<section className={`${className} proficiency-key`}>
    <div>
      <p className="proficiency-key-title">{title}</p>
      <p>{range}</p>
    </div>
    <p>{studentCount} student{studentCount === 1 ? '' : 's'}</p>
  </section>)
}


const StudentResponsesIndex = ({ passedStudents, match, mobileNavigation, }) => {
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

    requestGet(`/teachers/progress_reports/diagnostic_student_responses_index?activity_id=${activityId}&classroom_id=${classroomId}${unitQueryString}`,
      (data) => {
        setStudents(data.students);
        setLoading(false)
      }
    )
  }

  const responsesLink = (studentId: number) => `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}${unitQueryString}`

  if (loading) { return <LoadingSpinner /> }

  const proficientStudents = students.filter(s => s.proficiency === PROFICIENT)
  const nearlyProficientStudents = students.filter(s => s.proficiency === NEARLY_PROFICIENT)
  const notYetProficientStudents = students.filter(s => s.proficiency === NOT_YET_PROFICIENT)

  const worthSorting = students.filter(s => s.score).length

  function alphabeticalName(name) {
    const nameArray = name.split(' ')
    const lastName = nameArray[nameArray.length - 1]
    return `${lastName} ${nameArray.join(' ')}`
  }

  const desktopRows = students.map(student => {
    const { name, score, proficiency, id, } = student
    return {
      id: id || name,
      name,
      alphabeticalName: alphabeticalName(name),
      score,
      scoreElement: score !== null? <span className={proficiencyToClassName[proficiency]}>{score}%</span> : null,
      individualResponsesLink: score !== null ? <Link className="quill-button fun secondary outlined focus-on-light" to={responsesLink(id)}>View</Link> : <span className="diagnostic-not-completed">Diagnostic not completed</span>
    }
  })

  const mobileRows = students.map(student => {
    const { name, score, proficiency, id, } = student
    const nameElement = score !== null ? <Link to={responsesLink(id)}>{name}</Link> : <React.Fragment><span>{name}</span><span className="diagnostic-not-completed">Diagnostic not completed</span></React.Fragment>
    return {
      id: id || name,
      name: nameElement,
      alphabeticalName: alphabeticalName(name),
      score,
      scoreElement: score !== null ? <span className={proficiencyToClassName[proficiency]}>{score}%</span> : null,
    }
  })

  return (<main className="student-responses-index-container">
    <header>
      <h1>Student responses</h1>
      <a className="focus-on-light" href="/">{fileDocumentIcon}<span>Guide</span></a>
    </header>
    {mobileNavigation}
    <section className="proficiency-keys">
      <ProficiencyKey className="not-yet-proficient" range="0-59%" studentCount={notYetProficientStudents.length} title={NOT_YET_PROFICIENT} />
      <ProficiencyKey className="nearly-proficient" range="60-79%" studentCount={nearlyProficientStudents.length} title={NEARLY_PROFICIENT} />
      <ProficiencyKey className="proficient" range="80-100%" studentCount={proficientStudents.length} title={PROFICIENT} />
    </section>
    <DataTable
      className="hide-on-mobile"
      defaultSortAttribute={worthSorting && 'score'}
      defaultSortDirection='asc'
      headers={desktopHeaders(worthSorting)}
      rows={desktopRows}
    />
    <DataTable
      className="hide-on-desktop"
      defaultSortAttribute={worthSorting && 'score'}
      defaultSortDirection='asc'
      headers={mobileHeaders(worthSorting)}
      rows={mobileRows}
    />
  </main>)
}

export default withRouter(StudentResponsesIndex)
