import * as React from 'react'
import { Link, } from 'react-router-dom'

import SkillGroupTooltip from './skillGroupTooltip'
import SkillsTable from './skillsTable'
import GrowthSkillsTable from './growthSkillsTable'
import {
  noDataYet,
  closeIcon,
  accountCommentIcon,
  proficiencyTextToTag,
  proficiencyTextToGrayIcon,
  lightGreenTriangleUpIcon,
} from './shared'
import {
  SkillGroupSummary,
  OpenPopover,
  StudentResult,
  SkillGroup,
} from './interfaces'

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
  return (<div className="student-results-popover-container hide-on-mobile">
    <section className="student-results-popover">
      <header>
        <h3>{skillGroup.skill_group}</h3>
        <button className="interactive-wrapper focus-on-light" onClick={closePopover} type="button">{closeIcon}</button>
      </header>
      <p>We were looking for etiam porta sem malesuada magna mollis euismod. Lorem ipsum dolor sit amet, consectetr adipiscing elit.</p>
      {skillGroup.skills[0].pre ? <GrowthSkillsTable skillGroup={skillGroup} /> : <SkillsTable skillGroup={skillGroup} />}
      <Link to={responsesLink(studentResult.id)}>{accountCommentIcon}<span>View {studentResult.name}&#39;s responses</span></Link>
    </section>
  </div>)
}

const StudentResultCell = ({ skillGroup, studentResult, setOpenPopover, openPopover, responsesLink, }: StudentResultCellProps) => {
  const { proficiency_text, number_of_correct_skills_text, id, pre_test_proficiency, post_test_proficiency, acquired_skill_ids, } = skillGroup
  function showPopover() {
    setOpenPopover({
      studentId: studentResult.id,
      skillGroupId: id,
    })
  }

  function closePopover() {
    setOpenPopover({})
  }

  const skillsDelta = acquired_skill_ids && acquired_skill_ids.length ? <div className="skills-delta">{lightGreenTriangleUpIcon}<span className="skill-count">{acquired_skill_ids.length}</span></div> : null

  const preAndPostIcons = pre_test_proficiency && post_test_proficiency ? <div className="pre-and-post-test-icons"><span className="pre"><span>Pre</span>{proficiencyTextToGrayIcon[pre_test_proficiency]}</span><span className="post"><span>Post</span>{proficiencyTextToGrayIcon[post_test_proficiency]}</span></div>: null

  return (<td className="student-result-cell">
    <button className="interactive-wrapper" onClick={showPopover} type="button">
      {proficiencyTextToTag[proficiency_text]}
      {preAndPostIcons}
      <div className="correct-skills-and-delta-wrapper"><span className="number-of-correct-skills-text">{number_of_correct_skills_text}</span>{skillsDelta}</div>
    </button>
    {openPopover.studentId === studentResult.id && openPopover.skillGroupId === id && <Popover closePopover={closePopover} responsesLink={responsesLink} skillGroup={skillGroup} studentResult={studentResult} />}
  </td>)
}

const StudentRow = ({ studentResult, skillGroupSummaries, openPopover, setOpenPopover, responsesLink, }) => {
  const { name, skill_groups, id, total_acquired_skills_count, } = studentResult
  const diagnosticNotCompletedMessage = skill_groups ? null : <span className="diagnostic-not-completed">Diagnostic not completed</span>
  const skillsDelta = total_acquired_skills_count ? (<div className="skills-delta">
    {lightGreenTriangleUpIcon}
    <span className="skill-count">{total_acquired_skills_count}</span>
    <Tooltip
      tooltipText="This growth score is the total number of skills gained, or the number of skills that were not fully correct on the pre-test but were fully correct on the post-test. This growth score only counts each skill one time, even if the skill is part of more than one skill group."
      tooltipTriggerText={<img alt={helpIcon.alt} src={helpIcon.src} />}
    />
  </div>) : null
  const firstCell = (<th className="name-cell">
    <div>
      <span>{name}</span>
      {diagnosticNotCompletedMessage}
      {skillsDelta}
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
  return <tr key={name}>{firstCell}{skillGroupCells}</tr>
}

const StudentResultsTable = ({ skillGroupSummaries, studentResults, openPopover, setOpenPopover, responsesLink, }: StudentResultsTableProps) => {
  const [isSticky, setIsSticky] = React.useState(false);
  const tableRef = React.useRef(null);
  const [stickyTableStyle, setStickyTableStyle] = React.useState({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3
  })

  const handleScroll = React.useCallback(({ top, bottom, left, right, }) => {
    if (top <= 0 && bottom > 92) {
      setStickyTableStyle(oldStickyTableStyle => ({ ...oldStickyTableStyle, left }))
      !isSticky && setIsSticky(true);
    } else {
      isSticky && setIsSticky(false);
    }
  }, [isSticky]);

  const onScroll = () => handleScroll(tableRef.current.getBoundingClientRect());

  React.useEffect(() => {
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [handleScroll]);

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
  const tableHasContent = completedStudentResults.length

  const tableClassName = tableHasContent ? 'student-results-table' : 'empty student-results-table'

  const renderHeader = () => {
    return (<thead>
      <tr>
        <th className="corner-header">Name</th>
        {tableHeaders}
      </tr>
    </thead>)
  }

  return (<div className="student-results-table-container" onScroll={handleScroll}>
    {tableHasContent ? null : noDataYet}
    {isSticky && (
      <table
        className={`${tableClassName} sticky`}
        style={stickyTableStyle}
      >
        {renderHeader()}
      </table>
    )}
    <table className={tableClassName} ref={tableRef}>
      {renderHeader()}
      <tbody>
        {studentRows}
      </tbody>
    </table>
  </div>)
}

export default StudentResultsTable
