import * as React from "react";
import { useQuery } from 'react-query';
import { firstBy } from 'thenby';

import FilterWidget from "../shared/filterWidget";
import { getVersionOptions, handlePageFilterClick, activitySessionIndexResponseHeaders, colorCodeAttemptsCount, formatSessionsData } from "../../../helpers/evidence/miscHelpers";
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { Error, Spinner, DropdownInput, ReactTable, Tooltip, informationIcon } from '../../../../Shared/index';
import { fetchActivity, fetchActivitySessions, fetchActivityVersions, fetchActivitySessionsDataForCSV } from '../../../utils/evidence/activityAPIs';
import { DropdownObjectInterface, ActivitySessionInterface, ActivitySessionsInterface } from '../../../interfaces/evidenceInterfaces';
import { activitySessionFilterOptions, SESSION_INDEX } from '../../../../../constants/evidence';
import { renderCSVDownloadButton } from "../../../helpers/evidence/miscHelpers";

const SessionsIndex = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  const initialStartDateString = window.sessionStorage.getItem(`${SESSION_INDEX}startDate`) || '';
  const initialEndDateString = window.sessionStorage.getItem(`${SESSION_INDEX}endDate`) || '';
  const initialFilterOption = JSON.parse(window.sessionStorage.getItem(`${SESSION_INDEX}filterOption`)) || activitySessionFilterOptions[0];
  const initialVersionOption = JSON.parse(window.sessionStorage.getItem(`${SESSION_INDEX}versionOption`)) || null;
  const initialStartDate = initialStartDateString ? new Date(initialStartDateString) : null;
  const initialEndDate = initialEndDateString ? new Date(initialEndDateString) : null;

  const [pageNumber, setPageNumber] = React.useState<DropdownObjectInterface>(null);
  const [pageDropdownOptions, setPageDropdownOptions] = React.useState<DropdownObjectInterface[]>(null);
  const [versionOption, setVersionOption] = React.useState<DropdownObjectInterface>(initialVersionOption);
  const [versionOptions, setVersionOptions] = React.useState<DropdownObjectInterface[]>([]);
  const [filterOption, setFilterOption] = React.useState<DropdownObjectInterface>(initialFilterOption);
  const [filterOptionForQuery, setFilterOptionForQuery] = React.useState<DropdownObjectInterface>(initialFilterOption);
  const [rowData, setRowData] = React.useState<any[]>([]);
  const pageNumberForQuery = pageNumber && pageNumber.value ? pageNumber.value : 1;
  const [startDate, onStartDateChange] = React.useState<Date>(initialStartDate);
  const [startDateForQuery, setStartDate] = React.useState<string>(initialStartDateString);
  const [endDate, onEndDateChange] = React.useState<Date>(initialEndDate);
  const [endDateForQuery, setEndDate] = React.useState<string>(initialEndDateString);
  const [responsesForScoring, setResponsesForScoring] = React.useState<boolean>(false);
  const [responsesForScoringForQuery, setResponsesForScoringForQuery] = React.useState<boolean>(false);
  const [csvDataLoadInitiated, setCsvDataLoadInitiated] = React.useState<boolean>(false);

  // cache activity data for updates
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache activity sessions data for updates
  const { data: sessionsData } = useQuery({
    queryKey: [`activity-${activityId}-sessions`, activityId, pageNumberForQuery, startDateForQuery, filterOptionForQuery, endDateForQuery, responsesForScoringForQuery],
    queryFn: fetchActivitySessions
  });

  // cache activity sessions data for updates
  const { data: sessionsCSVData } = useQuery({
    queryKey: [`activity-${activityId}-sessions-csv-data`, activityId, startDateForQuery, filterOptionForQuery, endDateForQuery, responsesForScoringForQuery, csvDataLoadInitiated],
    queryFn: fetchActivitySessionsDataForCSV
  });

  const { data: activityVersionData } = useQuery({
    queryKey: [`change-logs-for-activity-versions-${activityId}`, activityId],
    queryFn: fetchActivityVersions
  });

  React.useEffect(() => {
    if(activityVersionData && activityVersionData.changeLogs && (!versionOption || !versionOptions.length)) {
      const options = getVersionOptions(activityVersionData);
      const defaultOption = options[0];
      !versionOption && setVersionOption(defaultOption);
      setVersionOptions(options);
      handleFilterClick(defaultOption);
    }
  }, [activityVersionData]);

  React.useEffect(() => {
    if(versionOption && versionOption.value) {
      const { value } = versionOption;
      const { start_date, end_date } = value;
      onStartDateChange(new Date(start_date))
      onEndDateChange(new Date(end_date))
    }
  }, [versionOption]);

  React.useEffect(() => {
    sessionsData && !pageDropdownOptions && getPageDropdownOptions(sessionsData);
  }, [sessionsData]);

  React.useEffect(() => {
    if(sessionsData && sessionsData.activitySessions && sessionsData.activitySessions.activity_sessions && startDateForQuery) {
      const { activitySessions } = sessionsData;
      const { activity_sessions } = activitySessions;
      const rows = formatSessionsData(activityId, activity_sessions);
      setRowData(rows);
    }
  }, [sessionsData]);

  function handleFilterClick(e: React.SyntheticEvent, passedVersionOption?: DropdownObjectInterface) {
    setCsvDataLoadInitiated(false);
    handlePageFilterClick({ startDate, endDate, filterOption, versionOption: passedVersionOption || versionOption, responsesForScoring, setStartDate, setEndDate, setPageNumber, setFilterOptionForQuery, setResponsesForScoringForQuery, storageKey: SESSION_INDEX });
  }

  function handleFilterOptionChange(filterOption: DropdownObjectInterface) {
    setFilterOption(filterOption);
  }

  function handleVersionSelection(versionOption: DropdownObjectInterface) {
    setVersionOption(versionOption);
  }

  function handleDataUpdate(activitySessions, sorted) {
    if(startDateForQuery)  {
      const sortInfo = sorted[0];
      const rows = formatSessionsData(activityId, activitySessions);
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

  function handleResponsesForScoringChange() {
    setResponsesForScoring(!responsesForScoring);
  }

  function handleLoadCSVDataClick() {
    setCsvDataLoadInitiated(true);
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
      const { id, desc } = sortInfo;
      // we have this reversed so that the first click will sort from highest to lowest by default
      const directionOfSort = desc ? `asc` : 'desc';
      const sorted = getSortedRows({ activitySessions, id, directionOfSort });
      return sorted;
    } else {
      return activitySessions;
    }
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
        <p className="link-info-blurb">If you want to look up an individual activity session, plug the activity session ID into this url and it will load: https://www.quill.org/cms/evidence#/activities/<strong>activityID</strong>/<strong>sessionID</strong></p>
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
        <section className="middle-section">
          <section className="response-filters-container">
            <DropdownInput
              className="session-filters-dropdown"
              handleChange={handleFilterOptionChange}
              isSearchable={true}
              label="Session filter options"
              options={activitySessionFilterOptions}
              value={filterOption}
            />
            <section className="responses-for-scoring-container">
              <section className="label-section">
                <label>Responses for Scoring</label>
                <Tooltip
                  tooltipText="6+ responses per session OR sessions with 2+ responses for each conjunction"
                  tooltipTriggerText={<img alt={informationIcon.alt} src={informationIcon.src} />}
                />
              </section>
              <input checked={responsesForScoring} onChange={handleResponsesForScoringChange} type="checkbox" />
            </section>
          </section>
          <section className="bottom-section">
            <FilterWidget
              endDate={endDate}
              handleFilterClick={handleFilterClick}
              handleVersionSelection={handleVersionSelection}
              onEndDateChange={onEndDateChange}
              onStartDateChange={onStartDateChange}
              selectedVersion={versionOption}
              startDate={startDate}
              versionOptions={versionOptions}
            />
            {renderCSVDownloadButton(csvDataLoadInitiated, handleLoadCSVDataClick, sessionsCSVData)}
          </section>
        </section>
        <ReactTable
          className="activity-sessions-table"
          columns={activitySessionIndexResponseHeaders}
          data={rowData}
          defaultPageSize={rowData.length < 100 ? rowData.length : 100}
          filterable
          manualSortBy
          /* eslint-disable-next-line react/jsx-no-bind */
          onSortedChange={(sorted) => handleDataUpdate(activity_sessions, sorted)}
        />
      </section>
    </div>
  );
}

export default SessionsIndex
