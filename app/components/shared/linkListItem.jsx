import React from 'react'
import {Link} from 'react-router'

const LinkListItem = props => (
  <li>
    <Link
      to={'admin/' + props.basePath + '/' + props.itemKey}
      activeClassName={props.activeClassName}
      className={props.className}
    >
      {props.text}
    </Link>
  </li>
)

export default LinkListItem
