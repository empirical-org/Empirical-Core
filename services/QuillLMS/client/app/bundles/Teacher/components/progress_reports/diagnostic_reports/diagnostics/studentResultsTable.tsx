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
  brightGreenTriangleUpIcon,
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

const POST_TEST_DESCRIPTION = '<br/><br/>The number of students who improved or maintained this skill shows you how many students had a positive outcome for this skill area on the post-diagnostic. Students who \"improved\" the skill showed growth by answering more capitalization questions correctly on the post-diagnostic than they did on the pre. Students who \"maintained\" the skill showed proficiency by answering all capitalization questions correctly on both the pre and the post-diagnostic.<br/><br/>The up arrow and number following it focuses just on growth between diagnostics. It shows you how many students improved in the skill from pre to post-diagnostic, not including students who had already shown proficiency in the skill on the pre-diagnostic.'

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

function renderDelta(count: number) {
  return (
    <div className="skills-delta">
      {count ? brightGreenTriangleUpIcon : null}
      <span className="skill-count">{count ? count : null}</span>
    </div>
  )
}

function renderStudentHeaderSkillsData({ isPreTest, totalAcquiredSkillGroupsCount, correct_question_text, total_acquired_skill_groups_count, total_maintained_skill_group_proficiency_count, correct_skill_groups_text }) {
  const diagnosticNotCompletedMessage = <span className="name-section-subheader">Diagnostic not completed</span>
  const tooltipText = "The number of improved skills helps you celebrate each student's learning and growth. It shows you how many skills the student improved between the pre and post-diagnostic. A skill is considered “improved” if the student answered more questions for that skill correctly on the post-diagnostic than they did on the pre. <br/><br/> If the student maintained skills, you'll see that number in parentheses. A skill is considered “maintained” if the student answered all the questions for that skill correctly on both the pre and the post-diagnostic."
  const skillsDelta = (<div className="skills-delta">
    <Tooltip
      tooltipText={tooltipText}
      tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
    />
  </div>)
  const skillsSubHeader = correct_question_text ? <div className="name-section-subheader"><span className="correct-skill-text">{correct_question_text}</span>{skillsDelta}</div> : diagnosticNotCompletedMessage
  let skillGroupsSubHeader = <div className="name-section-subheader"><span className="correct-skill-text">{correct_skill_groups_text}</span></div>
  const noSkillChange = !total_acquired_skill_groups_count && !total_maintained_skill_group_proficiency_count

  if (!isPreTest && !noSkillChange) {
    const acquiredText = totalAcquiredSkillGroupsCount === 1 ? '1 Improved Skill' : `${totalAcquiredSkillGroupsCount} Improved Skills`
    const maintainedText = total_maintained_skill_group_proficiency_count === 1 ? '(1 Maintained)' : `(${total_maintained_skill_group_proficiency_count} Maintained)`
    skillGroupsSubHeader = (
      <div className="name-section-subheader">
        {!!total_acquired_skill_groups_count && <div className="skills-delta">{brightGreenTriangleUpIcon}</div>}
        {!!total_acquired_skill_groups_count && <span className="correct-skill-text acquired">{acquiredText}</span>}
        {!!total_maintained_skill_group_proficiency_count && <span className="correct-skill-text maintained">{maintainedText}</span>}
      </div>
    )
  }
  return (
    <React.Fragment>
      {skillGroupsSubHeader}
      {skillsSubHeader}
    </React.Fragment>
  )
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
  const { proficiency_text, number_of_correct_questions_text, id, } = skillGroup
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
        <div className="correct-skills-and-delta-wrapper"><span className="number-of-correct-skills-text">{number_of_correct_questions_text}</span></div>
      </button>
      {openPopover.studentId === studentResult.id && openPopover.skillGroupId === id && <Popover closePopover={closePopover} responsesLink={responsesLink} skillGroup={skillGroup} studentResult={studentResult} />}
    </td>
  )
}

const StudentRow = ({ studentResult, skillGroupSummaries, openPopover, setOpenPopover, responsesLink, isPreTest }) => {
  const { name, skill_groups, id, total_acquired_skill_groups_count, correct_question_text, correct_skill_groups_text, total_maintained_skill_group_proficiency_count } = studentResult

  const totalAcquiredSkillGroupsCount = total_acquired_skill_groups_count > 0 ? total_acquired_skill_groups_count : 0;

  const firstCell = (<th className="name-cell">
    <div>
      <StudentNameOrTooltip name={name} />
      {renderStudentHeaderSkillsData({ isPreTest, totalAcquiredSkillGroupsCount, correct_question_text, total_acquired_skill_groups_count, total_maintained_skill_group_proficiency_count, correct_skill_groups_text })}
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

const StudentResultsTable = ({ isPreTest, skillGroupSummaries, studentResults, openPopover, setOpenPopover, responsesLink }: StudentResultsTableProps) => {
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
      isPreTest={isPreTest}
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

  function renderCountData({ completedStudentCount, proficientStudentCount }) {
    if (!completedStudentCount) { return }

    if (isPreTest) {
      return <span className="label">{proficientStudentCount} of {completedStudentCount} Student{completedStudentCount === 1 ? '' : 's'}{' Proficient'}</span>
    }

    return (
      <div className="student-proficiency-data-container">
        <span className="label">{proficientStudentCount} of {completedStudentCount} Student{completedStudentCount === 1 ? '' : 's'}{' Improved or Maintained Skill'}</span>
        {renderDelta(proficientStudentCount)}
      </div>
    )
  }

  const tableHeaders = skillGroupSummaries.map(skillGroupSummary => {
    const { name, description, gained_proficiency_in_post_test_student_names, not_yet_proficient_student_names } = skillGroupSummary
    const appendedDescription = isPreTest ? description : description + POST_TEST_DESCRIPTION
    const notYetProficientStudentCount = isPreTest && not_yet_proficient_student_names.length
    const proficientStudentCount = isPreTest ? completedStudentCount - notYetProficientStudentCount : gained_proficiency_in_post_test_student_names.length
    return (
      <th className="skill-group-header" key={name}>
        <div className="name-and-tooltip">
          <span className="skill-name">{name}</span>
          <SkillGroupTooltip description={appendedDescription} key={name} name={name} />
        </div>
        {renderCountData({ completedStudentCount, proficientStudentCount })}
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
