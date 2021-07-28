import * as React from "react";
import { queryCache, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactTable from 'react-table';
import { firstBy } from 'thenby';
import DateTimePicker from 'react-datetime-picker';

import { fetchRule } from '../../../utils/comprehension/ruleAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { fetchRuleFeedbackHistoriesByRule } from '../../../utils/comprehension/ruleFeedbackHistoryAPIs';
import { fetchConcepts, } from '../../../utils/comprehension/conceptAPIs';
import { createOrUpdateFeedbackHistoryRating, massCreateOrUpdateFeedbackHistoryRating, } from '../../../utils/comprehension/feedbackHistoryRatingAPIs';
import { InputEvent } from '../../../interfaces/comprehensionInterfaces';
import { DataTable, Error, Spinner, Input, smallWhiteCheckIcon, } from '../../../../Shared/index';
import { handlePageFilterClick, renderHeader } from "../../../helpers/comprehension";
import { ALL, SCORED, UNSCORED, STRONG, WEAK, RULE_ANALYSIS, RULES_ANALYSIS } from '../../../../../constants/comprehension';

const extractHighlight = (highlightObject) => {
  if (!highlightObject || !highlightObject.length || !highlightObject[0].text) return '';
  return highlightObject[0].text;
}

const RuleAnalysis = ({ match }) => {
  const { params } = match;
  const { activityId, ruleId, promptConjunction, promptId } = params;

  const initialStartDateString = window.sessionStorage.getItem(`${RULES_ANALYSIS}startDate`) || window.sessionStorage.getItem(`${RULE_ANALYSIS}startDate`) || '';
  const initialEndDateString = window.sessionStorage.getItem(`${RULES_ANALYSIS}endDate`) || window.sessionStorage.getItem(`${RULE_ANALYSIS}endDate`) || '';
  const initialTurkSessionId = window.sessionStorage.getItem(`${RULES_ANALYSIS}turkSessionId`) || '';
  const initialStartDate = initialStartDateString ? new Date(initialStartDateString) : null;
  const initialEndDate = initialEndDateString ? new Date(initialEndDateString) : null;

  const [showError, setShowError] = React.useState<boolean>(false);
  const [responses, setResponses] = React.useState(null);
  const [filter, setFilter] = React.useState(ALL);
  const [search, setSearch] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState([]);
  const [startDate, onStartDateChange] = React.useState<Date>(initialStartDate);
  const [startDateForQuery, setStartDate] = React.useState<string>(initialStartDateString);
  const [endDate, onEndDateChange] = React.useState<Date>(initialEndDate);
  const [endDateForQuery, setEndDate] = React.useState<string>(initialEndDateString);
  const [turkSessionID, setTurkSessionID] = React.useState<string>(initialTurkSessionId);
  const [turkSessionIDForQuery, setTurkSessionIDForQuery] = React.useState<string>(initialTurkSessionId);

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const { data: conceptsData } = useQuery({
    queryKey: ['concepts', ruleId],
    queryFn: fetchConcepts
  });

  const { data: ruleData } = useQuery({
    queryKey: [`rule-${ruleId}`, ruleId],
    queryFn: fetchRule
  });

  const { data: ruleFeedbackHistoryData } = useQuery({
    queryKey: [`rule-feedback-histories-by-rule-${ruleId}-${promptId}`, ruleId, promptId, startDateForQuery, endDateForQuery, turkSessionIDForQuery],
    queryFn: fetchRuleFeedbackHistoriesByRule
  })

  const prompt: any = activityData ? activityData.activity.prompts.find(prompt => prompt.conjunction === promptConjunction) : {}

  React.useEffect(() => {
    if (!ruleFeedbackHistoryData) { return }
    if(!startDateForQuery) {
      // intially render empty table when no start date is specified
      setResponses([]);
    } else {
      const rows = responseRows(ruleFeedbackHistoryData.responses);
      setResponses(rows)
    }
  }, [ruleFeedbackHistoryData])

  React.useEffect(() => {
    if(ruleFeedbackHistoryData) {
      const rows = responseRows(ruleFeedbackHistoryData.responses);
      setResponses(rows)
    }
  }, [filter, search, selectedIds])

  function handleSetTurkSessionID(e: InputEvent){ setTurkSessionID(e.target.value) };

  function handleFilterClick() {
    handlePageFilterClick({ startDate, endDate, turkSessionID, setStartDate, setEndDate, setShowError, setTurkSessionIDForQuery, setPageNumber: null, storageKey: RULE_ANALYSIS });
  }

  function handleFilterChange(e) { setFilter(e.target.value) }

  function onSearchChange(e) { setSearch(e.target.value) }

  function filterResponsesByScored(r) {
    if (filter === ALL) { return true }
    if (filter === SCORED && r.strength !== null) { return true }
    if (filter === UNSCORED && r.strength === null) { return true }
    if (filter === STRONG && r.strength === true) { return true }
    if (filter === WEAK && r.strength === false) { return true }

    return false
  }

  function filterResponsesBySearch(r) {
    if (search.length) {
      try {
        return new RegExp(search, 'i').test(r.entry)
      } catch (e) {
        return false
      }
    }

    return true
  }

  function selectRow(id) { setSelectedIds(selectedIds.concat(id)) }

  function unselectRow(id) { setSelectedIds(selectedIds.filter(item => item !== id)) }

  async function massMarkStrong() { massMark(true)}

  async function massMarkWeak() { massMark(false)}

  async function massUnmark() { massMark(null)}

  async function massMark(rating) {
    setSelectedIds([])
    massCreateOrUpdateFeedbackHistoryRating({ rating, feedback_history_ids: selectedIds}).then((response) => {
      queryCache.refetchQueries([`rule-feedback-histories-by-rule-${ruleId}-${promptId}`, ruleId, promptId, startDateForQuery, endDateForQuery]);
    });
  }

   async function toggleStrength(response) { updateFeedbackHistoryRatingStrength(response.response_id, response.strength === true ? null : true) }

   async function toggleWeakness(response) { updateFeedbackHistoryRatingStrength(response.response_id, response.strength === false ? null : false) }

   async function updateFeedbackHistoryRatingStrength(responseId, rating) {
     createOrUpdateFeedbackHistoryRating({ rating, feedback_history_id: responseId}).then((response) => {
       queryCache.refetchQueries([`rule-feedback-histories-by-rule-${ruleId}-${promptId}`, ruleId, promptId, startDateForQuery, endDateForQuery]);
     });
   }

  function getSortedRows(rows, sortInfo) {
    if(sortInfo) {
      const { id, desc } = sortInfo;
      // we have this reversed so that the first click will sort from highest to lowest by default
      const directionOfSort = desc ? `asc` : 'desc';
      return rows.sort(firstBy(id, { direction: directionOfSort }));
    } else {
      return rows;
    }
  }

  function handleDataUpdate(state) {
    const { sorted } = state;
    const sortInfo = sorted[0];
    const rows = responseRows(responses);
    const sortedRows = getSortedRows(rows, sortInfo)
    setResponses(sortedRows);
  }

  const ruleRows = ({ rule }) => {
    if(!rule) {
      return [];
    } else {
      // format for DataTable to display labels on left side and values on right
      const { note, feedbacks, name, rule_type, concept_uid, } = rule;

      const selectedConcept = conceptsData.concepts.find(c => c.uid === concept_uid);
      const selectedConceptNameArray = selectedConcept ? selectedConcept.name.split(' | ') : []

      const fields = [
        {
          label: 'API Name',
          value: rule_type
        },
        {
          label: 'Name',
          value: name
        },
        {
          label: 'Rule Note',
          value: note ? <div dangerouslySetInnerHTML={{ __html: note }} /> : ''
        },
        {
          label: 'Concept - Level 0',
          value: selectedConceptNameArray[2]
        },
        {
          label: 'Concept - Level 1',
          value: selectedConceptNameArray[1]
        },
        {
          label: 'Concept - Level 2',
          value: selectedConceptNameArray[0]
        },
        {
          label: 'Feedback - 1st Attempt',
          value: feedbacks[0] ? <div dangerouslySetInnerHTML={{ __html: feedbacks[0].text }} /> : null
        },
        {
          label: 'Feedback - 2nd Attempt',
          value: feedbacks[1] ? <div dangerouslySetInnerHTML={{ __html: feedbacks[1].text }} /> : null
        },
        {
          label: 'Responses',
          value: ruleFeedbackHistoryData && ruleFeedbackHistoryData.responses ? ruleFeedbackHistoryData.responses.length : 0
        }
      ];
      return fields.map((field, i) => {
        const { label, value } = field
        return {
          id: `${label}-${i}`,
          field: label,
          value
        }
      });
    }
  }

  // The header labels felt redundant so passing empty strings and hiding header display
  const ruleHeaders = [
    { name: "", attribute:"field", width: "180px" },
    { name: "", attribute:"value", width: "750px" }
  ];

  /* eslint-disable react/jsx-no-bind */
  const responseRows = (responsesData) => {
    if (!activityData || !responsesData) { return [] }
    return responsesData.filter(filterResponsesByScored).filter(filterResponsesBySearch).map(r => {
      const formattedResponse = {...r,  ...{highlight: extractHighlight(r.highlight)}}
      const strongButton = <button className={r.strength === true ? 'strength-button strong' : 'strength-button'} onClick={() => toggleStrength(r)} tabIndex={-1} type="button">Strong</button> // curriculum developers want to be able to skip these when tab navigating
      const weakButton = <button className={r.strength === false ? 'strength-button weak' : 'strength-button'} onClick={() => toggleWeakness(r)} tabIndex={-1} type="button">Weak</button> // curriculum developers want to be able to skip these when tab navigating

      if (selectedIds.includes(r.response_id)) {
        formattedResponse.selected = (<button className="quill-checkbox selected" onClick={() => unselectRow(r.response_id)} type="button">
          <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
        </button>)
      } else {
        formattedResponse.selected = <button aria-label="Unchecked checkbox" className="quill-checkbox unselected" onClick={() => selectRow(r.response_id)} type="button" />
      }

      formattedResponse.response = r.entry
      formattedResponse.datetime = moment(r.datetime).format('MM/DD/YYYY')
      formattedResponse.strengthButtons = (<div className="strength-buttons">{strongButton}{weakButton}</div>)
      formattedResponse.viewSessionLink = <Link className="data-link" rel="noopener noreferrer" target="_blank" to={`/activities/${activityId}/activity-sessions/${r.session_uid}/overview`}>View Session</Link>

      return formattedResponse
    })
  }

  const responseHeaders = [
    {
      Header: '',
      accessor: "selected",
      width: 50
    },
    {
      Header: "Time",
      accessor: "datetime",
      width: 100
    },
    {
      Header: prompt && prompt.text ? <b className="prompt-text" dangerouslySetInnerHTML={{ __html: prompt.text.replace(prompt.conjunction, `<span>${prompt.conjunction}</span>`)}} /> : '',
      accessor: "response",
      width: 600,
      sortMethod: (a, b) => (a.key.localeCompare(b.key))
    },
    {
      Header: "Highlighted Output",
      accessor: "highlight",
      width: 100
    },
    {
      Header: "",
      accessor: "strengthButtons",
      width: 300
    },
    {
      Header: "",
      accessor: "viewSessionLink",
      width: 100
    }
  ]

  if(!ruleData || !activityData || !responses || !conceptsData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    )
  }

  if(ruleData.error) {
    return(
      <div className="error-container">
        <Error error={`${ruleData.error}`} />
      </div>
    );
  }

  const massMarkButtonDisabled = !selectedIds.length
  const massMarkButtonClassName = massMarkButtonDisabled ? "quill-button secondary fun outlined disabled" : "quill-button secondary fun outlined"

  return(
    <div className="rule-analysis-container">
      {renderHeader(activityData, `Rule: ${ruleData.rule.name}`)}
      <DataTable
        className="rule-table"
        headers={ruleHeaders}
        rows={ruleRows(ruleData)}
      />
      <div className="button-wrapper">
        <Link className="quill-button medium contained primary" to={`/activities/${activityId}/rules/${ruleData.rule.id}`}>Edit Rule Notes/Properties</Link>
        <Link className="quill-button medium secondary outlined" rel="noopener noreferrer" target="_blank" to={`/activities/${activityId}/semantic-labels/${prompt.id}/semantic-rules-cheat-sheet`} >Semantic Rules Cheat Sheet</Link>
      </div>
      <div className="date-selection-container">
        <p className="date-picker-label">Start Date:</p>
        <DateTimePicker
          ampm={false}
          className="start-date-picker"
          format='y-MM-dd HH:mm'
          onChange={onStartDateChange}
          value={startDate}
        />
        <p className="date-picker-label">End Date (optional):</p>
        <DateTimePicker
          ampm={false}
          className="end-date-picker"
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
        {showError && <p className="error-message rule-analysis">Start date is required.</p>}
      </div>
      <div className="radio-options">
        <div className="radio">
          <label id={ALL}>
            <input aria-labelledby={ALL} checked={filter === ALL} onChange={handleFilterChange} type="radio" value={ALL} />
            Show all responses
          </label>
        </div>
        <div className="radio">
          <label id={SCORED}>
            <input aria-labelledby={SCORED} checked={filter === SCORED} onChange={handleFilterChange} type="radio" value={SCORED} />
            Show only scored responses
          </label>
        </div>
        <div className="radio">
          <label id={UNSCORED}>
            <input aria-labelledby={UNSCORED} checked={filter === UNSCORED} onChange={handleFilterChange} type="radio" value={UNSCORED} />
            Show only unscored responses
          </label>
        </div>
        <div className="radio">
          <label id={STRONG}>
            <input aria-labelledby={STRONG} checked={filter === STRONG} onChange={handleFilterChange} type="radio" value={STRONG} />
            Show only strong responses
          </label>
        </div>
        <div className="radio">
          <label id={WEAK}>
            <input aria-labelledby={WEAK} checked={filter === WEAK} onChange={handleFilterChange} type="radio" value={WEAK} />
            Show only weak responses
          </label>
        </div>
      </div>
      <div className="button-wrapper">
        <button className={massMarkButtonClassName} disabled={massMarkButtonDisabled} onClick={massMarkStrong} type="button">Mark All Selected As Strong</button>
        <button className={massMarkButtonClassName} disabled={massMarkButtonDisabled} onClick={massMarkWeak} type="button">Mark All Selected As Weak</button>
        <button className={massMarkButtonClassName} disabled={massMarkButtonDisabled} onClick={massUnmark} type="button">Unmark All Selected</button>
      </div>
      <Input
        handleChange={onSearchChange}
        label='Search by text or regex'
        type='text'
        value={search}
      />
      <ReactTable
        className="responses-table"
        columns={responseHeaders}
        data={responses}
        defaultPageSize={responses.length < 100 ? responses.length : 100}
        manual
        onFetchData={(state) => handleDataUpdate(state)}
        showPagination={true}
      />
    </div>
  );
}

export default RuleAnalysis
