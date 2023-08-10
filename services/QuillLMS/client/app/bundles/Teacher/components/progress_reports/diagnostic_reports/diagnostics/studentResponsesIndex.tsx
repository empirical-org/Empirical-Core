import qs from 'qs';
import * as React from 'react';
import { Link, withRouter, } from 'react-router-dom';

import {
  fileDocumentIcon,
  PROFICIENCY,
  preToPostImprovedSkillsTooltipText,
  preQuestionsCorrectTooltipText,
  preSkillsProficientTooltipText,
  postQuestionsCorrectTooltipText,
  postSkillsImprovedOrMaintainTooltipText
} from './shared';

import { requestGet } from '../../../../../../modules/request/index';
import { DataTable } from '../../../../../Shared/index';
import LoadingSpinner from '../../../shared/loading_indicator.jsx';

interface Student {
  name: string;
  id: number;
  total_possible_questions_count: number;
  total_correct_questions_count: number;
  total_pre_correct_questions_count: number;
  total_pre_possible_questions_count: number;
  skill_groups: any[];
  total_correct_skill_groups_count: number;
  total_acquired_skill_groups_count: number;
  total_maintained_skill_group_proficiency_count: number;
  correct_skill_groups_text: string;
}

const S_CELL_WIDTH = '176px'
const M_CELL_WIDTH = '184px'
const L_CELL_WIDTH = '244px'
const XL_CELL_WIDTH = '252px'
const NOT_AVAILABLE = 'Not available'

const diagnosticNotCompletedElement = (<span>Diagnostic not completed</span>)

const preTestDesktopHeaders = (isSortable) => ([
  {
    name: 'Name',
    attribute: 'name',
    width: L_CELL_WIDTH,
    rowSectionClassName: 'name-section',
    sortAttribute: 'alphabeticalName',
    isSortable: true
  },
  {
    name: '',
    attribute: 'activeDiagnosticSkillsCorrectElement',
    sortAttribute: 'totalCorrectSkillsCount',
    width: XL_CELL_WIDTH,
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    primaryTitle: 'Pre:',
    secondaryTitle: 'Questions Correct',
    tooltipName: 'Pre: Questions Correct',
    tooltipDescription: preQuestionsCorrectTooltipText,
    noTooltip: true,
    isSortable
  },
  {
    name: '',
    attribute: 'preSkillsProficientElement',
    sortAttribute: 'totalPreCorrectSkillsCount',
    width: XL_CELL_WIDTH,
    primaryTitle: 'Pre:',
    secondaryTitle: 'Skills Proficient',
    tooltipName: 'Pre: Skills Proficient',
    tooltipDescription: preSkillsProficientTooltipText,
    noTooltip: true,
    isSortable
  },
  {
    name: 'Responses',
    attribute: 'individualResponsesLink',
    width: S_CELL_WIDTH,
    noTooltip: true,
    rowSectionClassName: 'individual-responses-link',
    headerClassName: 'individual-responses-header'
  }
])

const postTestDesktopHeaders = (isSortable) => ([
  {
    name: 'Name',
    attribute: 'name',
    width: S_CELL_WIDTH,
    sortAttribute: 'alphabeticalName',
    rowSectionClassName: 'name-section',
    isSortable: true
  },
  {
    name: '',
    attribute: 'preToPostImprovedSkills',
    sortAttribute: 'totalAcquiredSkillGroupsCount',
    width: M_CELL_WIDTH,
    primaryTitle: 'Pre to Post:',
    secondaryTitle: 'Improved Skills',
    tooltipName: 'Pre to Post: Improved Skills',
    tooltipDescription: preToPostImprovedSkillsTooltipText,
    noTooltip: true,
    isSortable
  },
  {
    name: '',
    attribute: 'preSkillsCorrectElement',
    sortAttribute: 'totalPreCorrectQuestionsCount',
    width: M_CELL_WIDTH,
    primaryTitle: 'Pre:',
    secondaryTitle: 'Questions Correct',
    tooltipName: 'Pre: Questions Correct',
    tooltipDescription: preQuestionsCorrectTooltipText,
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    noTooltip: true,
    isSortable
  },
  {
    name: '',
    attribute: 'preSkillsProficientElement',
    sortAttribute: 'totalPreCorrectSkillsCount',
    width: M_CELL_WIDTH,
    primaryTitle: 'Pre:',
    secondaryTitle: 'Skills Proficient',
    tooltipName: 'Pre: Skills Proficient',
    tooltipDescription: preSkillsProficientTooltipText,
    noTooltip: true,
    isSortable
  },
  {
    name: '',
    attribute: 'activeDiagnosticSkillsCorrectElement',
    sortAttribute: 'totalCorrectSkillsCount',
    width: M_CELL_WIDTH,
    primaryTitle: 'Post:',
    secondaryTitle: 'Questions Correct',
    tooltipName: 'Post: Questions Correct',
    tooltipDescription: postQuestionsCorrectTooltipText,
    rowSectionClassName: 'score-section',
    headerClassName: 'score-header',
    noTooltip: true,
    isSortable
  },
  {
    name: 'Post: Skills Improved or Maintained',
    attribute: 'postSkillsImprovedOrMaintained',
    sortAttribute: 'totalAcquiredOrMaintainedSkillGroupsCount',
    width: '230px',
    primaryTitle: 'Post:',
    secondaryTitle: 'Skills Improved or Maintained',
    tooltipName: 'Post: Skills Improved or Maintained',
    tooltipDescription: postSkillsImprovedOrMaintainTooltipText,
    noTooltip: true,
    isSortable
  },
  {
    name: 'Responses',
    attribute: 'individualResponsesLink',
    width: S_CELL_WIDTH,
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
    name: 'Questions correct',
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

  function getPreSkillsProficientCount({ total_correct_questions_count, total_correct_skill_groups_count, skill_groups }) {
    if (total_correct_questions_count === undefined) { return null }

    if (total_correct_skill_groups_count) { return total_correct_skill_groups_count }

    return skill_groups.filter(skillGroup => skillGroup.pre_test_proficiency === PROFICIENCY).length
  }

  function renderPreToPostImprovedSkillsElement({total_correct_questions_count, total_acquired_skill_groups_count}) {
    if (total_correct_questions_count === undefined) { return diagnosticNotCompletedElement }

    if (!total_acquired_skill_groups_count) { return NOT_AVAILABLE }

    if (total_acquired_skill_groups_count === 0) { return '0 Improved Skills' }

    return total_acquired_skill_groups_count === 1 ? '+1 Improved Skill' : `+${total_acquired_skill_groups_count} Improved Skills`
  }

  function renderPreSkillsCorrectElement({ total_correct_questions_count, total_pre_correct_questions_count, total_pre_possible_questions_count, total_possible_questions_count }) {
    if (total_correct_questions_count === undefined) { return null }

    if (!total_pre_correct_questions_count) { return NOT_AVAILABLE }

    return(
      <div className="skills-correct-element">
        <p>{total_pre_correct_questions_count} of {total_pre_possible_questions_count} Questions</p>
        <p>({(calculateSkillsPercentage(total_pre_correct_questions_count, total_possible_questions_count))}%)</p>
      </div>
    )
  }

  function renderPreSkillsProficient({ total_correct_questions_count, total_pre_correct_questions_count, skill_groups, total_correct_skill_groups_count, correct_skill_groups_text }) {
    if(total_correct_questions_count === undefined) { return null }

    if(!total_correct_questions_count) { return NOT_AVAILABLE }

    if (total_pre_correct_questions_count) {
      const countOfPreSkillsProficienct = skill_groups.filter(skillGroup => skillGroup.pre_test_proficiency === PROFICIENCY).length
      const countOfSkillsToPractice = skill_groups.length - countOfPreSkillsProficienct
      return (
        <div className="skills-correct-element">
          <p>{countOfPreSkillsProficienct} of {skill_groups.length} Skills</p>
          {!!countOfSkillsToPractice && <p>({countOfSkillsToPractice} Skills to Practice)</p>}
        </div>
      )
    }

    const countOfSkillsToPractice = skill_groups.length - total_correct_skill_groups_count
    return(
      <div className="skills-correct-element">
        <p>{correct_skill_groups_text}</p>
        {!!countOfSkillsToPractice && <p>({countOfSkillsToPractice} Skills to Practice)</p>}
      </div>
    )
  }

  function renderActiveDiagnosticSkillsCorrectElement({ total_correct_questions_count, total_possible_questions_count }) {
    if (isPostDiagnostic && !total_possible_questions_count) { return null }

    if (total_correct_questions_count === undefined) { return diagnosticNotCompletedElement }

    if (!total_correct_questions_count) { return NOT_AVAILABLE }

    return(
      <div className="skills-correct-element">
        <p>{total_correct_questions_count} of {total_possible_questions_count} Questions</p>
        <p>({calculateSkillsPercentage(total_correct_questions_count, total_possible_questions_count)}%)</p>
      </div>
    )
  }

  function renderPostSkillsImprovedOrMaintained({ total_pre_possible_questions_count, correct_skill_groups_text, total_acquired_skill_groups_count, total_maintained_skill_group_proficiency_count }) {
    if (total_pre_possible_questions_count === undefined) { return null }

    if (!total_pre_possible_questions_count) { return NOT_AVAILABLE }

    const acquiredSkillsText = total_acquired_skill_groups_count === 1 ? '1 Improved Skill' : `${total_acquired_skill_groups_count} Improved Skills`
    const maintainedSkillsText = `${total_maintained_skill_group_proficiency_count} Maintained`
    return(
      <div className="skills-correct-element">
        <p>{correct_skill_groups_text}</p>
        <p>({acquiredSkillsText}, {maintainedSkillsText})</p>
      </div>
    )
  }

  function renderIndividualResponsesLink({total_correct_questions_count, id}) {
    if (total_correct_questions_count === undefined) { return null }

    return <Link className="quill-button fun secondary outlined focus-on-light" to={responsesLink(id)}>View</Link>
  }

  const responsesLink = (studentId: number) => unitId ? `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}?unit=${unitId}` : `/diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}`

  if (loading) { return <LoadingSpinner /> }

  const worthSorting = students.filter(s => s.total_correct_questions_count).length

  const desktopRows = students.map(student => {
    const { name, total_possible_questions_count, total_correct_questions_count, total_pre_correct_questions_count, total_pre_possible_questions_count, skill_groups, total_correct_skill_groups_count, correct_skill_groups_text, total_acquired_skill_groups_count, total_maintained_skill_group_proficiency_count, id } = student
    const totalAcquiredOrMaintainedSkillGroupsCount = total_acquired_skill_groups_count + total_maintained_skill_group_proficiency_count

    return {
      id: id || name,
      name,
      alphabeticalName: alphabeticalName(name),
      preToPostImprovedSkills: renderPreToPostImprovedSkillsElement({total_correct_questions_count, total_acquired_skill_groups_count}),
      totalCorrectSkillsCount: total_correct_questions_count,
      totalPreCorrectQuestionsCount: total_pre_correct_questions_count,
      totalPreCorrectSkillsCount: getPreSkillsProficientCount({ total_correct_questions_count, total_correct_skill_groups_count, skill_groups }),
      totalAcquiredSkillGroupsCount: total_acquired_skill_groups_count,
      totalAcquiredOrMaintainedSkillGroupsCount: totalAcquiredOrMaintainedSkillGroupsCount > 0 ? totalAcquiredOrMaintainedSkillGroupsCount : 0,
      preSkillsProficientElement: renderPreSkillsProficient({ total_correct_questions_count, total_pre_correct_questions_count, skill_groups, total_correct_skill_groups_count, correct_skill_groups_text }),
      preSkillsCorrectElement: renderPreSkillsCorrectElement({ total_correct_questions_count, total_pre_correct_questions_count, total_pre_possible_questions_count, total_possible_questions_count }),
      activeDiagnosticSkillsCorrectElement: renderActiveDiagnosticSkillsCorrectElement({ total_correct_questions_count, total_possible_questions_count }),
      postSkillsImprovedOrMaintained: renderPostSkillsImprovedOrMaintained({ total_pre_possible_questions_count, correct_skill_groups_text, total_acquired_skill_groups_count, total_maintained_skill_group_proficiency_count }),
      individualResponsesLink: renderIndividualResponsesLink({ total_correct_questions_count, id })
    }
  })

  const mobileRows = students.map(student => {
    const { name, total_possible_questions_count, total_correct_questions_count, id, } = student
    const nameElement = total_correct_questions_count !== undefined ? <Link to={responsesLink(id)}>{name}</Link> : <React.Fragment><span>{name}</span><span className="name-section-subheader">Diagnostic not completed</span></React.Fragment>
    return {
      id: id || name,
      name: nameElement,
      alphabeticalName: alphabeticalName(name),
      totalCorrectSkillsCount: total_correct_questions_count,
      skillsCorrectElement: total_correct_questions_count !== undefined ? <div className="skills-correct-element">{total_correct_questions_count} of {total_possible_questions_count} ({calculateSkillsPercentage(total_correct_questions_count, total_possible_questions_count)}%)</div> : null,
      individualResponsesLink: total_correct_questions_count !== undefined ? <Link className="quill-button fun secondary outlined focus-on-light" to={responsesLink(id)}>View</Link> : <span className="name-section-subheader">Diagnostic not completed</span>
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
