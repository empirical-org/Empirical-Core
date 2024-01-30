import * as React from 'react'

import {
  FULLY_CORRECT,
  expandIcon
} from './shared'

const DEFAULT_ROW_COUNT = 3

const SkillsTable = ({ skillGroupResults, isExpandable, }: { skillGroupResults: Array<any>, isExpandable?: boolean }) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(skillGroupResults.length < DEFAULT_ROW_COUNT)

  function expandRows() { setIsExpanded(true) }

  const skillRows = skillGroupResults.sort((a, b) => a.skill_group.localeCompare(b.skill_group)).map(skillGroup => (
    <tr key={skillGroup.skill_group}>
      <td>{skillGroup.skill_group}</td>
      <td>{skillGroup.number_correct}</td>
      <td>{skillGroup.number_incorrect}</td>
      <td className={skillGroup.summary === FULLY_CORRECT ? 'fully-correct' : ''}>{skillGroup.summary}</td>
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
