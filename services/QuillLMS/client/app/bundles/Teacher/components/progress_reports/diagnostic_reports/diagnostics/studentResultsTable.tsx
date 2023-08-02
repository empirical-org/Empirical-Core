import * as React from 'react'
import { Link, } from 'react-router-dom'

import {
  OpenPopover,
  SkillGroup,
  SkillGroupSummary,
  StudentResult,
} from './interfaces'
import {
  accountCommentIcon,
  closeIcon,
  DEFAULT_LEFT_PADDING,
  DEFAULT_LEFT_PADDING_FOR_MOBILE,
  LEFT_OFFSET,
  lightGreenTriangleUpIcon,
  MOBILE_WIDTH,
  noDataYet,
  proficiencyTextToTag
} from './shared'
import SkillGroupTooltip from './skillGroupTooltip'
import StudentNameOrTooltip from './studentNameOrTooltip'

import useWindowSize from '../../../../../Shared/hooks/useWindowSize'
import {
  helpIcon,
  Tooltip,
} from '../../../../../Shared/index'


interface StudentResultsTableProps {
  skillGroupSummaries: SkillGroupSummary[];
  studentResults: StudentResult[];
  openPopover: OpenPopover;
  setOpenPopover: (popover: OpenPopover) => void;
  responsesLink: (id: number) => string;
  isPreTest?: boolean;
}

interface PopoverProps {
  studentResult: StudentResult;
  skillGroup: SkillGroup;
  closePopover: () => void;
  responsesLink: (id: number) => string;
}

interface StudentResultCellProps {
  studentResult: StudentResult;
  skillGroup: SkillGroup;
  setOpenPopover: (popover: OpenPopover) => void;
  openPopover: OpenPopover;
  responsesLink: (id: number) => string;
}

const Popover = ({ studentResult, skillGroup, closePopover, responsesLink, }: PopoverProps) => {
  return (
    <div className="student-results-popover-container hide-on-mobile">
      <section className="student-results-popover">
        <header>
          <h3>{skillGroup.skill_group}</h3>
          <button className="interactive-wrapper focus-on-light" onClick={closePopover} type="button">{closeIcon}</button>
        </header>
        <p dangerouslySetInnerHTML={{ __html: skillGroup.description }} />
        <Link to={responsesLink(studentResult.id)}>{accountCommentIcon}<span>View {studentResult.name}&#39;s responses</span></Link>
      </section>
    </div>
  )
}

const StudentResultCell = ({ skillGroup, studentResult, setOpenPopover, openPopover, responsesLink, }: StudentResultCellProps) => {
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

  return (
    <td className="student-result-cell">
      <button className="interactive-wrapper" onClick={showPopover} type="button">
        {proficiencyTextToTag[proficiency_text]}
        <div className="correct-skills-and-delta-wrapper"><span className="number-of-correct-skills-text">{number_of_correct_skills_text}</span></div>
      </button>
      {openPopover.studentId === studentResult.id && openPopover.skillGroupId === id && <Popover closePopover={closePopover} responsesLink={responsesLink} skillGroup={skillGroup} studentResult={studentResult} />}
    </td>
  )
}

const StudentRow = ({ studentResult, skillGroupSummaries, openPopover, setOpenPopover, responsesLink, }) => {
  const { name, skill_groups, id, total_acquired_skills_count, total_acquired_skill_groups_count, correct_skill_text, correct_skill_groups_text } = studentResult
  const diagnosticNotCompletedMessage = <span className="name-section-subheader">Diagnostic not completed</span>
  const tooltipText = "<b>Skill Groups:</b> The student either gained some or full proficiency in this group of skills, or the student maintained full proficiency from the pre to the post.<br/><br/><b>Skills:</b> The student demonstrated these skills correctly on every prompt.The arrow indicates the increase in skills demonstrated correctly from the pre - diagnostic."
  const totalAcquiredSkillGroupsCount = total_acquired_skill_groups_count > 0 ? total_acquired_skill_groups_count : 0;
  const skillsDelta = (<div className="skills-delta">
    <Tooltip
      tooltipText={tooltipText}
      tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
    />
  </div>)
  const skillGroupsDelta = (<div className="skills-delta">
    {totalAcquiredSkillGroupsCount ? lightGreenTriangleUpIcon : null}
    <span className="skill-count">{totalAcquiredSkillGroupsCount ? totalAcquiredSkillGroupsCount : null }</span>
  </div>)
  const skillsSubHeader = correct_skill_text ? <div className="name-section-subheader"><span className="correct-skill-text">{correct_skill_text}</span>{skillsDelta}</div> : diagnosticNotCompletedMessage
  const skillGroupsSubHeader = correct_skill_groups_text ? <div className="name-section-subheader"><span className="correct-skill-text">{correct_skill_groups_text}</span>{skillGroupsDelta}</div> : null

  const firstCell = (<th className="name-cell">
    <div>
      <StudentNameOrTooltip name={name} />
      {skillGroupsSubHeader}
      {skillsSubHeader}
    </div>
  </th>)

  let skillGroupCells = skillGroupSummaries.map((skillGroupSummary: SkillGroupSummary) => (<td key={skillGroupSummary.name} />))
  if (skill_groups) {
    skillGroupCells = skill_groups.map((skillGroup: SkillGroup) => (
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
  return <tr id={id} key={name}>{firstCell}{skillGroupCells}</tr>
}

const StudentResultsTable = ({ isPreTest, skillGroupSummaries, studentResults, openPopover, setOpenPopover, responsesLink, isPostTest }: StudentResultsTableProps) => {
  const size = useWindowSize();
  const [isSticky, setIsSticky] = React.useState(false);
  const tableRef = React.useRef(null);

  const [stickyTableStyle, setStickyTableStyle] = React.useState({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3
  })

  function paddingLeft() {
    if (MOBILE_WIDTH >= window.innerWidth) { return DEFAULT_LEFT_PADDING_FOR_MOBILE }
    const skillGroupSummaryCards = document.getElementsByClassName('results-header')[0]
    return skillGroupSummaryCards && DEFAULT_LEFT_PADDING
  }

  React.useEffect(() => {
    onScroll()
  }, [size])

  const handleScroll = React.useCallback(({ top, bottom, left, right, }) => {
    if (top <= 0 && bottom > 92) {
      setStickyTableStyle(oldStickyTableStyle => ({ ...oldStickyTableStyle, left: left + paddingLeft() }))
      !isSticky && setIsSticky(true);
    } else {
      isSticky && setIsSticky(false);
    }
  }, [isSticky]);


  const onScroll = () => {
    if (tableRef && tableRef.current) {
      handleScroll(tableRef.current.getBoundingClientRect());
    }
  }

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [handleScroll]);

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
  const completedStudentCount = completedStudentResults.length

  const tableClassName = completedStudentCount ? 'student-results-table' : 'empty student-results-table'

  const tableHeaders = skillGroupSummaries.map(skillGroupSummary => {
    const { name, description, not_yet_proficient_student_names, not_yet_proficient_in_post_test_student_names, } = skillGroupSummary
    const notYetProficientStudentCount = (not_yet_proficient_student_names || not_yet_proficient_in_post_test_student_names).length
    const proficientStudentCount = completedStudentCount - notYetProficientStudentCount
    const label = isPreTest ? ' proficient' : ''
    return (
      <th className="skill-group-header" key={name}>
        <div className="name-and-tooltip">
          <span>{name}</span>
          <SkillGroupTooltip description={description} key={name} name={name} />
        </div>
        {completedStudentCount && <span className="label">{proficientStudentCount} of {completedStudentCount} student{proficientStudentCount === 1 ? '' : 's'}{label}</span>}
      </th>
    )
  })

  const renderHeader = (sticky) => {
    let style = { position: 'inherit' }
    if (window.innerWidth <= MOBILE_WIDTH) {
      style = { left: stickyTableStyle.left - paddingLeft() }
    } else if (LEFT_OFFSET > stickyTableStyle.left) {
      style = { left: -(LEFT_OFFSET - (stickyTableStyle.left - paddingLeft())) + 1 }
    }

    return (
      <thead className={completedStudentResults.length ? '' : 'empty'}>
        <tr>
          <th className="corner-header" style={sticky ? style : {}}>Name</th>
          {tableHeaders}
        </tr>
      </thead>
    )
  }

  return (
    <div className="student-results-table-container" onScroll={handleScroll}>
      {isSticky && completedStudentCount && (
        <table
          className={`${tableClassName} sticky`}
          style={stickyTableStyle}
        >
          {renderHeader(true)}
        </table>
      )}
      <table className={tableClassName} ref={tableRef} style={completedStudentCount ? { paddingLeft: paddingLeft() } : { marginLeft: paddingLeft() }}>
        {renderHeader(false)}
        {completedStudentCount ? null : noDataYet}
        <tbody>
          {studentRows}
        </tbody>
      </table>
    </div>
  )
}

export default StudentResultsTable
