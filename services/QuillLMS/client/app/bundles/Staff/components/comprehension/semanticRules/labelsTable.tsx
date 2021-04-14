import * as React from "react";
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';
import { firstBy } from 'thenby';

import { fetchRules } from '../../../utils/comprehension/ruleAPIs';
import { DataTable, Spinner } from '../../../../Shared/index';
import { getCheckIcon } from '../../../helpers/comprehension';

const LabelsTable = ({ activityId, prompt }) => {

  const { data: rulesData } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}`, activityId, prompt.id, 'autoML'],
    queryFn: fetchRules
  });

  function getFormattedRows() {
    if(!(rulesData && rulesData.rules && rulesData.rules.length)) {
      return [];
    }
    const formattedRows = rulesData.rules.map(rule => {
      const { name, id, state, optimal, label } = rule;
      const ruleLink = (
        <Link className="data-link" to={{ pathname: `/activities/${activityId}/semantic-labels/${prompt.id}/${id}`, state: { rule: rule } }}>View</Link>
      );
      const isActive = state === 'active';
      return {
        id: id,
        descriptive_label: name,
        automl_label: label && label.name,
        state_for_sort: state,
        state: getCheckIcon(isActive),
        optimal: getCheckIcon(optimal),
        edit: ruleLink
      }
    });
    return formattedRows.sort(firstBy('state_for_sort').thenBy('id'));
  }

  if(!rulesData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Rule ID", attribute:"id", width: "70px" },
    { name: "Descriptive Label", attribute:"descriptive_label", width: "400px" },
    { name: "AutoML Label", attribute:"automl_label", width: "150px" },
    { name: "Active?", attribute:"state", width: "150px" },
    { name: "Optimal?", attribute:"optimal", width: "70px" },
    { name: "", attribute:"edit", width: "70px" }
  ];
  const addRuleLink = <Link to={`/activities/${activityId}/semantic-labels/${prompt.id}/new`}>Add Label</Link>;

  return(
    <section className="semantic-labels-container">
      <section className="header-container">
        <h5>Semantic Labels: <p>{prompt.conjunction}</p></h5>
        <h5>Prompt ID: <p>{prompt.id}</p></h5>
        <button className="quill-button fun primary contained" id="add-rule-button" type="submit">{addRuleLink}</button>
      </section>
      <DataTable
        className="semantic-labels-table"
        headers={dataTableFields}
        rows={getFormattedRows()}
      />
    </section>
  );
}

export default LabelsTable
