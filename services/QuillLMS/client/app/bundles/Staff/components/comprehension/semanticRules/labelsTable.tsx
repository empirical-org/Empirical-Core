import * as React from "react";
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';

import { fetchRules } from '../../../utils/comprehension/ruleAPIs';
import { DataTable, Spinner } from '../../../../Shared/index';
import { getCheckIcon } from '../../../helpers/comprehension';

const LabelsTable = ({ activityId, prompt }) => {

  const { data: rulesData } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}`, activityId, prompt.id, 'autoML'],
    queryFn: fetchRules
  });

  const formattedRows = rulesData && rulesData.rules && rulesData.rules.length && rulesData.rules.map(rule => {
    const { name, id, state, optimal, label } = rule;
    const ruleLink = (
      <Link className="data-link" to={{ pathname: `/activities/${activityId}/semantic-rules/${id}`, state: { rule: rule } }}>Edit</Link>
    );
    return {
      id: id,
      name: name,
      label_name: label && label.name,
      state: state,
      optimal: getCheckIcon(optimal),
      edit: ruleLink
    }
  });

  if(!rulesData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Rule ID", attribute:"id", width: "70px" },
    { name: "Rule Name", attribute:"name", width: "400px" },
    { name: "Label Name", attribute:"label_name", width: "150px" },
    { name: "Rule/Label Active?", attribute:"state", width: "150px" },
    { name: "Optimal?", attribute:"optimal", width: "70px" },
    { name: "", attribute:"edit", width: "70px" }
  ];
  const ruleLink = (
    <Link to={{ pathname: `/activities/${activityId}/semantic-rules/new`, state: { promptId: [prompt.id] }}}>Add Rule/Label</Link>
  );

  return(
    <section className="semantic-rules-container">
      <section className="header-container">
        <h5>Semantic Rules/Label: <p>{prompt.conjunction}</p></h5>
        <h5>Prompt ID: <p>{prompt.id}</p></h5>
        <section className="lower-header-container">
          <h5>Prompt Labelset</h5>
          <button className="quill-button fun primary contained" id="add-rule-button" type="submit">{ruleLink}</button>
        </section>
      </section>
      <DataTable
        className="semantic-rules-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
    </section>
  );
}

export default LabelsTable
