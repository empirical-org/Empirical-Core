import React from 'react'
import { Link } from 'react-router'

const QuestionRow = props => (
  <tr>
    <td width="600px"><Link to={`/admin/questions/${props.question.key}`}>{props.question.prompt}</Link></td>
    <td>{props.question.percentWeak}</td>
    <td>{props.question.commonUnmatched}</td>
    <td>{props.question.unmatched}</td>
    <td>{props.question.responses}</td>
    <td>{props.question.attempts}</td>
    <td>{props.question.hasModelConcept.toString()}</td>
    <td>{props.question.focusPoints}</td>
    <td>{props.question.incorrectSequences}</td>
  </tr>
)

export default QuestionRow
