import * as React from "react";
import { RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-query';
import { firstBy } from "thenby";
import ReactTable from 'react-table';
import qs from 'qs';
import _ from 'lodash'

import { ActivityRouteProps, PromptInterface } from '../../../interfaces/comprehensionInterfaces';
import { ruleOrder } from '../../../../../constants/comprehension';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { fetchRuleFeedbackHistories } from '../../../utils/comprehension/ruleFeedbackHistoryAPIs';
import { DropdownInput, } from '../../../../Shared/index';

const DEFAULT_RULE_TYPE = 'All Rules'

interface PromptOption extends PromptInterface {
  value?: number;
  label?: string;
}

const MoreInfo = (row) => {
  return (<div className="more-info">
    <p><strong>Rule Note:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.note || "N/A" }} /></p>
    <p><strong>First Layer Feedback:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.firstLayerFeedback || "N/A" }} /></p>
  </div>)
}

const RulesAnalysis: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ history, match }) => {
  const { params } = match;
  const { activityId, promptConjunction, } = params;

  const ruleTypeValues = [DEFAULT_RULE_TYPE].concat(Object.keys(ruleOrder))
  const ruleTypeOptions = ruleTypeValues.map(val => ({ label: val, value: val, }))
  const ruleTypeFromUrl = (history.location && qs.parse(history.location.search.replace('?', '')).selected_rule_type) || DEFAULT_RULE_TYPE

  const selectedRuleTypeOption = ruleTypeOptions.find(opt => opt.value === ruleTypeFromUrl)

  const [selectedPrompt, setSelectedPrompt] = React.useState(null)
  const [selectedRuleType, setSelectedRuleType] = React.useState(selectedRuleTypeOption)
  const [sorted, setSorted] = React.useState([])

  const selectedConjunction = selectedPrompt ? selectedPrompt.conjunction : promptConjunction
  // cache rules data for updates
  const { data: ruleFeedbackHistory } = useQuery({
    queryKey: [`rule-feedback-history-by-conjunction-${selectedConjunction}-and-activity-${activityId}`, activityId, selectedConjunction],
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

  function setPromptBasedOnActivity() {
    if (!activityData || !promptConjunction) { return }

    const prompt = activityData.activity.prompts.find(prompt => prompt.conjunction === promptConjunction)
    setSelectedPrompt(prompt)
  }

  const formattedRows = selectedPrompt && ruleFeedbackHistory && ruleFeedbackHistory.ruleFeedbackHistories && ruleFeedbackHistory.ruleFeedbackHistories.filter(rule => {
    return selectedRuleType.value === DEFAULT_RULE_TYPE || rule.api_name.toLowerCase() === selectedRuleType.value.toLowerCase()
  }).map(rule => {
    const { rule_name, rule_uid, api_name, rule_order, note, total_responses, strong_responses, weak_responses, first_feedback, repeated_consecutive_responses, repeated_non_consecutive_responses } = rule;
    const apiOrder = ruleOrder[api_name]
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
      handleClick: () => window.location.href = `/cms/comprehension#/activities/${activityId}/rules-analysis/${selectedPrompt.conjunction}/rule/${rule_uid}/prompt/${selectedPrompt.id}`
    }
  }).sort(firstBy('apiOrder').thenBy('ruleOrder'));

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
      width: 150,
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
      aggregate: vals => _.sum(vals),
      Aggregated: (row) => (<span>{row.value}</span>),
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.totalResponses}</button>),
    },
    {
      Header: "Rule Repeated: Consecutive",
      accessor: "repeatedConsecutiveResponses",
      key: "repeatedConsecutiveResponses",
      width: 100,
      sortMethod: (a, b) => b.percentageTotalRepeatedConsecutiveResponses - a.percentageTotalRepeatedConsecutiveResponses,
      aggregate: (values, rows) => {
        const totalRepeatedConsecutiveResponses = _.sum(values)
        const totalTotalResponses = _.sum(rows.map(r => r.totalResponses))
        const percentageTotalRepeatedConsecutiveResponses = _.round(totalRepeatedConsecutiveResponses/totalTotalResponses, 3)
        return { totalRepeatedConsecutiveResponses, percentageTotalRepeatedConsecutiveResponses, }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalRepeatedConsecutiveResponses}% ({row.value.totalRepeatedConsecutiveResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, repeatedConsecutiveResponses, totalResponses, } = data.original
        const percentageOfRepeatedConsecutiveResponses = _.round(repeatedConsecutiveResponses/(totalResponses || 1), 3)
        return (<button className={className} onClick={handleClick} type="button">{percentageOfRepeatedConsecutiveResponses}% ({repeatedConsecutiveResponses})</button>)
      },
    },
    {
      Header: "Rule Repeated: Non-Consecutive",
      accessor: "repeatedNonConsecutiveResponses",
      key: "repeatedNonConsecutiveResponses",
      width: 100,
      sortMethod: (a, b) => b.percentageTotalRepeatedNonConsecutiveResponses - a.percentageTotalRepeatedNonConsecutiveResponses,
      aggregate: (values, rows) => {
        const totalRepeatedNonConsecutiveResponses = _.sum(values)
        const totalTotalResponses = _.sum(rows.map(r => r.totalResponses))
        const percentageTotalRepeatedNonConsecutiveResponses = _.round(totalRepeatedNonConsecutiveResponses/totalTotalResponses, 3)
        return { totalRepeatedNonConsecutiveResponses, percentageTotalRepeatedNonConsecutiveResponses, }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalRepeatedNonConsecutiveResponses}% ({row.value.totalRepeatedNonConsecutiveResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, repeatedNonConsecutiveResponses, totalResponses, } = data.original
        const percentageOfRepeatedNonConsecutiveResponses = _.round(repeatedNonConsecutiveResponses/(totalResponses || 1), 3)
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
        const totalTotalResponses = _.sum(rows.map(r => r.totalResponses))
        const percentageTotalScoredResponses = _.round(totalScoredResponses/totalTotalResponses, 3)
        return { totalScoredResponses, percentageTotalScoredResponses, }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalScoredResponses}% ({row.value.totalScoredResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, scoredResponses, totalResponses, } = data.original
        const percentageOfScoredResponses = _.round(scoredResponses/(totalResponses || 1), 3)
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
        const totalTotalResponses = _.sum(rows.map(r => r.totalResponses))
        const percentageTotalStrongResponses = _.round(totalStrongResponses/totalTotalResponses, 3)
        return { totalStrongResponses, percentageTotalStrongResponses, }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalStrongResponses}% ({row.value.totalStrongResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, strongResponses, totalResponses, } = data.original
        const percentageOfStrongResponses = _.round(strongResponses/(totalResponses || 1), 3)
        return (<button className={className} onClick={handleClick} type="button">{percentageOfStrongResponses}% ({strongResponses})</button>)
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
        const totalTotalResponses = _.sum(rows.map(r => r.totalResponses))
        const percentageTotalWeakResponses = _.round(totalWeakResponses/totalTotalResponses, 3)
        return { totalWeakResponses, percentageTotalWeakResponses, }
      },
      Aggregated: (row) => (<span>{row.value.percentageTotalWeakResponses}% ({row.value.totalWeakResponses})</span>),
      Cell: (data) => {
        const { className, handleClick, weakResponses, totalResponses, } = data.original
        const percentageOfWeakResponses = _.round(weakResponses/(totalResponses || 1), 3)
        return (<button className={className} onClick={handleClick} type="button">{percentageOfWeakResponses}% ({weakResponses})</button>)
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

  return(
    <div className={containerClassName}>
      <h1>Rules Analysis</h1>
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
      {selectedPrompt && formattedRows && (<ReactTable
        className="rules-analysis-table"
        columns={dataTableFields}
        data={formattedRows ? formattedRows : []}
        defaultPageSize={formattedRows.length}
        onSortedChange={setSorted}
        pivotBy={["apiName"]}
        showPagination={false}
        sorted={sorted}
        SubComponent={MoreInfo}
      />)}
    </div>
  );
}

export default RulesAnalysis
