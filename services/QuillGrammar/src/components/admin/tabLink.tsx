import * as React from 'react'
import { Link } from 'react-router-dom';

const TabLink = props => (
  <li>
    <Link to={props.to} activeClassName="is-active">{props.children}</Link>
  </li>
);

export default TabLink
