import * as React from 'react';
import { Link } from 'react-router-dom';

const TabLink = props => (
  <li>
    <Link activeClassName="is-active" to={props.to}>{props.children}</Link>
  </li>
);

export default TabLink
