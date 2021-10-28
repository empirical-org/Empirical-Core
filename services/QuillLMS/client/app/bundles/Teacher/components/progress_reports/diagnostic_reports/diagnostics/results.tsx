import * as React from 'react'
import qs from 'qs'
import { withRouter, Link, } from 'react-router-dom';

import {
  baseDiagnosticImageSrc,
  accountCommentIcon,
  triangleUpIcon,
  closeIcon,
} from './shared'
import PercentageCircle from './percentageCircle'

import LoadingSpinner from '../../../shared/loading_indicator.jsx'
import { requestGet } from '../../../../../../modules/request/index';
import {
  helpIcon,
  Tooltip,
  CLICK,
} from '../../../../../Shared/index'

const fileDocumentIcon = <img alt="File document icon" src={`${baseDiagnosticImageSrc}/icons-file-document.svg`} />
const proficiencyIcon = <img alt="Filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-proficiency.svg`} />
const partialProficiencyIcon = <img alt="Half filled in circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-partial-proficiency.svg`} />
const noProficiencyIcon = <img alt="Outlined circle" src={`${baseDiagnosticImageSrc}/components-proficiency-circle-color-no-proficient.svg`} />

const PROFICIENCY = 'Proficiency'
const PARTIAL_PROFICIENCY = 'Partial proficiency'
const NO_PROFICIENCY = 'No proficiency'

const FULLY_CORRECT = 'Fully correct'

const proficiencyTag = <div className="proficiency-tag proficiency">{proficiencyIcon}<span>{PROFICIENCY}</span></div>
const partialProficiencyTag = <div className="proficiency-tag partial-proficiency">{partialProficiencyIcon}<span>{PARTIAL_PROFICIENCY}</span></div>
const noProficiencyTag = <div className="proficiency-tag no-proficiency">{noProficiencyIcon}<span>{NO_PROFICIENCY}</span></div>

interface SkillGroupSummary {
  name: string;
  description?: string;
  not_yet_proficient_student_names: string[];
}

interface StudentResult {
  name: string;
}

const noDataYet = (<div className="no-data-yet">
  <h5>No data yet</h5>
  <p>Data will appear in this report shortly after your students complete the diagnostic.</p>
</div>)

const proficiencyTextToTag = {
  [PROFICIENCY]: proficiencyTag,
  [PARTIAL_PROFICIENCY]: partialProficiencyTag,
  [NO_PROFICIENCY]: noProficiencyTag
}

const Popover = ({ studentResult, skillGroup, closePopover, responsesLink, }) => {
  const skillRows = skillGroup.skills.map(skill => (
    <tr key={skill.skill}>
      <td>{skill.skill}</td>
      <td className="center-align">{skill.number_correct}</td>
      <td className="center-align">{skill.number_incorrect}</td>
      <td className={skill.summary === FULLY_CORRECT ? 'fully-correct' : ''}>{skill.summary}</td>
    </tr>)
  )
  return (<div className="student-results-popover-container hide-on-mobile">
    <section className="student-results-popover">
      <header>
        <h3>{skillGroup.skill_group}</h3>
        <button className="interactive-wrapper focus-on-light" onClick={closePopover} type="button">{closeIcon}</button>
      </header>
      <p>We were looking for etiam porta sem malesuada magna mollis euismod. Lorem ipsum dolor sit amet, consectetr adipiscing elit.</p>
      <table>
        <thead>
          <tr>
            <th className="skill-column-header">Skill</th>
            <th>Correct</th>
            <th>Incorrect</th>
            <th className="summary-header">Summary</th>
          </tr>
        </thead>
        <tbody>{skillRows}</tbody>
      </table>
      <Link to={responsesLink(studentResult.id)}>{accountCommentIcon}<span>View {studentResult.name}&#39;s responses</span></Link>
    </section>
  </div>)
}

const StudentResultCell = ({ skillGroup, studentResult, setOpenPopover, openPopover, responsesLink, }) => {
  const { proficiency_text, number_of_correct_skills_text, id, } = skillGroup
  function showPopover() {
    setOpenPopover({
      studentId: studentResult.id,
      skillGroupId: id,
    })
  }

  function closePopover() {
    setOpenPopover({})
  }

  return (<td className="student-result-cell">
    <button className="interactive-wrapper" onClick={showPopover} type="button">
      {proficiencyTextToTag[proficiency_text]}
      <span className="number-of-correct-skills-text">{number_of_correct_skills_text}</span>
    </button>
    {openPopover.studentId === studentResult.id && openPopover.skillGroupId === id && <Popover closePopover={closePopover} responsesLink={responsesLink} skillGroup={skillGroup} studentResult={studentResult} />}
  </td>)
}

const StudentRow = ({ studentResult, skillGroupSummaries, openPopover, setOpenPopover, responsesLink, }) => {
  const { name, skill_groups, id, } = studentResult
  const diagnosticNotCompletedMessage = skill_groups ? null : <span className="diagnostic-not-completed">Diagnostic not completed</span>
  const firstCell = (<th className="name-cell">
    <div>
      <span>{name}</span>
      {diagnosticNotCompletedMessage}
    </div>
  </th>)

  let skillGroupCells = skillGroupSummaries.map(skillGroupSummary => (<td key={skillGroupSummary.name} />))
  if (skill_groups) {
    skillGroupCells = skill_groups.map(skillGroup => (
      <StudentResultCell
        key={`${id}-${skillGroup.skill_group}`}
        openPopover={openPopover}
        responsesLink={responsesLink}
        setOpenPopover={setOpenPopover}
        skillGroup={skillGroup}
        studentResult={studentResult}
      />)
    )
  }
  return <tr key={name}>{firstCell}{skillGroupCells}</tr>
}

const StudentResultsTable = ({ skillGroupSummaries, studentResults, openPopover, setOpenPopover, responsesLink, }) => {
  const tableHeaders = skillGroupSummaries.map(skillGroupSummary => {
    const { name, description, } = skillGroupSummary
    return (<th className="skill-group-header" key={name}>
      <span className="label">Skill group</span>
      <div className="name-and-tooltip">
        <span>{name}</span>
        <SkillGroupTooltip description={description} key={name} name={name} />
      </div>
    </th>)
  })

  const studentRows = studentResults.map(studentResult => (
    <StudentRow
      key={studentResult.name}
      openPopover={openPopover}
      responsesLink={responsesLink}
      setOpenPopover={setOpenPopover}
      skillGroupSummaries={skillGroupSummaries}
      studentResult={studentResult}
    />)
  )

  const completedStudentResults = studentResults.filter(sr => sr.skill_groups)
  const incompleteStudentResults = studentResults.filter(sr => !sr.skill_groups)
  const tableHasContent = completedStudentResults.length

  const tableHeight = 65 + (74 * incompleteStudentResults.length) + (92 * completedStudentResults.length)
  const containerStyle = { height: `${tableHeight + 16}px` }
  const tableStyle = { height: `${tableHeight}px` }
  const tableClassName = tableHasContent ? '' : 'empty'

  return (<div className="student-results-table-container" style={containerStyle}>
    {tableHasContent ? null : noDataYet}
    <table className={tableClassName} style={tableStyle}>
      <thead>
        <tr>
          <th className="corner-header">Name</th>
          {tableHeaders}
        </tr>
      </thead>
      <tbody>
        {studentRows}
      </tbody>
    </table>
  </div>)
}

const SkillGroupTooltip = ({ name, description, }) => (
  <Tooltip
    tooltipText={`<p>${name}<br/><br/>${description}</p>`}
    tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
  />
)

const SkillGroupSummaryCard = ({ skillGroupSummary, completedStudentCount }) => {
  const { name, description, not_yet_proficient_student_names, } = skillGroupSummary
  let cardContent = noDataYet
  if (completedStudentCount) {
    const numberOfStudentsNeedingPractice = not_yet_proficient_student_names.length
    const percentage = (numberOfStudentsNeedingPractice/completedStudentCount) * 100
    let needPracticeElement = <span className="need-practice-element no-practice-needed">No practice needed</span>

    if (numberOfStudentsNeedingPractice) {
      const tooltipText = `<p>${not_yet_proficient_student_names.join('<br>')}</p>`
      const tooltipTriggerText = numberOfStudentsNeedingPractice === 1 ? "1 student needs practice" : `${numberOfStudentsNeedingPractice} students need practice`
      needPracticeElement = (<Tooltip
        tooltipText={tooltipText}
        tooltipTriggerText={tooltipTriggerText}
        tooltipTriggerTextClass="need-practice-element"
      />)
    }

    cardContent = (<React.Fragment>
      <span className="percentage-circle-label">Proficient</span>
      <PercentageCircle
        bgcolor="#ebebeb"
        borderWidth={8}
        color="#4ea500"
        innerColor="#ffffff"
        percent={100 - Math.round(percentage)}
        radius={52}
      />
      {needPracticeElement}
    </React.Fragment>)
  }
  return (<section className="skill-group-summary-card">
    <div className="card-header">
      <span className="skill-group-name">{name}</span>
      <SkillGroupTooltip description={description} name={name} />
    </div>
    {cardContent}
  </section>)
}

const Results = ({ passedStudentResults, passedSkillGroupSummaries, match, mobileNavigation, }) => {
  const [loading, setLoading] = React.useState<boolean>(!passedStudentResults);
  const [studentResults, setStudentResults] = React.useState(passedStudentResults || []);
  const [skillGroupSummaries, setSkillGroupSummaries] = React.useState(passedSkillGroupSummaries || []);
  const [openPopover, setOpenPopover] = React.useState({})

  const { activityId, classroomId, } = match.params
  const unitId = qs.parse(location.search.replace('?', '')).unit
  const unitQueryString = unitId ? `&unit_id=${unitId}` : ''

  React.useEffect(() => {
    getResults()
  }, [])

  React.useEffect(() => {
    window.addEventListener(CLICK, closePopoverOnOutsideClick)
    return function cleanup() {
      window.removeEventListener(CLICK, closePopoverOnOutsideClick)
    }
  }, [openPopover])

  const getResults = () => {
    requestGet(`/teachers/progress_reports/diagnostic_results_summary?activity_id=${activityId}&classroom_id=${classroomId}${unitQueryString}`,
      (data) => {
        setStudentResults(data.student_results);
        setSkillGroupSummaries(data.skill_group_summaries);
        setLoading(false)
      }
    )
  }

  const responsesLink = (studentId) => `diagnostics/${activityId}/classroom/${classroomId}/responses/${studentId}${unitQueryString}`

  function closePopoverOnOutsideClick(e) {
    if (!openPopover.studentId) { return }

    const popoverElements = document.getElementsByClassName('student-results-popover')
    console.log('e.target.classNames', e.target.classNames)
    console.log('e.currentTarget', e.currentTarget)
    if (popoverElements && (!popoverElements[0].contains(e.target))) {
      setOpenPopover({})
    }
  }

  if (loading) { return <LoadingSpinner /> }

  const completedStudentCount = studentResults.filter(sr => sr.skill_groups).length

  const skillGroupSummaryCards = skillGroupSummaries.map(skillGroupSummary => <SkillGroupSummaryCard completedStudentCount={completedStudentCount} key={skillGroupSummary.name} skillGroupSummary={skillGroupSummary} />)

  return (<main className="results-summary-container">
    <header>
      <h1>Results summary</h1>
      <a className="focus-on-light" href="/">{fileDocumentIcon}<span>Guide</span></a>
    </header>
    {mobileNavigation}
    <section className="skill-group-summary-cards">{skillGroupSummaryCards}</section>
    <section className="student-results">
      <h2>Student results</h2>
      <StudentResultsTable openPopover={openPopover} responsesLink={responsesLink} setOpenPopover={setOpenPopover} skillGroupSummaries={skillGroupSummaries} studentResults={studentResults} />
    </section>
  </main>
  )
}

export default withRouter(Results)
