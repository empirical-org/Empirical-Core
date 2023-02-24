import * as React from "react";
import stripHtml from "string-strip-html";
import { useQuery } from 'react-query';
;
import DateTimePicker from 'react-datetime-picker';

import { renderHeader } from '../../../helpers/evidence/renderHelpers';
import { sort } from '../../../../../modules/sortingMethods.js';
import { fetchChangeLogs, fetchActivity } from '../../../utils/evidence/activityAPIs';
import { DropdownInput, Spinner, ReactTable, uniqueValuesArray, } from '../../../../Shared/index';

const ChangeLog = ({ history, match }) => {
  const { params } = match;
  const { activityId, } = params;
  const initialStartDateString = '';
  const initialEndDateString = '';
  const initialStartDate = initialStartDateString ? new Date(initialStartDateString) : null;
  const initialEndDate = initialEndDateString ? new Date(initialEndDateString) : null;
  const DEFAULT_RULE = 'all'
  const DEFAULT_PROMPT = 'all'

  const [searchInput, setSearchInput] = React.useState<string>('');
  const [prompt, setPrompt] = React.useState<string>(DEFAULT_PROMPT);
  const [rule, setRule] = React.useState<string>(DEFAULT_RULE);
  const [startDate, onStartDateChange] = React.useState<Date>(initialStartDate);
  const [endDate, onEndDateChange] = React.useState<Date>(initialEndDate);

  const { data: changeLogData, status: status } = useQuery({
    queryKey: [`change-log-${activityId}`, activityId],
    queryFn: fetchChangeLogs
  });

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  function handleSearch(e) {
    setSearchInput(e.target.value)
  }

  function handlePromptChange(e) {
    setPrompt(e.target.value)
  }

  function handleRuleChange(e) {
    setRule(e.target.value)
  }

  const promptDropdown = (
    <div id="prompt-dropdown">
      <p className="control" >
        <span className="select">
          <select defaultValue={DEFAULT_PROMPT} onChange={handlePromptChange}>
            <option value={DEFAULT_PROMPT}>All Prompts</option>
            <option value="because">because</option>
            <option value="but">but</option>
            <option value="so">so</option>
          </select>
        </span>
      </p>
    </div>
  )

  const formattedRows = changeLogData && changeLogData.changeLogs && changeLogData.changeLogs.map(log => {
    const {
      full_action,
      changed_record_id,
      updated_local_time,
      previous_value,
      new_value,
      changed_record_display_name,
      user,
      conjunctions,
      changed_record_url,
      changed_attribute,
    } = log;

    return {
      action: full_action,
      previousValue: previous_value,
      newValue: new_value,
      author: user,
      dateTime: updated_local_time,
      actionLink: changed_record_url,
      conjunctions: uniqueValuesArray(conjunctions),
      name: changed_record_display_name ? changed_record_display_name.split('_').join(' ') : '',
      changedAttribute: changed_attribute
    }
  })

  const filteredRowsBySearch = formattedRows && formattedRows.filter(value => {
    return (value.action.toLowerCase().includes(searchInput.toLowerCase()) ||
    (value.previousValue && value.previousValue.toLowerCase().includes(searchInput.toLowerCase())) ||
    (value.newValue && value.newValue.toLowerCase().includes(searchInput.toLowerCase())))
  })

  const filteredRowsByPrompt = formattedRows && filteredRowsBySearch.filter(value => {
    return prompt === DEFAULT_PROMPT || (value.conjunctions && value.conjunctions.includes(prompt))
  })

  const filteredRowsByRule = formattedRows && filteredRowsByPrompt.filter(value => {
    return rule === DEFAULT_RULE || value.name === rule
  })

  const filteredRowsByDatePicker = formattedRows && filteredRowsByRule.filter(value => {
    if (startDate == null && endDate == null) return true
    if (startDate == null) return Date.parse(value.dateTime) <= Date.parse(endDate.toString())
    if (endDate == null) return Date.parse(startDate.toString()) <= Date.parse(value.dateTime)
    return Date.parse(startDate.toString()) <= Date.parse(value.dateTime) && Date.parse(value.dateTime) <= Date.parse(endDate.toString())
  })

  const filteredRows = formattedRows && filteredRowsByDatePicker

  const dataTableFields = [
    {
      Header: 'Date/Time',
      accessor: "dateTime",
      key: "dateTime",
      sortMethod: sort,
      width: 160,
      Cell: ({row}) => (new Date(row.original.dateTime).toLocaleString())
    },
    {
      Header: 'Action',
      accessor: "action",
      sortMethod: sort,
      width: 160,
      Cell: ({row}) => (<a href={row.original.actionLink} rel="noopener noreferrer" target="_blank">{row.original.action}</a>)
    },
    {
      Header: 'Rule/Model Name',
      accessor: "name",
      key: "name",
      sortMethod: sort,
      width: 251,
    },
    {
      Header: 'Prompt',
      accessor: "conjunctions",
      key: "conjunctions",
      sortMethod: sort,
      width: 100,
    },
    {
      Header: 'Changed Attribute',
      accessor: "changedAttribute",
      key: "changedAttribute",
      sortMethod: sort,
      width: 160,
    },
    {
      Header: 'Previous Value',
      accessor: "previousValue",
      key: "previousValue",
      sortMethod: sort,
      width: 200,
      Cell: ({row}) => row.original.previousValue ? (stripHtml(row.original.previousValue)) : ''
    },
    {
      Header: 'New Value',
      accessor: "newValue",
      key: "newValue",
      sortMethod: sort,
      width: 200,
      Cell: ({row}) => row.original.newValue ? (stripHtml(row.original.newValue)) : ''
    },
    {
      Header: 'Author',
      accessor: "author",
      key: "author",
      sortMethod: sort,
      width: 160,
    }
  ];

  if (status === 'loading' || !formattedRows || changeLogData.error || !activityData || activityData.error) {
    return <Spinner />
  }

  function ruleDropdown() {
    const rules = _.uniq(formattedRows.filter(a => a.name != null).map((a)=>a.name))
    const ruleOptions = rules.map((currentValue, i) => {
      return <option key={currentValue} value={currentValue}>{currentValue}</option>
    })
    return (
      <div id="rule-dropdown">
        <p className="control">
          <span className="select">
            <select defaultValue={DEFAULT_RULE} id='rule-dropdown-select' onChange={handleRuleChange}>
              <option value={DEFAULT_RULE}>All Rules</option>
              {ruleOptions}
            </select>
          </span>
        </p>
      </div>
    )
  }

  return(
    <div className="activity-stats-container">
      {renderHeader(activityData, 'Change Log')}
      <a href="https://docs.google.com/spreadsheets/u/2/d/1i1BpgGWSYh_UCm6jrYBjtFMoeBlcd6CeCGMqI037oPY/edit#gid=0" id="concept-uid-lookup" rel="noopener noreferrer" target="_blank">Concept UID Lookup</a>
      <div id="change-log-selectors">
        <div id="top-selectors">
          <div id="change-log-dropdowns">
            {promptDropdown}
            {ruleDropdown()}
          </div>
          <input
            aria-label="Search by action or value"
            className="search-box"
            id="action-search"
            name="searchInput"
            onChange={handleSearch}
            placeholder="Search by action or value"
            value={searchInput || ""}
          />
        </div>
        <div id="bottom-selectors">
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
        </div>
      </div>
      <br />
      {formattedRows && (<ReactTable
        className="change-log-table"
        columns={dataTableFields}
        data={filteredRows || []}
        defaultSorted={[{id: 'dateTime', desc: true}]}
      />)}
    </div>
  );

}

export default ChangeLog
