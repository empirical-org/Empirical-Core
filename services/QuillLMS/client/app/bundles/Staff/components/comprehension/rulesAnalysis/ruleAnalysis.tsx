import * as React from "react";
import { queryCache, useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import stripHtml from "string-strip-html";

import { fetchRule } from '../../../utils/comprehension/ruleAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
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


  const responseData = { responses: [] }

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
        console.log('label', label)
        console.log('value', value)
        return {
          id: `${label}-${i}`,
          field: label,
          value
        }
      });
    }
  }

  // The header labels felt redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "180px" },
    { name: "", attribute:"value", width: "1000px" }
  ];

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
        headers={dataTableFields}
        rows={ruleRows(ruleData)}
      />
      <Link className="quill-button medium contained primary" to={`/activities/${activityId}/rules/${ruleData.rule.id}`}>Edit Rule Feedback</Link>
    </div>
  );
}

export default Rule
