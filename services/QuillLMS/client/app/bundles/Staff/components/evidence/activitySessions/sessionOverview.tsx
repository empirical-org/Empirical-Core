import * as moment from 'moment';
import * as React from "react";

import PromptTable from './promptTable';

import { BECAUSE, BUT, SO } from '../../../../../constants/evidence';
import { DataTable, Error, Spinner } from '../../../../Shared/index';
import { getPromptForActivitySession } from "../../../helpers/evidence/promptHelpers";

const SessionOverview = ({ activity, rules, sessionData }) => {

  function sessionRows({ activitySession }) {
    if(!activitySession) {
      return [];
    }
    // format for DataTable to display labels on left side and values on right
    const { start_date, completed, session_uid, because_attempts, but_attempts, so_attempts } = activitySession;
    const totalResponses = because_attempts + but_attempts + so_attempts;
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
        value: completed ? 'True' : 'False'
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
        <Error error={sessionData.error} />
      </div>
    );
  }

  // Header labels are redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" },
    { name: "", attribute:"value", width: "400px" }
  ];

  const sessionId = sessionData && sessionData.activitySession ? sessionData.activitySession.session_uid : null;

  return(
    <div className="session-overview-container">
      <DataTable
        className="session-overview-table"
        headers={dataTableFields}
        rows={sessionRows(sessionData)}
      />
      <PromptTable activity={activity} prompt={getPromptForActivitySession(sessionData, BECAUSE)} rules={rules} sessionId={sessionId} showHeader={true} />
      <PromptTable activity={activity} prompt={getPromptForActivitySession(sessionData, BUT)} rules={rules} sessionId={sessionId} showHeader={true} />
      <PromptTable activity={activity} prompt={getPromptForActivitySession(sessionData, SO)} rules={rules} sessionId={sessionId} showHeader={true} />
    </div>
  );
}

export default SessionOverview;
