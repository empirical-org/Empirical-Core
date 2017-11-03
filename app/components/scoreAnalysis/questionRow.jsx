import React from 'react'
import { Link } from 'react-router'

const QuestionRow = props => (
  <tr>
    <td>{props.question.questionType}</td>
    <td width="600px"><Link to={`/admin/${props.question.pathName}/${props.question.uid}`}>{props.question.prompt}</Link></td>
    <td>{props.question.responses}</td>
    <td>{props.question.weakResponses}%</td>
    <td>{props.question.status}</td>
    <td>{props.question.focusPoints}</td>
    <td>{props.question.incorrectSequences}</td>
    <td>{props.question.hasModelConcept.toString()}</td>
    <td>{props.question.flag}</td>
  </tr>
)

export default QuestionRow
