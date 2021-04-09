import * as React from 'react'
import { Link } from 'react-router-dom';

import * as actions from '../../actions/proofreaderActivities';

const TabLink = ({ dispatch, to, children}) => {
  function handleClick (e) {
    if(e) {
      dispatch(actions.toggleLessonForm(false));
    }
  }
  return(
    <li>
      <Link activeClassName="is-active" onClick={handleClick} to={to}>{children}</Link>
    </li>
  )
};

export default TabLink
