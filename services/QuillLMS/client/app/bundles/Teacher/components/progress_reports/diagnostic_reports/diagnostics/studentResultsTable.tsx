import * as React from 'react'
import { Link, } from 'react-router-dom'

import SkillGroupTooltip from './skillGroupTooltip'
import {
  noDataYet,
  FULLY_CORRECT,
  closeIcon,
  accountCommentIcon,
  proficiencyTextToTag,
  proficiencyTextToGrayIcon,
  lightGreenTriangleUpIcon,
  triangleUpIcon,
} from './shared'

import {
  helpIcon,
  Tooltip,
} from '../../../../../Shared/index'

const SkillsTable = ({ skillGroup, }) => {
  const skillRows = skillGroup.skills.map(skill => (
    <tr key={skill.skill}>
      <td>{skill.skill}</td>
      <td className="center-align">{skill.number_correct}</td>
      <td className="center-align">{skill.number_incorrect}</td>
      <td className={skill.summary === FULLY_CORRECT ? 'fully-correct' : ''}>{skill.summary}</td>
    </tr>)
  )

  return (<table className="skills-table">
    <thead>
      <tr>
        <th className="skill-column-header">Skill</th>
        <th>Correct</th>
        <th>Incorrect</th>
        <th className="summary-header">Summary</th>
      </tr>
    </thead>
    <tbody>{skillRows}</tbody>
  </table>)
}

const GrowthSkillsTable = ({ skillGroup, }) => {
  const skillGainedTag = <span className="skill-gained-tag">{triangleUpIcon}<span>Skill gained</span></span>
  const skillRows = skillGroup.skills.map(skill => {
    const { pre, post, } = skill
    const showSkillGainedTag = pre.summary !== FULLY_CORRECT && post.summary === FULLY_CORRECT ? skillGainedTag : null
    const preSummaryClassName = pre.summary === FULLY_CORRECT ? 'fully-correct' : ''
    let postSummaryClassName = post.summary === FULLY_CORRECT ? 'fully-correct' : ''
    postSummaryClassName += showSkillGainedTag ? ' contains-skill-gained-tag' : ''
    return (<tr key={pre.skill}>
      <td>{pre.skill}</td>
      <td><div className="no-left-padding"><span>Pre</span><span>Post</span></div></td>
      <td className="center-align"><div><span>{pre.number_correct}</span><span>{post.number_correct}</span></div></td>
      <td className="center-align"><div><span>{pre.number_incorrect}</span><span>{post.number_incorrect}</span></div></td>
      <td>
        <div>
          <span className={preSummaryClassName}>{pre.summary}</span>
          <span className={postSummaryClassName}>{post.summary}{showSkillGainedTag}</span>
        </div>
      </td>
    </tr>)
  })

  return (<table className="growth-skills-table">
    <thead>
      <tr>
        <th className="skill-column-header">Skill</th>
        <th />
        <th>Correct</th>
        <th>Incorrect</th>
        <th className="summary-header">Summary</th>
      </tr>
    </thead>
    <tbody>{skillRows}</tbody>
  </table>)
}

const Popover = ({ studentResult, skillGroup, closePopover, responsesLink, }) => {
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

const StudentResultCell = ({ skillGroup, studentResult, setOpenPopover, openPopover, responsesLink, }) => {
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

    const element = document.getElementsByClassName('student-results-table')[0]
    const containerElement = document.getElementsByClassName('student-results-table-container')[0]

  }, [isSticky]);

  const handleTableScroll = () => { handleScroll(tableRef.current.getBoundingClientRect()) }

  React.useEffect(() => {
    const onScroll = () => {
      handleScroll(tableRef.current.getBoundingClientRect());
    };
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
  const incompleteStudentResults = studentResults.filter(sr => !sr.skill_groups)
  const tableHasContent = completedStudentResults.length

  const tableHeight = 65 + (74 * incompleteStudentResults.length) + (92 * completedStudentResults.length)
  const containerStyle = { height: `${tableHeight + 16}px` }
  const tableStyle = { height: `${tableHeight}px` }
  const tableClassName = tableHasContent ? 'student-results-table' : 'empty student-results-table'

  const renderHeader = () => {
    return (<thead>
      <tr>
        <th className="corner-header">Name</th>
        {tableHeaders}
      </tr>
    </thead>)
  }

  return (<div className="student-results-table-container" onScroll={handleTableScroll}>
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
