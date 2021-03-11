import * as React from "react";
import { queryCache, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import stripHtml from "string-strip-html";
import moment from 'moment';
import ReactTable from 'react-table';

import { fetchRule } from '../../../utils/comprehension/ruleAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { fetchResponses } from '../../../utils/comprehension/responseAPIs';
import { editFeedbackHistory } from '../../../utils/comprehension/feedbackHistoryAPIs';
import { DataTable, Error, Spinner } from '../../../../Shared/index';

const Rule = ({ history, match }) => {
  const { params } = match;
  const { activityId, ruleId } = params;

  // cache rule data
  const { data: ruleData } = useQuery({
    queryKey: [`rule-${ruleId}`, ruleId],
    queryFn: fetchRule
  });

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const { data: responseData } = useQuery({
    queryKey: [`responses-for-activity-${activityId}-rule-${ruleId}`, activityId, ruleId],
    queryFn: fetchResponses
  })

 async function makeStrong(response) { updateFeedbackHistoryStrength(response.response_id, true) }

 async function makeWeak(response) { updateFeedbackHistoryStrength(response.response_id, false) }

 async function updateFeedbackHistoryStrength(responseId, strong) {
   editFeedbackHistory(responseId, { strength: strong, }).then((response) => {
     queryCache.refetchQueries(`responses-for-activity-${activityId}-rule-${ruleId}`);
   });
 }

  const ruleRows = ({ rule }) => {
    if(!rule) {
      return [];
    } else {
      // format for DataTable to display labels on left side and values on right
      const { description, feedbacks, name, rule_type, level_zero_concept_name, level_one_concept_name, level_two_concept_name, } = rule;
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
          value: level_zero_concept_name
        },
        {
          label: 'Concept - Level 1',
          value: level_one_concept_name
        },
        {
          label: 'Concept - Level 2',
          value: level_two_concept_name
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
          value: responseData.responses.length
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

  const responseRows = ({ responses, }) => {
    if (!activityData && !responseData) { return [] }
    return responses.map(r => {
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
    }
  ]

  if(!ruleData) {
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
      <ReactTable
        className="responses-table"
        columns={responseHeaders}
        data={responseRows(responseData)}
        defaultPageSize={responseRows(responseData).length < 100 ? responseRows(responseData).length : 100}
        showPagination={true}
      />
    </div>
  );
}

export default Rule
