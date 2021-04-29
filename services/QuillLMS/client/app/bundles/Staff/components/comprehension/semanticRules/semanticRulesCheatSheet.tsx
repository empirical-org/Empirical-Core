import * as React from "react";
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';
import { firstBy } from 'thenby';

import { fetchRules } from '../../../utils/comprehension/ruleAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { DataTable, Spinner } from '../../../../Shared/index';
import { getCheckIcon } from '../../../helpers/comprehension';

const SemanticRulesCheatSheet = ({ history, match, location, }) => {
  const { params } = match;
  const { activityId } = params;
  const { promptId } = params;

  // get cached activity data to pass to ruleForm
  const { data: rulesData } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${promptId}`, activityId, promptId, 'autoML'],
    queryFn: fetchRules
  });

  function getFormattedRows() {
    if(!(rulesData && rulesData.rules && rulesData.rules.length)) {
      return [];
    }
    const formattedRows = rulesData.rules.map(rule => {
      debugger;
      const { name, id, state, optimal, label } = rule;
      const ruleLink = (
        <Link className="data-link" to={{ pathname: `/activities/${activityId}/semantic-labels/${promptId}/${id}`, state: { rule: rule } }}>View</Link>
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
  const addRuleLink = <Link className="quill-button fun primary contained" id="add-rule-button" to={`/activities/${activityId}/semantic-labels/${promptId}/new`}>Add Label</Link>;
  const semanticRulesCheatSheetLink = <Link className="quill-button fun secondary outlined" rel="noopener noreferrer" target="_blank" to={`/activities/${activityId}/semantic-labels/${promptId}/semantic-rules-cheat-sheet`} >Semantic Rules Cheat Sheet</Link>;

  return(
    <section className="semantic-labels-container">
      <section className="header-container">
        <div className="button-wrapper">
          {addRuleLink}
          {semanticRulesCheatSheetLink}
        </div>
      </section>
      <DataTable
        className="semantic-labels-table"
        headers={dataTableFields}
        rows={getFormattedRows()}
      />
    </section>
  );
}

export default SemanticRulesCheatSheet
