import * as React from "react";
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as moment from 'moment'

import { DataTable, Error, Spinner, DropdownInput } from '../../../../Shared/index';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';

const quillCheckmark = 'https://assets.quill.org/images/icons/check-circle-small.svg';
var sessionsData = require('./sessionsData.json');

const SessionsIndex = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  const [pageNumber, setPageNumber] = React.useState<object>(null);
  const [dropdownOptions, setDropdownOptions] = React.useState<object>(null);

  React.useEffect(() => {
    getDropdownOptions(sessionsData)
  }, [dropdownOptions]);

  // cache activity data for updates
  const { data } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  function handlePageChange(number) {
    setPageNumber(number)
  }

  function formatSessionsData(activitySessions: any[]) {
    return activitySessions.map(session => {
      const formattedSession = {...session};
      const { start_date, session_uid, because_responses, but_responses, so_responses, completed } = session;
      const dateObject = new Date(start_date);
      const date = moment(dateObject).format("MM/DD/YY");
      const time = moment(dateObject).format("HH:MM A");
      const total = because_responses + but_responses + so_responses;
      formattedSession.date = date;
      formattedSession.time = time;
      formattedSession.total_responses = total;
      formattedSession.view_link = <Link to={`/activity-sessions/${activityId}/${session_uid}`}>View</Link>;
      formattedSession.completed = completed ? <img alt="quill-circle-checkmark" src={quillCheckmark} /> : "";
      return formattedSession;
    });
  }

  function getDropdownOptions(sessionsData) {
    if(!sessionsData) {
      return null;
    }
    if(dropdownOptions) {
      return dropdownOptions;
    }
    const { current_page, total_pages } = sessionsData;
    setPageNumber({'value':current_page, 'label':`Page ${current_page}`})
    const options = [];
    for(let i=1; i <= total_pages; i++) {
      options.push({'value':i, 'label':`Page ${i}`})
    }
    setDropdownOptions(options);
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
    { name: "Because", attribute:"because_responses", width: "50px" },
    { name: "But", attribute:"but_responses", width: "50px" },
    { name: "So", attribute:"so_responses", width: "50px" },
    { name: "Completed?", attribute: "completed", width: "75px"},
    { name: "View", attribute:"view_link", width: "100px" }
  ];

  const { activity } = data;
  const { title } = activity;
  const { activity_sessions, total_activity_sessions } = sessionsData

  return(
    <div className="sessions-index-container">
      <section className="sessions-header">
        <h1>{title}</h1>
        <Link className="return-link" to="/activity-sessions">← Return to Activities Index</Link>
      </section>
      <section>
        <section className="top-section">
          <section className="total-container">
            <p className="total-label">Total</p>
            <p className="total-value">{total_activity_sessions}</p>
          </section>
          <DropdownInput
            handleChange={handlePageChange}
            isSearchable={false}
            label=""
            options={dropdownOptions}
            value={pageNumber}
          />
        </section>
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
