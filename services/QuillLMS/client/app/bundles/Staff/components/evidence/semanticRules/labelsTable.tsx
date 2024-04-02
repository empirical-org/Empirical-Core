import * as React from "react";
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { firstBy } from 'thenby';

import { AUTO_ML } from '../../../../../constants/evidence';
import { DataTable, Spinner } from '../../../../Shared/index';
import { getCheckIcon } from '../../../helpers/evidence/renderHelpers';
import { fetchRules } from '../../../utils/evidence/ruleAPIs';

const LabelsTable = ({ activityId, prompt }) => {

  const { data: rulesData } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${AUTO_ML}`, null, prompt.id, AUTO_ML],
    queryFn: fetchRules
  });

  function getFormattedRows() {
    if(!(rulesData && rulesData.rules && rulesData.rules.length)) {
      return [];
    }
    const formattedRows = rulesData.rules.map(rule => {
      const { name, id, state, optimal, label } = rule;
      const ruleLink = (
        <Link className="data-link" to={{ pathname: `/activities/${activityId}/semantic-labels/${prompt.id}/${id}`, state: { rule: rule, conjunction: prompt.conjunction } }}>View</Link>
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
  const addRuleLink = <Link className="quill-button fun primary contained" id="add-rule-button" to={{ pathname: `/activities/${activityId}/semantic-labels/${prompt.id}/new`, state: { conjunction: prompt.conjunction }}}>Add Label</Link>;
  const semanticRulesCheatSheetLink = <Link className="quill-button fun secondary outlined" rel="noopener noreferrer" target="_blank" to={`/activities/${activityId}/semantic-labels/${prompt.id}/semantic-rules-cheat-sheet`} >Semantic Rules Cheat Sheet</Link>;

  return(
    <section className="semantic-labels-container">
      <DataTable
        className="semantic-labels-table"
        headers={dataTableFields}
        rows={getFormattedRows()}
      />
      <div className="button-wrapper">
        {addRuleLink}
        {semanticRulesCheatSheetLink}
      </div>
    </section>
  );
}

export default LabelsTable
