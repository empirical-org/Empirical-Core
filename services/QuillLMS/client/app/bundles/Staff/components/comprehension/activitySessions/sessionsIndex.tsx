import * as React from "react";
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as moment from 'moment'

import { DataTable, Error, Spinner } from '../../../../Shared/index';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';

var sessionsData = require('./sessionsData.json');

const SessionsIndex = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  // cache activity data for updates
  const { data } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  function formatSessionsData(activitySessions: any[]) {
    return activitySessions.map(session => {
      const formattedSession = {...session};
      const { start_date, session_uid, because_responses, but_responses, so_responses } = session;
      const dateObject = new Date(start_date);
      const date = moment(dateObject).format("MM/DD/YY");
      const time = moment(dateObject).format("HH:MM A");
      const total = because_responses + but_responses + so_responses;
      formattedSession.date = date;
      formattedSession.time = time;
      formattedSession.total_responses = total;
      formattedSession.view_link = <Link to={`/activity-sessions/${activityId}/${session_uid}`}>View</Link>;
      return formattedSession;
    });
  }

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

  const dataTableFields = [
    { name: "Day", attribute:"date", width: "100px" },
    { name: "Time", attribute:"time", width: "100px" },
    { name: "Session ID", attribute:"session_uid", width: "350px" },
    { name: "Total Responses", attribute:"total_responses", width: "150px" },
    { name: "Because", attribute:"because_responses", width: "75px" },
    { name: "But", attribute:"but_responses", width: "75px" },
    { name: "So", attribute:"so_responses", width: "75px" },
    { name: "View", attribute:"view_link", width: "150px" }
  ];

  const { activity } = data;
  const { title } = activity;
  const { activity_sessions, total_activity_sessions } = sessionsData
  return(
    <div className="sessions-index-container">
      <section className="sessions-header">
        <h1>{title}</h1>
        <Link to="/activity-sessions">← Return to Activities Index</Link>
      </section>
      <section>
        <div className="total-container">
          <p className="total-label">Total</p>
          <p className="total-value">{total_activity_sessions}</p>
        </div>
        <DataTable
          className="activity-sessions-table"
          headers={dataTableFields}
          rows={formatSessionsData(activity_sessions)}
        />
      </section>
    </div>
  );
}

export default SessionsIndex
