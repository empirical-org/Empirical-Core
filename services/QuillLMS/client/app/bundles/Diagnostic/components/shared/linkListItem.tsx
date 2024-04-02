import * as React from 'react';
import { NavLink } from 'react-router-dom';

const LinkListItem = (props:any) => (
  <li>
    <NavLink
      activeClassName={props.activeClassName}
      className={props.className}
      to={'/admin/' + props.basePath + '/' + props.itemKey + '/responses'}
    >
      {props.text}
    </NavLink>
  </li>
)

export { LinkListItem };
