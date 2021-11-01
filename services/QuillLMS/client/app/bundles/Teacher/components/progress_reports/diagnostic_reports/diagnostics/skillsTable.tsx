import * as React from 'react'

import {
  FULLY_CORRECT,
} from './shared'

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

export default SkillsTable
