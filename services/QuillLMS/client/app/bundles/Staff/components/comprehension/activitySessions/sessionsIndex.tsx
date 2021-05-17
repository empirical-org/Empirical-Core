import * as React from "react";
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as moment from 'moment'

import { DataTable, Error, Spinner, DropdownInput } from '../../../../Shared/index';
import { fetchActivity, fetchActivitySessions } from '../../../utils/comprehension/activityAPIs';
import { DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';

const quillCheckmark = 'https://assets.quill.org/images/icons/check-circle-small.svg';

const SessionsIndex = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  const [pageNumber, setPageNumber] = React.useState<DropdownObjectInterface>(null);
  const [dropdownOptions, setDropdownOptions] = React.useState<DropdownObjectInterface[]>(null);
  const pageNumberForQuery = pageNumber && pageNumber.value ? pageNumber.value : 1;

  // cache activity data for updates
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache activity sessions data for updates
  const { data: sessionsData } = useQuery({
    queryKey: [`activity-${activityId}-sessions`, activityId, pageNumberForQuery],
    queryFn: fetchActivitySessions
  });

  React.useEffect(() => {
    sessionsData && !dropdownOptions && getDropdownOptions(sessionsData)
  }, [sessionsData]);

  function handlePageChange(number) {
    setPageNumber(number)
  }

  function formatSessionsData(activitySessions: any[]) {
    console.log("🚀 ~ file: sessionsIndex.tsx ~ line 41 ~ formatSessionsData ~ activitySessions", activitySessions)
    return activitySessions.map(session => {
      const { start_date, session_uid, because_attempts, but_attempts, so_attempts, complete } = session;
      const dateObject = new Date(start_date);
      const date = moment(dateObject).format("MM/DD/YY");
      const time = moment(dateObject).format("HH:MM A");
      const total = because_attempts + but_attempts + so_attempts;
      const formattedSession = {
        ...session,
        id: session_uid,
        date: date,
        time: time,
        because_attempts: because_attempts,
        but_attempts: but_attempts,
        so_attempts: so_attempts,
        total_attempts: total,
        view_link: <Link className="data-link" to={`/activities/${activityId}/activity-sessions/${session_uid}/overview`}>View</Link>,
        completed: complete ? <img alt="quill-circle-checkmark" src={quillCheckmark} /> : ""
      };
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
    const { activitySessions } = sessionsData
    const { current_page, total_pages } = activitySessions;
    setPageNumber({'value': current_page, 'label':`Page ${current_page}`})
    const options = [];
    for(let i=1; i <= total_pages; i++) {
      options.push({'value':i, 'label':`Page ${i}`})
    }
    setDropdownOptions(options);
  }

  if(!sessionsData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(sessionsData && sessionsData.error) {
    return(
      <div className="error-container">
        <Error error={sessionsData.error} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Day", attribute:"date", width: "100px" },
    { name: "Time", attribute:"time", width: "100px" },
    { name: "Session ID", attribute:"session_uid", width: "350px" },
    { name: "Total Responses", attribute:"total_attempts", width: "150px" },
    { name: "Because", attribute:"because_attempts", width: "50px" },
    { name: "But", attribute:"but_attempts", width: "50px" },
    { name: "So", attribute:"so_attempts", width: "50px" },
    { name: "Completed?", attribute: "completed", width: "75px"},
    { name: "", attribute:"view_link", width: "100px" }
  ];

  const { activity } = activityData;
  const { title } = activity;
  const { activitySessions } = sessionsData
  const { activity_sessions, total_activity_sessions } = activitySessions

  return(
    <div className="sessions-index-container">
      <section className="sessions-header">
        <h1>{title}</h1>
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
