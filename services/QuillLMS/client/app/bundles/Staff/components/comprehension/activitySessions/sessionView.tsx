import * as React from "react";
import { Link, NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { useQuery } from 'react-query';

import PromptTable from './promptTable';
import SessionOverview from './sessionOverview';

import { Error, Spinner } from '../../../../Shared/index';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { getPromptForActivitySession } from "../../../helpers/comprehension";

var sessionData = require('./sessionData.json');


const SessionView = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  // cache activity data for updates
  const { data } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  if(!data) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(data && data.error) {
    return(
      <div className="error-container">
        <Error error={`${data.error}`} />
      </div>
    );
  }

  const { activity } = data;
  const { title } = activity;
  const { session_uid } = sessionData;

  return(
    <div className="session-view-container">
      <section className="sessions-header">
        <h1>{title}</h1>
        <Link className="return-link" to={`/activity-sessions/${activityId}`}>← Return to Sessions Index</Link>
      </section>
      <div className="tabs-container">
        <NavLink activeClassName="is-active" to={`/activity-sessions/${activityId}/${session_uid}/overview`}>
          <div className="tab-option">
            Session Overview
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activity-sessions/${activityId}/${session_uid}/because-responses`}>
          <div className="tab-option">
            Because Responses
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activity-sessions/${activityId}/${session_uid}/but-responses`}>
          <div className="tab-option">
            But Responses
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activity-sessions/${activityId}/${session_uid}/so-responses`}>
          <div className="tab-option">
            So Responses
          </div>
        </NavLink>
      </div>
      <Switch>
        <Redirect exact from='/activity-sessions/:activityId/:sessionId' to='/activity-sessions/:activityId/:sessionId/overview' />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route component={() => <SessionOverview activity={activity} sessionData={sessionData} />} path='/activity-sessions/:activityId/:sessionId/overview' />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route component={() => <PromptTable activity={activity} prompt={getPromptForActivitySession(sessionData, 0)} />} path='/activity-sessions/:activityId/:sessionId/because-responses' />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route component={() => <PromptTable activity={activity} prompt={getPromptForActivitySession(sessionData, 1)} />} path='/activity-sessions/:activityId/:sessionId/but-responses' />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route component={() => <PromptTable activity={activity} prompt={getPromptForActivitySession(sessionData, 2)} />} path='/activity-sessions/:activityId/:sessionId/so-responses' />
      </Switch>
    </div>
  );
}

export default withRouter(SessionView)
