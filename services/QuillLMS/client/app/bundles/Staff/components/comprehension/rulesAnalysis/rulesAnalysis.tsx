import * as React from "react";
import { RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-query';
import { firstBy } from "thenby";
import ReactTable from 'react-table';

import { ActivityRouteProps } from '../../../interfaces/comprehensionInterfaces';
import { ruleOrder } from '../../../../../constants/comprehension';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { fetchRuleFeedbackHistories } from '../../../utils/comprehension/ruleFeedbackHistoryAPIs';
import { DropdownInput, } from '../../../../Shared/index';

const DEFAULT_RULE_TYPE = 'All Rules'

const MoreInfo = (row) => {
  return (<div className="more-info">
    <p><strong>Rule Description:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.description || "N/A" }} /></p>
    <p><strong>First Layer Feedback:</strong> <span dangerouslySetInnerHTML={{ __html: row.original.firstLayerFeedback || "N/A" }} /></p>
  </div>)
}

const RulesAnalysis: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;

  const [selectedPrompt, setSelectedPrompt] = React.useState(null)
  const [selectedRuleType, setSelectedRuleType] = React.useState({ label: DEFAULT_RULE_TYPE, value: DEFAULT_RULE_TYPE })
  const [sorted, setSorted] = React.useState([])

  const selectedConjunction = selectedPrompt ? selectedPrompt.conjunction : null
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


  const formattedRows = selectedPrompt && ruleFeedbackHistory && ruleFeedbackHistory.ruleFeedbackHistories && ruleFeedbackHistory.ruleFeedbackHistories.filter(rule => {
    return selectedRuleType.value === DEFAULT_RULE_TYPE || rule.api_name.toLowerCase() === selectedRuleType.value.toLowerCase()
  }).map(rule => {
    const { rule_name, rule_uid, api_name, rule_order, rule_description, pct_strong, pct_scored, total_responses, scored_responses, first_feedback, } = rule;
    const apiOrder = ruleOrder[api_name]
    return {
      rule_uid,
      className: apiOrder % 2 === 0 ? 'even' : 'odd',
      apiOrder,
      apiName: api_name,
      ruleOrder: Number(rule_order),
      rule: rule_name,
      percentageStrong: pct_strong,
      totalResponses: total_responses,
      scoredResponses: scored_responses,
      percentageScored: pct_scored,
      activityId,
      description: rule_description,
      firstLayerFeedback: first_feedback,
      handleClick: () => window.location.href = `/cms/comprehension#/activities/${activityId}/rules-analysis/${rule_uid}`
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
      width: 100,
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.ruleOrder}</button>),
    },
    {
      Header: "Rule",
      accessor: "rule",
      key: "rule",
      minWidth: 700,
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.rule}</button>),
    },
    {
      Header: "% Strong",
      accessor: "percentageStrong",
      key: "percentageStrong",
      width: 150,
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.percentageStrong}</button>),
    },
    {
      Header: "Total Responses",
      accessor: "totalResponses",
      key: "totalResponses",
      width: 150,
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.totalResponses}</button>),
    },
    {
      Header: "Scored Responses",
      accessor: "scoredResponses",
      key: "scoredResponses",
      width: 150,
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.scoredResponses}</button>),
    },
    {
      Header: "% Scored",
      accessor: "percentageScored",
      key: "percentageScored",
      width: 150,
      Cell: (data) => (<button className={data.original.className} onClick={data.original.handleClick} type="button">{data.original.percentageScored}</button>),
    },
  ];

  const promptOptions = activityData && activityData.activity.prompts.map(p => {
    const promptOption = {...p}
    promptOption.label = p.text.replace(p.conjunction, `<b>${p.conjunction}</b>`)
    promptOption.value = p.id
    return promptOption
  })

  const ruleTypeValues = [DEFAULT_RULE_TYPE].concat(Object.keys(ruleOrder))

  const ruleTypeOptions = ruleTypeValues.map(val => ({ label: val, value: val, }))

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
          value={selectedPrompt}
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
        showPagination={false}
        sorted={sorted}
        SubComponent={MoreInfo}
      />)}
    </div>
  );
}

export default RulesAnalysis
