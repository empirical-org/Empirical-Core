import * as React from "react";
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as moment from 'moment'

import { DataTable, Error, Spinner } from '../../../../Shared/index';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';

var sessionData = require('./sessionData.json');


const SessionsIndex = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  // cache activity data for updates
  const { data } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  function sessionRows(sessionData: any) {
    if(!sessionData) {
      return [];
    } else {
      // format for DataTable to display labels on left side and values on right
      const { start_date, prompts, session_completed, session_uid } = sessionData;
      const totalResponses = getTotalResponses(prompts);
      const dateObject = new Date(start_date);
      const date = moment(dateObject).format("MM/DD/YY HH:MM A");

      const fields = [
        {
          label: 'Activity Session',
          value: session_uid
        },
        {
          label: 'Time Started',
          value: date
        },
        {
          label: 'Session Complete?',
          value: session_completed ? 'True' : 'False'
        },
        {
          label: 'Total Responses',
          value: totalResponses
        }
      ];
      return fields.map((field, i) => {
        const { label, value } = field
        return {
          id: `${field}-${i}`,
          field: label,
          value
        }
      });
    }
  }

  function getTotalResponses(prompts: any[]) {
    let total = 0;
    prompts && prompts.forEach(prompt => {
      const { attempts } = prompt;
      total += Object.keys(attempts).length;
    });
    return total;
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

  // Header labels are redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" },
    { name: "", attribute:"value", width: "400px" }
  ];

  const { activity } = data;
  const { title } = activity;
  return(
    <div className="session-view-container">
      <section className="sessions-header">
        <h1>{title}</h1>
        <Link to={`/activity-sessions/${activityId}`}>← Return to Session Index</Link>
      </section>
      <DataTable
        className="session-overview-table"
        headers={dataTableFields}
        rows={sessionRows(sessionData)}
      />
    </div>
  );
}

export default SessionsIndex
