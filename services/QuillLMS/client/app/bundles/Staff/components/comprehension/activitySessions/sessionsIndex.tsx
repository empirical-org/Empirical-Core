import * as React from "react";
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as moment from 'moment';
import { firstBy } from 'thenby';

import { Error, Spinner, DropdownInput } from '../../../../Shared/index';
import { fetchActivity, fetchActivitySessions } from '../../../utils/comprehension/activityAPIs';
import { DropdownObjectInterface } from '../../../interfaces/comprehensionInterfaces';
import { activitySessionIndexResponseHeaders, activitySessionFilterOptions } from '../../../../../constants/comprehension';

const quillCheckmark = 'https://assets.quill.org/images/icons/check-circle-small.svg';

const SessionsIndex = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  const [pageNumber, setPageNumber] = React.useState<DropdownObjectInterface>(null);
  const [pageDropdownOptions, setPageDropdownOptions] = React.useState<DropdownObjectInterface[]>(null);
  const [filterOption, setFilterOption] = React.useState<DropdownObjectInterface>(activitySessionFilterOptions[0]);
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [sortInfo, setSortInfo] = React.useState<any>(null);
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
    sessionsData && !pageDropdownOptions && getPageDropdownOptions(sessionsData);
  }, [sessionsData]);

  React.useEffect(() => {
    if(sessionsData && sessionsData.activitySessions && sessionsData.activitySessions.activity_sessions && !rowData.length) {
      const { activitySessions } = sessionsData;
      const { activity_sessions } = activitySessions;
      const rows = formatSessionsData(activity_sessions)
      setRowData(rows);
    }
  }, [sessionsData]);

  function getFilteredRows(filter: string, activitySessions: any) {
    switch (filter) {
      case 'all':
        return activitySessions;
      case 'scored':
        return activitySessions.filter(row => row.scored_count > 0);
      case 'unscored':
        return activitySessions.filter(row => row.scored_count === 0);
      case 'weak':
        return activitySessions.filter(row => row.weak_count > 0);
      case 'complete':
        return activitySessions.filter(row => row.complete);
      case 'incomplete':
        return activitySessions.filter(row => !row.complete);
      default:
        return activitySessions;
    }
  }

  function handleFilterOptionChange(option, activitySessions) {
    const { value } = option;
    const formattedRows = formatSessionsData(activitySessions);
    const sortedRows = sortedSessions(formattedRows, sortInfo)
    const filteredRows = getFilteredRows(value, sortedRows);
    setFilterOption(option);
    setRowData(filteredRows);
  }

  function handleDataUpdate(activity_sessions, state) {
    const { sorted } = state;
    const sortInfo = sorted[0];
    const rows = formatSessionsData(activity_sessions);
    const sortedRows = sortedSessions(rows, sortInfo)
    setRowData(sortedRows);
  }

  function getPageDropdownOptions(sessionsData) {
    if(!sessionsData) {
      return null;
    }
    if(pageDropdownOptions) {
      return pageDropdownOptions;
    }
    const { activitySessions } = sessionsData
    const { current_page, total_pages } = activitySessions;
    setPageNumber({'value': current_page, 'label':`Page ${current_page}`})
    const options = [];
    for(let i=1; i <= total_pages; i++) {
      options.push({'value':i, 'label':`Page ${i}`})
    }
    setPageDropdownOptions(options);
  }

  function handlePageChange(number) {
    setPageNumber(number);
  }

  function getSortedRows({ activitySessions, id, directionOfSort }) {
    const columnOptions  = ['total_attempts', 'because_attempts', 'but_attempts', 'so_attempts'];
    if(columnOptions.includes(id)) {
      return activitySessions.sort(firstBy(id, { direction: directionOfSort }).thenBy('datetime, desc'));
    }
    return activitySessions.sort(firstBy(id, { direction: directionOfSort }));
  }

  function sortedSessions(activitySessions: any[], sortInfo?: any) {
    if(sortInfo) {
      setSortInfo(sortInfo);
      const { id, desc } = sortInfo;
      // we have this reversed so that the first click will sort from highest to lowest by default
      const directionOfSort = desc ? `asc` : 'desc';
      const sorted = getSortedRows({ activitySessions, id, directionOfSort });
      return sorted;
    } else {
      return activitySessions;
    }
  }

  function formatSessionsData(activitySessions: any[]) {
    return activitySessions.map(session => {
      const { start_date, session_uid, because_attempts, but_attempts, so_attempts, complete } = session;
      const dateObject = new Date(start_date);
      const date = moment(dateObject).format("MM/DD/YY");
      const time = moment(dateObject).format("HH:MM A");
      const total = because_attempts + but_attempts + so_attempts;
      const formattedSession = {
        ...session,
        id: session_uid,
        session_uid: session_uid ? session_uid.substring(0,6) : '',
        datetime: `${date} ${time}`,
        because_attempts: because_attempts,
        but_attempts: but_attempts,
        so_attempts: so_attempts,
        total_attempts: total,
        view_link: <Link className="data-link" rel="noopener noreferrer" target="_blank" to={`/activities/${activityId}/activity-sessions/${session_uid}/overview`}>View</Link>,
        completed: complete ? <img alt="quill-circle-checkmark" src={quillCheckmark} /> : ""
      };
      return formattedSession;
    });
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

  const { activity } = activityData;
  const { title } = activity;
  const { activitySessions } = sessionsData;
  const { total_activity_sessions, activity_sessions } = activitySessions;

  return(
    <div className="sessions-index-container">
      <section className="sessions-header">
        <h1>{title}</h1>
      </section>
      <section>
        <p className="link-info-blurb">If you want to look up an individual activity session, plug the activity session ID into this url and it will load: https://www.quill.org/cms/comprehension#/activities/activityID/sessionID</p>
        <section className="top-section">
          <section className="total-container">
            <p className="total-label">Total</p>
            <p className="total-value">{total_activity_sessions}</p>
          </section>
          <DropdownInput
            handleChange={handlePageChange}
            isSearchable={false}
            label=""
            options={pageDropdownOptions}
            value={pageNumber}
          />
          <DropdownInput
            /* eslint-disable-next-line react/jsx-no-bind */
            handleChange={(option) => handleFilterOptionChange(option, activity_sessions)}
            isSearchable={false}
            label=""
            options={activitySessionFilterOptions}
            value={filterOption}
          />
        </section>
        <ReactTable
          className="activity-sessions-table"
          columns={activitySessionIndexResponseHeaders}
          data={rowData}
          defaultPageSize={rowData.length < 100 ? rowData.length : 100}
          manual
          /* eslint-disable-next-line react/jsx-no-bind */
          onFetchData={(state) => handleDataUpdate(activity_sessions, state)}
          showPagination={false}
        />
      </section>
    </div>
  );
}

export default SessionsIndex
