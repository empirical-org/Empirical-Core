import React from 'react';
import { Link } from 'react-router'

const fillInBlankListItem = props => (
  <li><Link to={`admin/fill-in-the-blanks/${props.identifier}`}>{props.prompt}</Link></li>
)

export default fillInBlankListItem
