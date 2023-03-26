import * as React from 'react'

import {
    SkillGroup
} from './interfaces'
import {
    expandIcon, FULLY_CORRECT
} from './shared'

const DEFAULT_ROW_COUNT = 3

const SkillsTable = ({ skillGroup, isExpandable, }: { skillGroup: SkillGroup, isExpandable?: boolean }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(skillGroup.skills.length < DEFAULT_ROW_COUNT)

  function expandRows() { setIsExpanded(true) }

  const skillRows = skillGroup.skills.sort((a, b) => a.skill.localeCompare(b.skill)).map(skill => (
    <tr key={skill.skill}>
      <td>{skill.skill}</td>
      <td className="center-align">{skill.number_correct}</td>
      <td className="center-align">{skill.number_incorrect}</td>
      <td className={skill.summary === FULLY_CORRECT ? 'fully-correct' : ''}>{skill.summary}</td>
    </tr>)
  )

  const displayedRows = isExpandable && !isExpanded ? skillRows.splice(0, DEFAULT_ROW_COUNT) : skillRows
  const showMoreButton = isExpandable && !isExpanded ? <button className="show-more-button" onClick={expandRows} type="button"><span>Show more</span>{expandIcon}</button>: null

  const tableClassName = isExpandable && !isExpanded ? 'contracted' : ''

  return (
    <div className="skills-table-container">
      <table className={`skills-table ${tableClassName}`}>
        <thead>
          <tr>
            <th className="skill-column-header">Skill</th>
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

export default SkillsTable
