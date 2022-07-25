import * as React from "react";
import { useQueryClient, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { firstBy } from 'thenby';

import FilterWidget from "../shared/filterWidget";
import { fetchRule } from '../../../utils/evidence/ruleAPIs';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchRuleFeedbackHistoriesByRule } from '../../../utils/evidence/ruleFeedbackHistoryAPIs';
import { fetchConcepts, } from '../../../utils/evidence/conceptAPIs';
import { createOrUpdateFeedbackHistoryRating, massCreateOrUpdateFeedbackHistoryRating, } from '../../../utils/evidence/feedbackHistoryRatingAPIs';
import { InputEvent } from '../../../interfaces/evidenceInterfaces';
import { DataTable, Error, Spinner, Input, smallWhiteCheckIcon, ReactTable, } from '../../../../Shared/index';
import { handlePageFilterClick } from "../../../helpers/evidence/miscHelpers";
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { ALL, SCORED, UNSCORED, STRONG, WEAK, RULE_ANALYSIS, RULES_ANALYSIS, LOW_CONFIDENCE } from '../../../../../constants/evidence';

const responseHeaders = (isLowConfidenceRule) => {
  const highlightedOutput = {
    Header: "Highlighted Output",
    accessor: "highlight",
    maxWidth: 280
  }
  const confidenceAttributes = [
    {
      Header: "Low Confidence Label Prediction",
      accessor: "lowConfidenceLabelPrediction",
      maxWidth: 200
    },
    {
      Header: "Confidence Value",
      accessor: "originalRuleConfidence",
      maxWidth: 80
    }
  ]
  const highlightedOutputOrConfidenceAttributes = isLowConfidenceRule ? confidenceAttributes : highlightedOutput
  return [
    {
      Header: '',
      accessor: "selected",
      maxWidth: 50
    },
    {
      Header: "Time",
      accessor: "datetime",
      maxWidth: 100
    },
    {
      Header: prompt && prompt.text ? <b className="prompt-text" dangerouslySetInnerHTML={{ __html: prompt.text.replace(prompt.conjunction, `<span>${prompt.conjunction}</span>`)}} /> : '',
      accessor: "response",
      width: 700,
      sortType: (a, b) => (a.original.key.localeCompare(b.original.key))
    },
    highlightedOutputOrConfidenceAttributes,
    {
      Header: "",
      accessor: "strengthButtons",
      maxWidth: 150
    },
    {
      Header: "",
      accessor: "viewSessionLink",
      maxWidth: 80
    }
  ].flat()
}

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

  const queryClient = useQueryClient()

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
  }, [ruleFeedbackHistoryData, activityData])

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
        return new RegExp(search, 'i').test(r.entry) || new RegExp(search, 'i').test(r.api?.original_rule_name)
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
      queryClient.refetchQueries([`rule-feedback-histories-by-rule-${ruleId}-${promptId}`, ruleId, promptId, startDateForQuery, endDateForQuery]);
    });
  }

  async function toggleStrength(response) { updateFeedbackHistoryRatingStrength(response.response_id, response.strength === true ? null : true) }

  async function toggleWeakness(response) { updateFeedbackHistoryRatingStrength(response.response_id, response.strength === false ? null : false) }

  async function updateFeedbackHistoryRatingStrength(responseId, rating) {
    createOrUpdateFeedbackHistoryRating({ rating, feedback_history_id: responseId}).then((response) => {
      queryClient.refetchQueries([`rule-feedback-histories-by-rule-${ruleId}-${promptId}`, ruleId, promptId, startDateForQuery, endDateForQuery]);
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

  function handleDataUpdate(sorted) {
    const sortInfo = sorted[0];
    if (!sortInfo) { return }

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

      formattedResponse.originalRuleConfidence = Math.round(r.api.confidence * 100) / 100
      formattedResponse.lowConfidenceLabelPrediction = <Link className="data-link" rel="noopener noreferrer" target="_blank" to={`/activities/${activityId}/rules-analysis/${promptConjunction}/rule/${r.api.original_rule_uid}/prompt/${promptId}`}>{r.api.original_rule_name}</Link>
      formattedResponse.response = r.entry
      formattedResponse.datetime = moment(r.datetime).format('MM/DD/YYYY')
      formattedResponse.strengthButtons = (<div className="strength-buttons">{strongButton}{weakButton}</div>)
      formattedResponse.viewSessionLink = <Link className="data-link" rel="noopener noreferrer" target="_blank" to={`/activities/${activityId}/activity-sessions/${r.session_uid}/overview`}>View Session</Link>

      return formattedResponse
    })
  }

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

  const isLowConfidenceRule = ruleData.rule.rule_type === LOW_CONFIDENCE

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
      <FilterWidget
        endDate={endDate}
        handleFilterClick={handleFilterClick}
        handleSetTurkSessionID={handleSetTurkSessionID}
        onEndDateChange={onEndDateChange}
        onStartDateChange={onStartDateChange}
        showError={showError}
        startDate={startDate}
        turkSessionID={turkSessionID}
      />
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
      {isLowConfidenceRule ? <p>To filter to one predicted label, search by the label name in the search box.</p> : ''}
      <ReactTable
        className="responses-table"
        columns={responseHeaders(isLowConfidenceRule)}
        data={responses}
        defaultPageSize={Math.min(responses.length, 100) || 100}
        manualSortBy
        onSortedChange={handleDataUpdate}
      />
    </div>
  );
}

export default RuleAnalysis
