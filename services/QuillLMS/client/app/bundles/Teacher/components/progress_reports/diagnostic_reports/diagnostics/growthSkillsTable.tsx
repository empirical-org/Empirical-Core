import * as React from 'react'

import {
  FULLY_CORRECT,
  triangleUpIcon,
} from './shared'

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

export default GrowthSkillsTable
