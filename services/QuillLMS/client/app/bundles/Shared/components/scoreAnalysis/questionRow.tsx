import * as React from 'react'
import { Link } from 'react-router-dom'

const QuestionRow = (props: any) => (
  <tr>
    <td>{props.question.questionType}</td>
    <td style={{width: "600px"}}><Link to={`/admin/${props.question.pathName}/${props.question.uid}`}>{props.question.prompt}</Link></td>
    <td>{props.question.responses}</td>
    <td>{props.question.weakResponses}%</td>
    <td>{props.question.status}</td>
    <td>{props.question.focusPoints}</td>
    <td>{props.question.incorrectSequences}</td>
    <td>{props.question.hasModelConcept.toString()}</td>
    <td>{props.question.flag}</td>
    <td>{props.question.activities.length > 0 ? props.question.activities.map((a: any) => <Link style={{ display: 'block' }} to={`/admin/lessons/${a.uid}`}>{a.name}</Link>) : ''}</td>
  </tr>
)

export { QuestionRow }
