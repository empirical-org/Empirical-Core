import * as React from 'react'
import { Link } from 'react-router'

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
      activeClassName={props.activeClassName}
      className={props.className}
      to={'admin/' + props.basePath + '/' + props.itemKey}
    >
      {props.text}
    </Link>
  </li>
)

export { LinkListItem }
