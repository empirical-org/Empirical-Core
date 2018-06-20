import React from 'react'
import {Link} from 'react-router'

// interface LinkListProps {
//   basePath: string;
//   itemKey: string;
//   text: string;
//   activeClassName?: string;
//   className?: string;
// }

const LinkListItem = (props:any) => (
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

export { LinkListItem }
