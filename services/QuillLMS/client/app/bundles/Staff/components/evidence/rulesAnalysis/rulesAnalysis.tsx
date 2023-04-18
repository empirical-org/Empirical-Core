import _ from 'lodash';
import qs from 'qs';
import * as React from "react";
import { useQuery } from 'react-query';
import { RouteComponentProps } from 'react-router-dom';
import { firstBy } from "thenby";

import { RULES_ANALYSIS } from '../../../../../constants/evidence';
import { DropdownInput, ReactTable, Spinner } from '../../../../Shared/index';
import { getVersionOptions, handlePageFilterClick } from "../../../helpers/evidence/miscHelpers";
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { calculatePercentageForResponses } from "../../../helpers/evidence/ruleHelpers";
import { ActivityRouteProps, DropdownObjectInterface, PromptInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity, fetchActivityVersions } from '../../../utils/evidence/activityAPIs';
import { fetchRuleFeedbackHistories } from '../../../utils/evidence/ruleFeedbackHistoryAPIs';
import FilterWidget from "../shared/filterWidget";

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
  'low-confidence': 9
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
  return (
    <div className="more-info">
      <p><strong>Rule Note:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.note || "N/A" }} /></p>
      <p><strong>First Layer Feedback:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.firstLayerFeedback || "N/A" }} /></p>
      <p><strong>Second Layer Feedback:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.secondLayerFeedback || "N/A" }} /></p>
    </div>
  )
}

const getDateFromLatestAutoMLModel = (models) => {
  if (!models) { return null }
  const latestModel = models.find( model => model.state === 'active')
  if (!latestModel) { return null }
  return latestModel.updated_at
}

const RulesAnalysis: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ history, match }) => {
  const { params } = match;
  const { activityId, promptConjunction, } = params;

  const ruleTypeValues = [DEFAULT_RULE_TYPE].concat(Object.keys(apiOrderLookup))
  const ruleTypeOptions = ruleTypeValues.map(val => ({ label: val, value: val, }))
  const ruleTypeFromUrl = (history.location && qs.parse(history.location.search.replace('?', '')).selected_rule_type) || DEFAULT_RULE_TYPE
  const initialStartDateString = window.sessionStorage.getItem(`${RULES_ANALYSIS}startDate`) || '';
  const initialEndDateString = window.sessionStorage.getItem(`${RULES_ANALYSIS}endDate`) || '';
  const initialStartDate = initialStartDateString ? new Date(initialStartDateString) : null;
  const initialEndDate = initialEndDateString ? new Date(initialEndDateString) : null;
  const selectedRuleTypeOption = ruleTypeOptions.find(opt => opt.value === ruleTypeFromUrl)
  const initialVersionOption = JSON.parse(window.sessionStorage.getItem(`${RULES_ANALYSIS}versionOption`)) || null;

  const [selectedPrompt, setSelectedPrompt] = React.useState(null)
  const [selectedRuleType, setSelectedRuleType] = React.useState(selectedRuleTypeOption)
  const [sorted, setSorted] = React.useState([])
  const [versionOption, setVersionOption] = React.useState<DropdownObjectInterface>(initialVersionOption);
  const [versionOptions, setVersionOptions] = React.useState<DropdownObjectInterface[]>([]);
  const [startDateForQuery, setStartDate] = React.useState<string>(initialStartDateString);
  const [endDate, onEndDateChange] = React.useState<Date>(initialEndDate);
  const [endDateForQuery, setEndDate] = React.useState<string>(initialEndDateString);
  const [totalResponsesByConjunction, setTotalResponsesByConjunction] = React.useState<number>(null);
  const [formattedRows, setFormattedRows] = React.useState<any[]>(null);
  const [startDate, onStartDateChange] = React.useState<Date>(initialStartDate);

  const selectedConjunction = selectedPrompt ? selectedPrompt.conjunction : promptConjunction

  // cache rules data for updates
  const { data: ruleFeedbackHistory } = useQuery({
    queryKey: [`rule-feedback-history-by-conjunction-${selectedConjunction}-and-activity-${activityId}`, activityId, selectedConjunction, startDateForQuery, endDateForQuery],
    queryFn: fetchRuleFeedbackHistories
  });

  const { data: dataForTotalResponseCount } = useQuery({
    queryKey: [`rule-feedback-history-for-total-response-count`, activityId, selectedConjunction, startDateForQuery, endDateForQuery],
    queryFn: fetchRuleFeedbackHistories
  });

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
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
    if(dataForTotalResponseCount && dataForTotalResponseCount.ruleFeedbackHistories) {
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
  }, [dataForTotalResponseCount, startDate, endDate, startDateForQuery, endDateForQuery]);

  React.useEffect(() => {
    if(selectedPrompt && ruleFeedbackHistory && ruleFeedbackHistory.ruleFeedbackHistories && ruleFeedbackHistory.ruleFeedbackHistories) {
      const formattedRows = ruleFeedbackHistory.ruleFeedbackHistories.filter(rule => {
        return selectedRuleType.value === DEFAULT_RULE_TYPE || rule.api_name === selectedRuleType.value
      }).map(rule => {
        const { rule_name, rule_uid, api_name, rule_order, note, total_responses, strong_responses, weak_responses, first_feedback, second_feedback, repeated_consecutive_responses, repeated_non_consecutive_responses, avg_confidence } = rule;
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
          avgConfidence: avg_confidence,
          totalResponses: total_responses,
          scoredResponses: strong_responses + weak_responses,
          activityId,
          note,
          firstLayerFeedback: first_feedback,
          secondLayerFeedback: second_feedback,
          handleClick: () => window.open(`/cms/evidence#/activities/${activityId}/rules-analysis/${selectedPrompt.conjunction}/rule/${rule_uid}/prompt/${selectedPrompt.id}`, '_blank')
        }
      }).sort(firstBy('apiOrder').thenBy('ruleOrder'));
      setFormattedRows(formattedRows);
    }
  }, [ruleFeedbackHistory, selectedRuleType])

  function handleVersionSelection(versionOption: DropdownObjectInterface) {
    setVersionOption(versionOption);
  }

  function handleFilterClick() {
    handlePageFilterClick({ startDate, endDate, versionOption, setStartDate, setEndDate, setPageNumber: null, storageKey: RULES_ANALYSIS });
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
          defaultGroupBy={["apiName"]}
          // the first row will be the toggle rule identifier row, so we need to increment by 1
          defaultPageSize={formattedRows && formattedRows.length < 100 ? (formattedRows.length + 1) : 100}
          defaultSorted={sorted}
          manualSortBy
          onSortedChange={setSorted}
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
      Header: "API Name",
      accessor: "apiName",
      key: "apiName",
      maxWidth: 280,
      sortType: (a, b) => apiOrderLookup[b.original.apiName] - apiOrderLookup[a.original.apiName],
      Cell: ({ row }) => {
        if (row.canExpand) {
          return (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`
                }
              })}
            >
              <span className={`rt-expander ${row.isExpanded ? "-open" : ""}`} >
                •
              </span>
              {row.groupByVal} {" "} ({row.subRows.length})
            </span>
          );
        }
        return null;
      }
    },
    {
      Header: "",
      id: "expander",
      resizable: false,
      className: "text-center",
      maxWidth: 60,
      Cell: ({ row }) => {
        if (row.isGrouped) { return <span /> }
        return (
          <div
            {...row.getToggleRowExpandedProps()}
            className="rt-td rt-expandable"
          >
            <div className="odd expand-cell">
              +
            </div>
          </div>
        );
      }
    },
    {
      Header: "Rule Order",
      accessor: "ruleOrder",
      key: "ruleOrder",
      maxWidth: 50,
      aggregate: vals => '',
      Aggregated: (row) => (<span />),
      Cell: ({row}) => (<button className={row.original.className} onClick={row.original.handleClick} type="button">{row.original.ruleOrder}</button>),
    },
    {
      Header: "Rule",
      accessor: "rule",
      key: "rule",
      minWidth: 300,
      aggregate: vals => '',
      Aggregated: (row) => (<span />),
      Cell: ({row}) => (<button className={row.original.className} onClick={row.original.handleClick} type="button">{row.original.rule}</button>),
    },
    {
      Header: "AutoML Confidence",
      accessor: "avgConfidence",
      key: "avgConfidence",
      maxWidth: 100,
      aggregate: (values) => {
        const averageConfidenceForAllRules = Math.round(_.mean(values.filter(Number)))
        return { averageConfidenceForAllRules }
      },
      Aggregated: (row) => (isNaN(row.value.averageConfidenceForAllRules) ? '' : <span>{row.value.averageConfidenceForAllRules}%</span>),
      Cell: ({row}) => {
        const { avgConfidence } = row.original
        return (avgConfidence && <span>{avgConfidence}%</span>)
      }
    },
    {
      Header: "Total Responses",
      accessor: "totalResponses",
      key: "totalResponses",
      maxWidth: 100,
      aggregate: (values) => {
        const totalResponses = _.sum(values);
        const percentageOutOfAllResponses = calculatePercentageForResponses(totalResponses, totalResponsesByConjunction);
        return { totalResponses, percentageOutOfAllResponses }
      },
      Aggregated: (row) => (<span>{row.value.percentageOutOfAllResponses}% <span className="gray">({row.value.totalResponses})</span></span>),
      Cell: ({row}) => {
        const { className, handleClick, totalResponses } = row.original;
        const percentageOutOfAllResponses = calculatePercentageForResponses(totalResponses, totalResponsesByConjunction);
        return (<button className={className} onClick={handleClick} type="button">{percentageOutOfAllResponses}% <span className="gray">({totalResponses})</span></button>)
      },
    },
    {
      Header: "Rule Repeated: Consecutive",
      accessor: "repeatedConsecutiveResponses",
      key: "repeatedConsecutiveResponses",
      maxWidth: 125,
      sortType: (a, b) => b.original.percentageTotalRepeatedConsecutiveResponses - a.original.percentageTotalRepeatedConsecutiveResponses,
      aggregate: (values) => {
        const totalRepeatedConsecutiveResponses = _.sum(values.map(v => v.value))
        const totalTotalResponses = _.sum(values.map(v => v.totalResponses)) || 1
        const percentageTotalRepeatedConsecutiveResponses = _.round((totalRepeatedConsecutiveResponses/totalTotalResponses) * 100, 1)
        return { totalRepeatedConsecutiveResponses, percentageTotalRepeatedConsecutiveResponses, }
      },
      aggregateValue: (value, row, column) => {
        return { value, totalResponses: row.original.totalResponses }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalRepeatedConsecutiveResponses}% ({row.value.totalRepeatedConsecutiveResponses})</span>),
      Cell: ({row}) => {
        const { className, handleClick, repeatedConsecutiveResponses, totalResponses, } = row.original
        const percentageOfRepeatedConsecutiveResponses = _.round((repeatedConsecutiveResponses/(totalResponses || 1)) * 100, 1)
        return (<button className={className} onClick={handleClick} type="button">{percentageOfRepeatedConsecutiveResponses}% ({repeatedConsecutiveResponses})</button>)
      },
    },
    {
      Header: "Rule Repeated: Non-Consecutive",
      accessor: "repeatedNonConsecutiveResponses",
      key: "repeatedNonConsecutiveResponses",
      maxWidth: 125,
      sortType: (a, b) => b.original.percentageTotalRepeatedNonConsecutiveResponses - a.original.percentageTotalRepeatedNonConsecutiveResponses,
      aggregate: (values) => {
        const totalRepeatedNonConsecutiveResponses = _.sum(values.map(v => v.value))
        const totalTotalResponses = _.sum(values.map(v => v.totalResponses)) || 1
        const percentageTotalRepeatedNonConsecutiveResponses = _.round((totalRepeatedNonConsecutiveResponses/totalTotalResponses) * 100, 1)
        return { totalRepeatedNonConsecutiveResponses, percentageTotalRepeatedNonConsecutiveResponses, }
      },
      aggregateValue: (value, row, column) => {
        return { value, totalResponses: row.original.totalResponses }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalRepeatedNonConsecutiveResponses}% ({row.value.totalRepeatedNonConsecutiveResponses})</span>),
      Cell: ({row}) => {
        const { className, handleClick, repeatedNonConsecutiveResponses, totalResponses, } = row.original
        const percentageOfRepeatedNonConsecutiveResponses = _.round((repeatedNonConsecutiveResponses/(totalResponses || 1)) * 100, 1)
        return (<button className={className} onClick={handleClick} type="button">{percentageOfRepeatedNonConsecutiveResponses}% ({repeatedNonConsecutiveResponses})</button>)
      },
    },
    {
      Header: "Scored Responses",
      accessor: "scoredResponses",
      key: "scoredResponses",
      maxWidth: 150,
      sortType: (a, b) => b.original.percentageTotalScoredResponses - a.original.percentageTotalScoredResponses,
      aggregate: (values, rows) => {
        const totalScoredResponses = _.sum(values.map(v => v.value))
        const totalTotalResponses = _.sum(values.map(v => v.totalResponses)) || 1
        const percentageTotalScoredResponses = _.round((totalScoredResponses/totalTotalResponses) * 100, 1)
        return { totalScoredResponses, percentageTotalScoredResponses, }
      },
      aggregateValue: (value, row, column) => {
        return { value, totalResponses: row.original.totalResponses }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalScoredResponses}% ({row.value.totalScoredResponses})</span>),
      Cell: ({row}) => {
        const { className, handleClick, scoredResponses, totalResponses, } = row.original
        const percentageOfScoredResponses = _.round((scoredResponses/(totalResponses || 1)) * 100, 1)
        return (<button className={className} onClick={handleClick} type="button">{percentageOfScoredResponses}% ({scoredResponses})</button>)
      },
    },
    {
      Header: "% Strong",
      accessor: "strongResponses",
      key: "strongResponses",
      maxWidth: 100,
      sortType: (a, b) => b.original.percentageTotalStrongResponses - a.original.percentageTotalStrongResponses,
      aggregate: (values) => {
        const totalStrongResponses = _.sum(values.map(v => v.value))
        const totalScoredResponses = _.sum(values.map(v => v.scoredResponses)) || 1
        const percentageTotalStrongResponses = _.round((totalStrongResponses/totalScoredResponses) * 100, 1)
        return { totalStrongResponses, percentageTotalStrongResponses, }
      },
      aggregateValue: (value, row, column) => {
        return { value, scoredResponses: row.original.scoredResponses }
      },
      Aggregated: (row) => (<span className="gray"><span className={strongTextClassName(row.value.percentageTotalStrongResponses)}>{row.value.percentageTotalStrongResponses}%</span> ({row.value.totalStrongResponses})</span>),
      Cell: ({row}) => {
        const { className, handleClick, strongResponses, scoredResponses, } = row.original
        const percentageOfStrongResponses = _.round((strongResponses/(scoredResponses || 1)) * 100, 1)
        return (<button className={`gray ${className}`} onClick={handleClick} type="button"><span className={strongTextClassName(percentageOfStrongResponses)}>{percentageOfStrongResponses}%</span> ({strongResponses})</button>)
      },
    },
    {
      Header: "% Weak",
      accessor: "weakResponses",
      key: "weakResponses",
      maxWidth: 100,
      sortType: (a, b) => b.original.percentageTotalWeakResponses - a.original.percentageTotalWeakResponses,
      aggregate: (values, rows) => {
        const totalWeakResponses = _.sum(values.map(v => v.value))
        const totalScoredResponses = _.sum(values.map(v => v.scoredResponses)) || 1
        const percentageTotalWeakResponses = _.round((totalWeakResponses/totalScoredResponses) * 100, 1)
        return { totalWeakResponses, percentageTotalWeakResponses, }
      },
      aggregateValue: (value, row, column) => {
        return { value, scoredResponses: row.original.scoredResponses }
      },
      Aggregated: (row) => (<span className="gray"><span className={weakTextClassName(row.value.percentageTotalWeakResponses)}>{row.value.percentageTotalWeakResponses}%</span> ({row.value.totalWeakResponses})</span>),
      Cell: ({row}) => {
        const { className, handleClick, weakResponses, scoredResponses, } = row.original
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
      {renderDataSection()}
    </div>
  );
}

export default RulesAnalysis
