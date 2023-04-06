import * as React from 'react';
import { Link } from 'react-router-dom';

// interface LinkListProps {
//   basePath: string;
//   itemKey: string;
//   text: string;
//   activeClassName?: string;
//   className?: string;
// }

export const LinkListItem = (props: any) => (
  <li>
    <Link
      className={props.className}
      to={'/admin/' + props.basePath + '/' + props.itemKey + '/' + (props.subpath || '')}
    >
      {props.text}
    </Link>
  </li>
)

export default LinkListItem
