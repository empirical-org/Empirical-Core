import * as React from "react";
import { Link, NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { useQuery } from 'react-query';

import PromptTable from './promptTable';
import SessionOverview from './sessionOverview';

import { Error, Spinner } from '../../../../Shared/index';
import { fetchActivity, fetchActivitySession } from '../../../utils/comprehension/activityAPIs';
import { getPromptForActivitySession } from "../../../helpers/comprehension";
import { BECAUSE, BUT, SO } from '../../../../../constants/comprehension';

const SessionView = ({ match }) => {
  const { params } = match;
  const { activityId, sessionId } = params;

  // cache activity data for updates
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache session data for updates
  const { data: sessionData } = useQuery({
    queryKey: [`activity-${activityId}-session-${sessionId}`, sessionId],
    queryFn: fetchActivitySession
  });

  if(!sessionData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(sessionData && sessionData.error) {
    return(
      <div className="error-container">
        <Error error={`${sessionData.error}`} />
      </div>
    );
  }

  const { activity } = activityData;
  const { title } = activity;
  const { activitySession } = sessionData;
  const { session_uid } = activitySession;

  return(
    <div className="session-view-container">
      <section className="sessions-header">
        <h1>{title}</h1>
        <Link className="return-link" to={`/activities/${activityId}/activity-sessions`}>← Return to Sessions Index</Link>
      </section>
      <div className="tabs-container">
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/activity-sessions/${session_uid}/overview`}>
          <div className="tab-option">
            Session Overview
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/activity-sessions/${session_uid}/because-responses`}>
          <div className="tab-option">
            Because Responses
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/activity-sessions/${session_uid}/but-responses`}>
          <div className="tab-option">
            But Responses
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/activity-sessions/${session_uid}/so-responses`}>
          <div className="tab-option">
            So Responses
          </div>
        </NavLink>
      </div>
      <Switch>
        <Redirect exact from='/activities/:activityId/activity-sessions/:sessionId' to='/activities/:activityId/activity-sessions/:sessionId/overview' />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route component={() => <SessionOverview activity={activity} sessionData={sessionData} />} path='/activities/:activityId/activity-sessions/:sessionId/overview' />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route component={() => <PromptTable activity={activity} prompt={getPromptForActivitySession(sessionData, BECAUSE)} />} path='/activities/:activityId/activity-sessions/:sessionId/because-responses' />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route component={() => <PromptTable activity={activity} prompt={getPromptForActivitySession(sessionData, BUT)} />} path='/activities/:activityId/activity-sessions/:sessionId/but-responses' />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route component={() => <PromptTable activity={activity} prompt={getPromptForActivitySession(sessionData, SO)} />} path='/activities/:activityId/activity-sessions/:sessionId/so-responses' />
      </Switch>
    </div>
  );
}

export default withRouter(SessionView)
