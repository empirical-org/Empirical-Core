import * as React from 'react'
import { Link } from 'react-router-dom';

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
      className={props.className}
    >
      {props.text}
    </Link>
  </li>
)

export default LinkListItem
