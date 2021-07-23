import * as React from "react";
import ReactTable from 'react-table';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as moment from 'moment';
import { firstBy } from 'thenby';
import DateTimePicker from 'react-datetime-picker';

import { handlePageFilterClick, renderHeader } from "../../../helpers/comprehension";
import { Error, Spinner, DropdownInput, Input } from '../../../../Shared/index';
import { fetchActivity, fetchActivitySessions } from '../../../utils/comprehension/activityAPIs';
import { DropdownObjectInterface, ActivitySessionInterface, ActivitySessionsInterface, InputEvent } from '../../../interfaces/comprehensionInterfaces';
import { ALL, SCORED, UNSCORED, WEAK, COMPLETE, INCOMPLETE, activitySessionIndexResponseHeaders, activitySessionFilterOptions, SESSION_INDEX } from '../../../../../constants/comprehension';

const quillCheckmark = 'https://assets.quill.org/images/icons/check-circle-small.svg';

const SessionsIndex = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  const initialStartDateString = window.sessionStorage.getItem(`${SESSION_INDEX}startDate`) || '';
  const initialEndDateString = window.sessionStorage.getItem(`${SESSION_INDEX}endDate`) || '';
  const initialStartDate = initialStartDateString ? new Date(initialStartDateString) : null;
  const initialEndDate = initialEndDateString ? new Date(initialEndDateString) : null;

  const [showError, setShowError] = React.useState<boolean>(false);
  const [pageNumber, setPageNumber] = React.useState<DropdownObjectInterface>(null);
  const [pageDropdownOptions, setPageDropdownOptions] = React.useState<DropdownObjectInterface[]>(null);
  const [filterOption, setFilterOption] = React.useState<DropdownObjectInterface>(activitySessionFilterOptions[0]);
  const [turkSessionID, setTurkSessionID] = React.useState<string>(null);
  const [turkSessionIDForQuery, setTurkSessionIDForQuery] = React.useState<string>(null);
  const [rowData, setRowData] = React.useState<any[]>([]);
  const [sortInfo, setSortInfo] = React.useState<any>(null);
  const pageNumberForQuery = pageNumber && pageNumber.value ? pageNumber.value : 1;
  const [startDate, onStartDateChange] = React.useState<Date>(initialStartDate);
  const [startDateForQuery, setStartDate] = React.useState<string>(initialStartDateString);
  const [endDate, onEndDateChange] = React.useState<Date>(initialEndDate);
  const [endDateForQuery, setEndDate] = React.useState<string>(initialEndDateString);

  // cache activity data for updates
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache activity sessions data for updates
  const { data: sessionsData } = useQuery({
    queryKey: [`activity-${activityId}-sessions`, activityId, pageNumberForQuery, startDateForQuery, endDateForQuery, turkSessionIDForQuery],
    queryFn: fetchActivitySessions
  });

  React.useEffect(() => {
    sessionsData && !pageDropdownOptions && getPageDropdownOptions(sessionsData);
  }, [sessionsData]);

  React.useEffect(() => {
    if(sessionsData && sessionsData.activitySessions && sessionsData.activitySessions.activity_sessions && startDateForQuery) {
      const { activitySessions } = sessionsData;
      const { activity_sessions } = activitySessions;
      const rows = formatSessionsData(activity_sessions)
      setRowData(rows);
    }
  }, [sessionsData]);

  function handleSetTurkSessionID(e: InputEvent){ setTurkSessionID(e.target.value) };

  function handleFilterClick() {
    handlePageFilterClick({ startDate, endDate, turkSessionID, setStartDate, setEndDate, setShowError, setPageNumber, setTurkSessionIDForQuery, storageKey: SESSION_INDEX });
  }

  function getFilteredRows(filter: string, activitySessions: ActivitySessionInterface[]) {
    switch (filter) {
      case ALL:
        return activitySessions;
      case SCORED:
        return activitySessions.filter(row => row.scored_count > 0);
      case UNSCORED:
        return activitySessions.filter(row => row.scored_count === 0);
      case WEAK:
        return activitySessions.filter(row => row.weak_count > 0);
      case COMPLETE:
        return activitySessions.filter(row => row.complete);
      case INCOMPLETE:
        return activitySessions.filter(row => !row.complete);
      default:
        return activitySessions;
    }
  }

  function handleFilterOptionChange(option: DropdownObjectInterface, activitySessions: ActivitySessionInterface[]) {
    if(startDateForQuery) {
      const { value } = option;
      const formattedRows = formatSessionsData(activitySessions);
      const sortedRows = sortedSessions(formattedRows, sortInfo)
      const filteredRows = getFilteredRows(value, sortedRows);
      setFilterOption(option);
      setRowData(filteredRows);
    }
  }

  function handleDataUpdate(activity_sessions: ActivitySessionInterface[], state: { sorted: object[]}) {
    if(startDateForQuery)  {
      const { sorted } = state;
      const sortInfo = sorted[0];
      const rows = formatSessionsData(activity_sessions);
      const sortedRows = sortedSessions(rows, sortInfo)
      setRowData(sortedRows);
    }
  }

  function getPageDropdownOptions(sessionsData: { activitySessions: ActivitySessionsInterface }) {
    if(!sessionsData) {
      return null;
    }
    if(pageDropdownOptions) {
      return pageDropdownOptions;
    }
    const { activitySessions } = sessionsData
    const { current_page, total_pages } = activitySessions;
    setPageNumber({'value': current_page.toString(), 'label':`Page ${current_page}`})
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

  function sortedSessions(activitySessions: ActivitySessionInterface[], sortInfo?: any) {
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

  function formatSessionsData(activitySessions: ActivitySessionInterface[]) {
    return activitySessions.map(session => {
      const { start_date, session_uid, because_attempts, but_attempts, so_attempts, complete } = session;
      const dateObject = new Date(start_date);
      const date = moment(dateObject).format("MM/DD/YY");
      const time = moment(dateObject).format("hh:mm a");
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

  const { activitySessions } = sessionsData;
  const { total_activity_sessions, activity_sessions } = activitySessions;
  const metabaseLink = `https://data.quill.org/question/615?activity_id=${activityId}`

  return(
    <div className="sessions-index-container">
      {renderHeader(activityData, 'View Sessions')}
      <section>
        <p className="link-info-blurb">Use <a href={metabaseLink}><strong>this Metabase</strong></a> query to display feedback sessions on a single page.</p>
        <p className="link-info-blurb">If you want to look up an individual activity session, plug the activity session ID into this url and it will load: https://www.quill.org/cms/comprehension#/activities/<strong>activityID</strong>/<strong>sessionID</strong></p>
        <section className="top-section">
          <section className="total-container">
            <p className="total-label">Total</p>
            <p className="total-value">{total_activity_sessions}</p>
          </section>
          <DropdownInput
            className="page-number-dropdown"
            handleChange={handlePageChange}
            isSearchable={false}
            label=""
            options={pageDropdownOptions}
            value={pageNumber}
          />
        </section>
        <section className="top-section">
          <DropdownInput
            className="session-filters-dropdown"
            /* eslint-disable-next-line react/jsx-no-bind */
            handleChange={(option) => handleFilterOptionChange(option, activity_sessions)}
            isSearchable={false}
            label=""
            options={activitySessionFilterOptions}
            value={filterOption}
          />
          <p className="date-picker-label">Start Date:</p>
          <DateTimePicker
            ampm={false}
            format='y-MM-dd HH:mm'
            onChange={onStartDateChange}
            value={startDate}
          />
          <p className="date-picker-label">End Date (optional):</p>
          <DateTimePicker
            ampm={false}
            format='y-MM-dd HH:mm'
            onChange={onEndDateChange}
            value={endDate}
          />
          <p className="date-picker-label">Turk Session ID (optional):</p>
          <Input
            className="turk-session-id-input"
            handleChange={handleSetTurkSessionID}
            label=""
            value={turkSessionID}
          />
          <button className="quill-button fun primary contained" onClick={handleFilterClick} type="submit">Filter</button>
        </section>
        <div className="error-container">
          {showError && <p className="error-message">Start date is required.</p>}
        </div>
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
