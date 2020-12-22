import * as React from "react";
import * as moment from 'moment'

import { DataTable, Error, Spinner } from '../../../../Shared/index';

const SessionOverview = ({ sessionData }) => {

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
    prompts && prompts.forEach((prompt: any) => {
      const { attempts } = prompt;
      total += Object.keys(attempts).length;
    });
    return total;
  }


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

  // Header labels are redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" },
    { name: "", attribute:"value", width: "400px" }
  ];

  return(
    <div className="session-overview-container">
      <DataTable
        className="session-overview-table"
        headers={dataTableFields}
        rows={sessionRows(sessionData)}
      />
    </div>
  );
}

export default SessionOverview;
