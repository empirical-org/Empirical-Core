import React from 'react'
import {Link} from 'react-router'

const PromptListItem = (props) => (
  <li><Link to={'admin/' + props.questionType + '/' + props.itemKey}>{props.prompt}</Link></li>
)

export default PromptListItem
