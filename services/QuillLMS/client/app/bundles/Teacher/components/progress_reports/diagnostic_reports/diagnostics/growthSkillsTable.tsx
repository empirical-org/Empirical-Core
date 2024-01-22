import * as React from 'react'

import {
  FULLY_CORRECT,
  expandIcon,
  greenCircleWithCheckIcon,
  gainedSomeProficiencyTag,
  gainedProficiencyTag,
  GAINED_PROFICIENCY,
  GAINED_SOME_PROFICIENCY,
} from './shared'

const DEFAULT_ROW_COUNT = 3

const skillGainedTag = {
  [GAINED_PROFICIENCY]: gainedProficiencyTag,
  [GAINED_SOME_PROFICIENCY]: gainedSomeProficiencyTag
}

const fullyCorrectTag = <span className="fully-correct-tag">{greenCircleWithCheckIcon} {FULLY_CORRECT}</span>

const GrowthSkillsTable = ({ skillGroupResults, isExpandable, }: { skillGroupResults: Array<any>, isExpandable?: boolean }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(skillGroupResults.length < DEFAULT_ROW_COUNT)

  function expandRows() { setIsExpanded(true) }

  const skillRows = skillGroupResults.sort((a, b) => a.skill_group.localeCompare(b.skill_group)).map(skillGroup => {
    const { pre, post, skill_group, proficiency_text, } = skillGroup
    const showSkillGainedTag = skillGainedTag[proficiency_text] ? skillGainedTag[proficiency_text] : null

    const preSummary = pre.summary === FULLY_CORRECT ? fullyCorrectTag : pre.summary
    const postSummary = post.summary === FULLY_CORRECT ? fullyCorrectTag : post.summary

    let postSummaryClassName
    postSummaryClassName += showSkillGainedTag ? ' contains-skill-gained-tag' : ''
    return (
      <tr key={skill_group}>
        <td>{skill_group}</td>
        <td><div className="no-left-padding pre-and-post-text"><span>Pre</span><span>Post</span></div></td>
        <td className="center-align"><div><span>{pre.number_correct}</span><span>{post.number_correct}</span></div></td>
        <td className="center-align"><div><span>{pre.number_incorrect}</span><span>{post.number_incorrect}</span></div></td>
        <td>
          <div>
            <span>{preSummary}</span>
            <span className={postSummaryClassName}>{postSummary}{showSkillGainedTag}</span>
          </div>
        </td>
      </tr>
    )
  })

  const displayedRows = isExpandable && !isExpanded ? skillRows.splice(0, DEFAULT_ROW_COUNT) : skillRows
  const showMoreButton = isExpandable && !isExpanded ? <button className="show-more-button" onClick={expandRows} type="button"><span>Show more</span>{expandIcon}</button>: null

  const tableClassName = isExpandable && !isExpanded ? 'contracted' : ''

  return (
    <div className="skills-table-container">
      <table className={`growth-skills-table ${tableClassName}`}>
        <thead>
          <tr>
            <th className="skill-column-header">Skill</th>
            <th aria-label="Pre or Post" />
            <th>Correct</th>
            <th>Incorrect</th>
            <th className="summary-header">Summary</th>
          </tr>
        </thead>
        <tbody>{displayedRows}</tbody>
      </table>
      {showMoreButton}
    </div>
  )
}

export default GrowthSkillsTable
