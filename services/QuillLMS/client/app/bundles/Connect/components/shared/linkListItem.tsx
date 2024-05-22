import * as React from 'react';
import { NavLink } from 'react-router-dom';

const LinkListItem = (props:any) => {
  const { activeClassName, className, basePath, excludeResponses, itemKey } = props
  const responsesString = !excludeResponses ? '/responses' : ''
  return(
    <li>
      <NavLink
        activeClassName={activeClassName}
        className={className}
        to={'/admin/' + basePath + '/' + itemKey + responsesString}
      >
        {props.text}
      </NavLink>
    </li>
  )
}

export { LinkListItem };
