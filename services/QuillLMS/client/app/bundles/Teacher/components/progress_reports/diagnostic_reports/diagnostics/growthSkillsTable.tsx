import * as React from 'react'

import {
  FULLY_CORRECT,
  expandIcon,
  triangleUpIcon,
} from './shared'
import {
  SkillGroup
} from './interfaces'

const DEFAULT_ROW_COUNT = 3

const GrowthSkillsTable = ({ skillGroup, isExpandable, }: { skillGroup: SkillGroup, isExpandable?: boolean }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(skillGroup.skills.length < DEFAULT_ROW_COUNT)

  function expandRows() { setIsExpanded(true) }

  const skillGainedTag = <span className="skill-gained-tag">{triangleUpIcon}<span>Skill gained</span></span>
  const skillRows = skillGroup.skills.sort((a, b) => a.pre.skill.localeCompare(b.pre.skill)).map(skill => {
    const { pre, post, } = skill
    const showSkillGainedTag = pre.summary !== FULLY_CORRECT && post.summary === FULLY_CORRECT ? skillGainedTag : null
    const preSummaryClassName = pre.summary === FULLY_CORRECT ? 'fully-correct' : ''
    let postSummaryClassName = post.summary === FULLY_CORRECT ? 'fully-correct' : ''
    postSummaryClassName += showSkillGainedTag ? ' contains-skill-gained-tag' : ''
    return (
      <tr key={pre.skill}>
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
            <th />
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
