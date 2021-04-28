import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-query';
import { firstBy } from 'thenby';
import stripHtml from "string-strip-html";

import { getPromptsIcons } from '../../../helpers/comprehension';
import { ActivityRouteProps, RuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import { fetchRules } from '../../../utils/comprehension/ruleAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { DataTable, Error, Spinner } from '../../../../Shared/index';

const RegexRulesIndex: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

    // get cached activity data to pass to rule
    const { data: activityData } = useQuery({
      queryKey: [`activity-${activityId}`, activityId],
      queryFn: fetchActivity
    });

  const { data: rulesBased1Data } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}`, activityId, null, 'rules-based-1'],
    queryFn: fetchRules
  });

  const { data: rulesBased2Data } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}`, activityId, null, 'rules-based-2'],
    queryFn: fetchRules
  });

  const { data: rulesBased3Data } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}`, activityId, null, 'rules-based-3'],
    queryFn: fetchRules
  });

  function getFormattedRows(rulesData) {
    if(!(rulesData && rulesData.rules && rulesData.rules.length)) {
      return [];
    }
    const formattedRows = rulesData && rulesData.rules && rulesData.rules.map((rule: RuleInterface) => {
      const { name, id, description, suborder, prompt_ids } = rule;
      const ruleLink = (<Link to={`/activities/${activityId}/rules/${id}`}>View</Link>);
      const promptsIcons = getPromptsIcons(activityData, prompt_ids);
      return {
        id: `${activityId}-${id}`,
        priority: typeof suborder === 'string' ? parseInt(suborder) : suborder,
        name,
        description: description ? stripHtml(description) : '',
        because_prompt: promptsIcons[BECAUSE],
        but_prompt: promptsIcons[BUT],
        so_prompt: promptsIcons[SO],
        view: ruleLink
      }
    });
    return formattedRows.sort(firstBy('priority').thenBy('id'));
  }

  function renderTable(rows: any[], ruleType: string) {
    if(rows && !rows.length) {
      return(
        <section className="no-rules-section">
          <p>{`No ${ruleType} Regex rules.`}</p>
        </section>
      );
    }
    return(
      <DataTable
        className="rules-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={rows}
      />
    );
  }

  if(!rulesBased1Data || !rulesBased2Data || !rulesBased3Data) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(rulesBased1Data.error) {
    return(
      <div className="error-container">
        <Error error={`${rulesBased1Data.error}`} />
      </div>
    );
  } else if(rulesBased2Data.error) {
    return(
      <div className="error-container">
        <Error error={`${rulesBased2Data.error}`} />
      </div>
    );
  } else if(rulesBased3Data.error) {
    return(
      <div className="error-container">
        <Error error={`${rulesBased3Data.error}`} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Priority", attribute:"priority", width: "100px" },
    { name: "Rule Name", attribute:"name", width: "400px" },
    { name: "Rule Description", attribute:"description", width: "400px" },
    { name: "Because", attribute:"because_prompt", width: "70px" },
    { name: "But", attribute:"but_prompt", width: "70px" },
    { name: "So", attribute:"so_prompt", width: "70px" },
    { name: "", attribute:"view", width: "70px" },
  ];
  const addRulesBased1Link = <Link to={`/activities/${activityId}/regex-rules/new`}>Add Sentence Structure Regex</Link>;
  const addRulesBased2Link = <Link to={`/activities/${activityId}/regex-rules/new`}>Add Post-Topic Regex</Link>;
  const addRulesBased3Link = <Link to={`/activities/${activityId}/regex-rules/new`}>Add Typo Regex</Link>;
  const rulesBased1Rows = getFormattedRows(rulesBased1Data);
  const rulesBased2Rows = getFormattedRows(rulesBased2Data);
  const rulesBased3Rows = getFormattedRows(rulesBased3Data);

  return(
    <div className="rules-container">
      <div className="header-container">
        <h2>Regex Rules</h2>
      </div>
      <section className="rules-based-section">
        <button className="quill-button fun primary contained add-rule-button" type="submit">{addRulesBased1Link}</button>
        {renderTable(rulesBased1Rows, 'Sentence Struture')}
      </section>
      <section className="rules-based-section">
        <button className="quill-button fun primary contained add-rule-button" type="submit">{addRulesBased2Link}</button>
        {renderTable(rulesBased2Rows, 'Post-Topic')}
      </section>
      <section className="rules-based-section">
        <button className="quill-button fun primary contained add-rule-button" type="submit">{addRulesBased3Link}</button>
        {renderTable(rulesBased3Rows, 'Typo')}
      </section>
    </div>
  );
}

export default RegexRulesIndex
