import * as React from 'react';
import { NavLink } from 'react-router-dom';

import * as actions from '../../actions/proofreaderActivities';

const TabLink = ({ dispatch, to, children}) => {
  function handleClick (e) {
    if(e) {
      dispatch(actions.toggleLessonForm(false));
    }
  }
  return(
    <li>
      <NavLink activeClassName="is-active" onClick={handleClick} to={to}>{children}</NavLink>
    </li>
  )
};

export default TabLink
