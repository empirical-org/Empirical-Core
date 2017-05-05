import React from 'react'
import { Link } from 'react-router'

// TODO refactor this to use promptListItem shared component
const ConceptListItem = props => (
  <li>
    <Link to={'/admin/concepts/' + props.uid} activeClassName="is-active" key={props.uid}>{props.displayName}</Link>
  </li>
)

export default ConceptListItem
