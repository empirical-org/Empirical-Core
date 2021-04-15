import * as React from "react";
import { queryCache, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import stripHtml from "string-strip-html";
import moment from 'moment';
import ReactTable from 'react-table';

import { fetchRule } from '../../../utils/comprehension/ruleAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { fetchRuleFeedbackHistoriesByRule } from '../../../utils/comprehension/ruleFeedbackHistoryAPIs';
import { fetchConcepts, } from '../../../utils/comprehension/conceptAPIs';
import { createOrUpdateFeedbackHistoryRating } from '../../../utils/comprehension/feedbackHistoryRatingAPIs';
import { DataTable, Error, Spinner } from '../../../../Shared/index';

const ALL = 'All'
const SCORED = 'Scored'
const UNSCORED = 'Unscored'

const RuleAnalysis = ({ history, match }) => {
  const { params } = match;
  const { activityId, ruleId } = params;

  const [filter, setFilter] = React.useState(ALL)

  const { data: conceptsData } = useQuery({
    queryKey: ['concepts', ruleId],
    queryFn: fetchConcepts
  });

  const { data: ruleData } = useQuery({
    queryKey: [`rule-${ruleId}`, ruleId],
    queryFn: fetchRule
  });

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const { data: ruleFeedbackHistoryData } = useQuery({
    queryKey: [`rule-feedback-histories-by-rule-${ruleId}`, ruleId],
    queryFn: fetchRuleFeedbackHistoriesByRule
  })

  function handleFilterChange(e) { setFilter(e.target.value) }

  function filterResponses(r) {
    if (filter === ALL) { return true }
    if (filter === SCORED && r.strength !== null) { return true }
    if (filter === UNSCORED && r.strength === null) { return true }

    return false
  }

   async function makeStrong(response) { updateFeedbackHistoryRatingStrength(response.response_id, true) }

   async function makeWeak(response) { updateFeedbackHistoryRatingStrength(response.response_id, false) }

   async function updateFeedbackHistoryRatingStrength(responseId, strong) {
     createOrUpdateFeedbackHistoryRating({ rating: strong, feedback_history_id: responseId}).then((response) => {
       queryCache.refetchQueries(`rule-feedback-histories-by-rule-${ruleId}`);
     });
   }

  const ruleRows = ({ rule }) => {
    if(!rule) {
      return [];
    } else {
      // format for DataTable to display labels on left side and values on right
      const { description, feedbacks, name, rule_type, concept_uid, } = rule;

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
          label: 'Rule Description',
          value: description ? stripHtml(description) : ''
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
          value: feedbacks[0] ? feedbacks[0].text : null
        },
        {
          label: 'Feedback - 2nd Attempt',
          value: feedbacks[1] ? feedbacks[1].text : null
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
    { name: "", attribute:"value", width: "1000px" }
  ];

  const responseRows = (data) => {
    if (!activityData || !data) { return [] }
    const { responses, } = data
    return responses.filter(filterResponses).map(r => {
      const formattedResponse = {...r}
      const highlightedEntry = r.entry.replace(r.highlight, `<strong>${r.highlight}</strong>`)
      const strongButton = <button className={r.strength === true ? 'strength-button strong' : 'strength-button'} onClick={() => makeStrong(r)} type="button">Strong</button>
      const weakButton = <button className={r.strength === false ? 'strength-button weak' : 'strength-button'} onClick={() => makeWeak(r)} type="button">Weak</button>

      formattedResponse.response = <span dangerouslySetInnerHTML={{ __html: highlightedEntry }} key={r.entry} />
      formattedResponse.datetime = moment(r.datetime).format('MM/DD/YYYY')
      formattedResponse.strengthButtons = (<div className="strength-buttons">{strongButton}{weakButton}</div>)

      return formattedResponse
    })
  }

  const responseHeaders = [
    {
      Header: "Time",
      accessor: "datetime",
      width: 100
    },
    {
      Header: activityData ? activityData.activity.prompts[0].text.replace(activityData.activity.prompts[0].conjunction, '') : '', // necessary because sometimes the conjunction is part of the prompt and sometimes it isn't
      accessor: "response",
      width: 600,
      sortMethod: (a, b) => (a.key.localeCompare(b.key)),
      filterMethod: (filter, row) => (row.response.key.includes(filter.value)),
      filterable: true
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
    }
  ]

  if(!ruleData || !activityData || !ruleFeedbackHistoryData || !conceptsData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(ruleData.error) {
    return(
      <div className="error-container">
        <Error error={`${ruleData.error}`} />
      </div>
    );
  }

  return(
    <div className="rule-analysis-container">
      <div className="header-container">
        <h2>Rule: {ruleData.rule.name}</h2>
      </div>
      <DataTable
        className="rule-table"
        headers={ruleHeaders}
        rows={ruleRows(ruleData)}
      />
      <Link className="quill-button medium contained primary" to={`/activities/${activityId}/rules/${ruleData.rule.id}`}>Edit Rule Feedback</Link>
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
      </div>
      <ReactTable
        className="responses-table"
        columns={responseHeaders}
        data={responseRows(ruleFeedbackHistoryData)}
        defaultPageSize={responseRows(ruleFeedbackHistoryData).length < 100 ? responseRows(ruleFeedbackHistoryData).length : 100}
        showPagination={true}
      />
    </div>
  );
}

export default RuleAnalysis
