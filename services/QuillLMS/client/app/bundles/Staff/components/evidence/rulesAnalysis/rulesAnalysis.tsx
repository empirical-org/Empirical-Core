import * as React from "react";
import { RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-query';
import { firstBy } from "thenby";
import ReactTable from 'react-table';
import qs from 'qs';
import _ from 'lodash';
import DateTimePicker from 'react-datetime-picker';

import { handlePageFilterClick, renderHeader } from "../../../helpers/evidence";
import { calculatePercentageForResponses } from "../../../helpers/evidence/ruleHelpers";
import { ActivityRouteProps, PromptInterface, InputEvent } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchRuleFeedbackHistories } from '../../../utils/evidence/ruleFeedbackHistoryAPIs';
import { DropdownInput, Input, Spinner } from '../../../../Shared/index';
import { RULES_ANALYSIS } from '../../../../../constants/evidence';

const DEFAULT_RULE_TYPE = 'All Rules'

interface PromptOption extends PromptInterface {
  value?: number;
  label?: string;
}

const apiOrderLookup = {
  'rules-based-1': 1,
  'opinion': 2,
  'plagiarism': 3,
  'autoML': 4,
  'rules-based-2': 5,
  'grammar': 6,
  'spelling': 7,
  'rules-based-3': 8,
}

function strongTextClassName(percentage) {
  if (percentage >= 90) { return 'green' }
  if (percentage >= 60) { return 'orange' }
  return 'red'
}

function weakTextClassName(percentage) {
  if (percentage <= 10) { return 'green' }
  if (percentage <= 40) { return 'orange' }
  return 'red'
}

const MoreInfo = (row) => {
  return (<div className="more-info">
    <p><strong>Rule Note:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.note || "N/A" }} /></p>
    <p><strong>First Layer Feedback:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.firstLayerFeedback || "N/A" }} /></p>
    <p><strong>Second Layer Feedback:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.secondLayerFeedback || "N/A" }} /></p>
  </div>)
}

const RulesAnalysis: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ history, match }) => {
  const { params } = match;
  const { activityId, promptConjunction, } = params;

  const ruleTypeValues = [DEFAULT_RULE_TYPE].concat(Object.keys(apiOrderLookup))
  const ruleTypeOptions = ruleTypeValues.map(val => ({ label: val, value: val, }))
  const ruleTypeFromUrl = (history.location && qs.parse(history.location.search.replace('?', '')).selected_rule_type) || DEFAULT_RULE_TYPE
  const initialStartDateString = window.sessionStorage.getItem(`${RULES_ANALYSIS}startDate`) || '';
  const initialEndDateString = window.sessionStorage.getItem(`${RULES_ANALYSIS}endDate`) || '';
  const initialTurkSessionId = window.sessionStorage.getItem(`${RULES_ANALYSIS}turkSessionId`) || '';
  const initialStartDate = initialStartDateString ? new Date(initialStartDateString) : null;
  const initialEndDate = initialEndDateString ? new Date(initialEndDateString) : null;

  const selectedRuleTypeOption = ruleTypeOptions.find(opt => opt.value === ruleTypeFromUrl)

  const [showError, setShowError] = React.useState<boolean>(false);
  const [selectedPrompt, setSelectedPrompt] = React.useState(null)
  const [selectedRuleType, setSelectedRuleType] = React.useState(selectedRuleTypeOption)
  const [sorted, setSorted] = React.useState([])
  const [startDate, onStartDateChange] = React.useState<Date>(initialStartDate);
  const [startDateForQuery, setStartDate] = React.useState<string>(initialStartDateString);
  const [endDate, onEndDateChange] = React.useState<Date>(initialEndDate);
  const [endDateForQuery, setEndDate] = React.useState<string>(initialEndDateString);
  const [totalResponsesByConjunction, setTotalResponsesByConjunction] = React.useState<number>(null);
  const [turkSessionID, setTurkSessionID] = React.useState<string>(initialTurkSessionId);
  const [turkSessionIDForQuery, setTurkSessionIDForQuery] = React.useState<string>(initialTurkSessionId);
  const [formattedRows, setFormattedRows] = React.useState<any[]>(null);

  const selectedConjunction = selectedPrompt ? selectedPrompt.conjunction : promptConjunction
  // cache rules data for updates
  const { data: ruleFeedbackHistory } = useQuery({
    queryKey: [`rule-feedback-history-by-conjunction-${selectedConjunction}-and-activity-${activityId}`, activityId, selectedConjunction, startDateForQuery, endDateForQuery, turkSessionIDForQuery],
    queryFn: fetchRuleFeedbackHistories
  });

  const { data: dataForTotalResponseCount } = useQuery({
    queryKey: [`rule-feedback-history-for-total-response-count`, activityId, selectedConjunction, startDateForQuery, endDateForQuery, turkSessionIDForQuery],
    queryFn: fetchRuleFeedbackHistories
  });

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  React.useEffect(() => {
    if (selectedPrompt) { return }

    setPromptBasedOnActivity()
  }, [activityData])

  React.useEffect(() => {
    setPromptBasedOnActivity()
  }, [promptConjunction])

  React.useEffect(() => {
    if (!selectedPrompt && !selectedRuleType || !activityData) { return }
    let url = `/activities/${activityId}/rules-analysis`
    if (selectedPrompt) {
      url += `/${selectedPrompt.conjunction}`
    }

    if (selectedRuleType) {
      url += `?selected_rule_type=${selectedRuleType.value}`
    }

    history.push(url)
  }, [selectedPrompt, selectedRuleType])

  React.useEffect(() => {
    if(!totalResponsesByConjunction && dataForTotalResponseCount && dataForTotalResponseCount.ruleFeedbackHistories) {
      let count = 0;
      const { ruleFeedbackHistories } = dataForTotalResponseCount;
      ruleFeedbackHistories.map(feedbackHistory => {
        if(feedbackHistory.total_responses) {
          count += feedbackHistory.total_responses;
        }
      });
      count = count * 1.0;
      setTotalResponsesByConjunction(count);
    }
  });

  React.useEffect(() => {
    if(selectedPrompt && ruleFeedbackHistory && ruleFeedbackHistory.ruleFeedbackHistories && ruleFeedbackHistory.ruleFeedbackHistories) {
      const formattedRows = ruleFeedbackHistory.ruleFeedbackHistories.filter(rule => {
        return selectedRuleType.value === DEFAULT_RULE_TYPE || rule.api_name === selectedRuleType.value
      }).map(rule => {
        const { rule_name, rule_uid, api_name, rule_order, note, total_responses, strong_responses, weak_responses, first_feedback, second_feedback, repeated_consecutive_responses, repeated_non_consecutive_responses } = rule;
        const apiOrder = apiOrderLookup[api_name] || Object.keys(apiOrderLookup).length
        return {
          rule_uid,
          className: apiOrder % 2 === 0 ? 'even' : 'odd',
          apiOrder,
          apiName: api_name,
          ruleOrder: Number(rule_order),
          rule: rule_name,
          strongResponses: strong_responses,
          weakResponses: weak_responses,
          repeatedConsecutiveResponses: repeated_consecutive_responses,
          repeatedNonConsecutiveResponses: repeated_non_consecutive_responses,
          totalResponses: total_responses,
          scoredResponses: strong_responses + weak_responses,
          activityId,
          note,
          firstLayerFeedback: first_feedback,
          secondLayerFeedback: second_feedback,
          handleClick: () => window.open(`/cms/comprehension#/activities/${activityId}/rules-analysis/${selectedPrompt.conjunction}/rule/${rule_uid}/prompt/${selectedPrompt.id}`, '_blank')
        }
      }).sort(firstBy('apiOrder').thenBy('ruleOrder'));
      setFormattedRows(formattedRows);
    }
  }, [ruleFeedbackHistory])

  function handleSetTurkSessionID(e: InputEvent){ setTurkSessionID(e.target.value) };

  function handleFilterClick() {
    handlePageFilterClick({ startDate, endDate, turkSessionID, setStartDate, setEndDate, setShowError, setTurkSessionIDForQuery, setPageNumber: null, storageKey: RULES_ANALYSIS });
  }

  function setPromptBasedOnActivity() {
    if (!activityData || !promptConjunction) { return }

    const prompt = activityData.activity.prompts.find(prompt => prompt.conjunction === promptConjunction)
    setSelectedPrompt(prompt)
  }

  function renderDataSection() {
    if(selectedPrompt && formattedRows) {
      return(
        <ReactTable
          className="rules-analysis-table"
          columns={dataTableFields}
          data={formattedRows ? formattedRows : []}
          defaultPageSize={formattedRows.length}
          freezeWhenExpanded={true}
          onSortedChange={setSorted}
          pivotBy={["apiName"]}
          showPagination={false}
          sorted={sorted}
          SubComponent={MoreInfo}
        />
      );
    } else if(!ruleFeedbackHistory && startDateForQuery && selectedPrompt) {
      return(
        <div className="loading-spinner-container">
          <Spinner />
        </div>
      )
    }
  }

  /* eslint-disable react/display-name */
  const dataTableFields = [
    {
      expander: true,
      Header: () => '',
      width: 65,
      Expander: ({ isExpanded, ...data }) =>
        (<div className={`${data.original.className} expand-cell`}>+</div>),
    },
    {
      Header: "API Name",
      accessor: "apiName",
      key: "apiName",
      width: 280,
      sortMethod: (a, b) => apiOrderLookup[b] - apiOrderLookup[a],
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.apiName}</button>),
    },
    {
      Header: "Rule Order",
      accessor: "ruleOrder",
      key: "ruleOrder",
      width: 50,
      aggregate: vals => '',
      Aggregated: (row) => (<span />),
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.ruleOrder}</button>),
    },
    {
      Header: "Rule",
      accessor: "rule",
      key: "rule",
      minWidth: 300,
      aggregate: vals => '',
      Aggregated: (row) => (<span />),
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.rule}</button>),
    },
    {
      Header: "Total Responses",
      accessor: "totalResponses",
      key: "totalResponses",
      width: 100,
      aggregate: (values) => {
        const totalResponses = _.sum(values);
        const percentageOutOfAllResponses = calculatePercentageForResponses(totalResponses, totalResponsesByConjunction);
        return { totalResponses, percentageOutOfAllResponses }
      },
      Aggregated: (row) => (<span>{row.value.percentageOutOfAllResponses}% <span className="gray">({row.value.totalResponses})</span></span>),
      Cell: (data) => {
        const { original } = data;
        const { className, handleClick, totalResponses } = original;
        const percentageOutOfAllResponses = calculatePercentageForResponses(totalResponses, totalResponsesByConjunction);
        return (<button className={className} onClick={handleClick} type="button">{percentageOutOfAllResponses}% <span className="gray">({totalResponses})</span></button>)
      },
    },
    {
      Header: "Rule Repeated: Consecutive",
      accessor: "repeatedConsecutiveResponses",
      key: "repeatedConsecutiveResponses",
      width: 125,
      sortMethod: (a, b) => b.percentageTotalRepeatedConsecutiveResponses - a.percentageTotalRepeatedConsecutiveResponses,
      aggregate: (values, rows) => {
        const totalRepeatedConsecutiveResponses = _.sum(values)
        const totalTotalResponses = _.sum(rows.map(r => r.totalResponses)) || 1
        const percentageTotalRepeatedConsecutiveResponses = _.round((totalRepeatedConsecutiveResponses/totalTotalResponses) * 100, 1)
        return { totalRepeatedConsecutiveResponses, percentageTotalRepeatedConsecutiveResponses, }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalRepeatedConsecutiveResponses}% ({row.value.totalRepeatedConsecutiveResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, repeatedConsecutiveResponses, totalResponses, } = data.original
        const percentageOfRepeatedConsecutiveResponses = _.round((repeatedConsecutiveResponses/(totalResponses || 1)) * 100, 1)
        return (<button className={className} onClick={handleClick} type="button">{percentageOfRepeatedConsecutiveResponses}% ({repeatedConsecutiveResponses})</button>)
      },
    },
    {
      Header: "Rule Repeated: Non-Consecutive",
      accessor: "repeatedNonConsecutiveResponses",
      key: "repeatedNonConsecutiveResponses",
      width: 125,
      sortMethod: (a, b) => b.percentageTotalRepeatedNonConsecutiveResponses - a.percentageTotalRepeatedNonConsecutiveResponses,
      aggregate: (values, rows) => {
        const totalRepeatedNonConsecutiveResponses = _.sum(values)
        const totalTotalResponses = _.sum(rows.map(r => r.totalResponses)) || 1
        const percentageTotalRepeatedNonConsecutiveResponses = _.round((totalRepeatedNonConsecutiveResponses/totalTotalResponses) * 100, 1)
        return { totalRepeatedNonConsecutiveResponses, percentageTotalRepeatedNonConsecutiveResponses, }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalRepeatedNonConsecutiveResponses}% ({row.value.totalRepeatedNonConsecutiveResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, repeatedNonConsecutiveResponses, totalResponses, } = data.original
        const percentageOfRepeatedNonConsecutiveResponses = _.round((repeatedNonConsecutiveResponses/(totalResponses || 1)) * 100, 1)
        return (<button className={className} onClick={handleClick} type="button">{percentageOfRepeatedNonConsecutiveResponses}% ({repeatedNonConsecutiveResponses})</button>)
      },
    },
    {
      Header: "Scored Responses",
      accessor: "scoredResponses",
      key: "scoredResponses",
      width: 150,
      sortMethod: (a, b) => b.percentageTotalScoredResponses - a.percentageTotalScoredResponses,
      aggregate: (values, rows) => {
        const totalScoredResponses = _.sum(values)
        const totalTotalResponses = _.sum(rows.map(r => r.totalResponses)) || 1
        const percentageTotalScoredResponses = _.round((totalScoredResponses/totalTotalResponses) * 100, 1)
        return { totalScoredResponses, percentageTotalScoredResponses, }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalScoredResponses}% ({row.value.totalScoredResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, scoredResponses, totalResponses, } = data.original
        const percentageOfScoredResponses = _.round((scoredResponses/(totalResponses || 1)) * 100, 1)
        return (<button className={className} onClick={handleClick} type="button">{percentageOfScoredResponses}% ({scoredResponses})</button>)
      },
    },
    {
      Header: "% Strong",
      accessor: "strongResponses",
      key: "strongResponses",
      width: 100,
      sortMethod: (a, b) => b.percentageTotalStrongResponses - a.percentageTotalStrongResponses,
      aggregate: (values, rows) => {
        const totalStrongResponses = _.sum(values)
        const totalScoredResponses = _.sum(rows.map(r => r.scoredResponses)) || 1
        const percentageTotalStrongResponses = _.round((totalStrongResponses/totalScoredResponses) * 100, 1)
        return { totalStrongResponses, percentageTotalStrongResponses, }
      },
      Aggregated: (row) => (<span className="gray"><span className={strongTextClassName(row.value.percentageTotalStrongResponses)}>{row.value.percentageTotalStrongResponses}%</span> ({row.value.totalStrongResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, strongResponses, scoredResponses, } = data.original
        const percentageOfStrongResponses = _.round((strongResponses/(scoredResponses || 1)) * 100, 1)
        return (<button className={`gray ${className}`} onClick={handleClick} type="button"><span className={strongTextClassName(percentageOfStrongResponses)}>{percentageOfStrongResponses}%</span> ({strongResponses})</button>)
      },
    },
    {
      Header: "% Weak",
      accessor: "weakResponses",
      key: "weakResponses",
      width: 100,
      sortMethod: (a, b) => b.percentageTotalWeakResponses - a.percentageTotalWeakResponses,
      aggregate: (values, rows) => {
        const totalWeakResponses = _.sum(values)
        const totalScoredResponses = _.sum(rows.map(r => r.scoredResponses)) || 1
        const percentageTotalWeakResponses = _.round((totalWeakResponses/totalScoredResponses) * 100, 1)
        return { totalWeakResponses, percentageTotalWeakResponses, }
      },
      Aggregated: (row) => (<span className="gray"><span className={weakTextClassName(row.value.percentageTotalWeakResponses)}>{row.value.percentageTotalWeakResponses}%</span> ({row.value.totalWeakResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, weakResponses, scoredResponses, } = data.original
        const percentageOfWeakResponses = _.round((weakResponses/(scoredResponses || 1)) * 100, 1)
        return (<button className={`gray ${className}`} onClick={handleClick} type="button"><span className={weakTextClassName(percentageOfWeakResponses)}>{percentageOfWeakResponses}%</span> ({weakResponses})</button>)
      },
    },
  ];

  const promptOptions = activityData && activityData.activity.prompts.map(p => {
    const promptOption: PromptOption = {...p}
    promptOption.label = p.text.replace(p.conjunction, `<b>${p.conjunction}</b>`)
    promptOption.value = p.id
    return promptOption
  })

  const selectedPromptOption = promptOptions && selectedPrompt && promptOptions.find(po => po.value === selectedPrompt.id)

  const containerClassName = sorted.length ? "rules-analysis-container" : "rules-analysis-container show-colored-rows"

  if(!activityData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    )
  }

  return(
    <div className={containerClassName}>
      {renderHeader(activityData, 'Rules Analysis')}
      <div className="dropdowns">
        <DropdownInput
          handleChange={setSelectedPrompt}
          label="Select Prompt"
          options={promptOptions || []}
          usesCustomOption={true}
          value={selectedPromptOption}
        />
        <DropdownInput
          handleChange={setSelectedRuleType}
          label="Select Rule Type"
          options={ruleTypeOptions || []}
          value={selectedRuleType}
        />
      </div>
      <div className="date-selection-container rules-analysis">
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
        {showError && <p className="error-message">Start date is required.</p>}
      </div>
      {renderDataSection()}
    </div>
  );
}

export default RulesAnalysis
