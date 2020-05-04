import * as React from "react";
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import ActivitySettings from './activitySettings'

const Activity = (props) => {
  const { match } = props;
  const { params } = match;
  const { activityId } = params;
  return(
    <div className="activity-container">
      <div className="tabs-container">
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/settings`}>
          <div className="tab-option">
            General Activity Settings
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/regex-feedback`}>
          <div className="tab-option">
            Regex Feedback
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/topic-feedback`}>
          <div className="tab-option">
            Topic Feedback
          </div>
        </NavLink>
      </div>
      <Switch>
        <Redirect component={ActivitySettings} exact from='/activities/:activityId' to='/activities/:activityId/settings' />
        <Route component={ActivitySettings} path='/activities/:activityId/settings' />
      </Switch>
    </div>
  );
}

export default withRouter(Activity)
