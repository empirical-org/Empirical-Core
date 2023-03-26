import * as React from "react";
import { useQuery, useQueryClient } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import { firstBy } from 'thenby';

import { BECAUSE, BUT, RULES_BASED_1, RULES_BASED_2, RULES_BASED_3, SO } from '../../../../../constants/evidence';
import { DataTable, Error, Spinner } from '../../../../Shared/index';
import { getPromptsIcons } from '../../../helpers/evidence/promptHelpers';
import { renderHeader } from '../../../helpers/evidence/renderHelpers';
import { getPromptIdString } from '../../../helpers/evidence/ruleHelpers';
import { ActivityRouteProps, RegexRuleInterface, RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchRules, updateRuleOrders } from '../../../utils/evidence/ruleAPIs';

const RegexRulesIndex: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  const [promptIds, setPromptIds] = React.useState<string>(null);

  const queryClient = useQueryClient()

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  React.useEffect(() => {
    if(!promptIds && activityData && activityData.activity) {
      const { prompts } = activityData.activity;
      const promptIdString = getPromptIdString(prompts);
      setPromptIds(promptIdString);
    }
  }, [activityData]);

  const { data: rulesBased1Data } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${RULES_BASED_1}`, null, promptIds, RULES_BASED_1],
    queryFn: fetchRules
  });

  const { data: rulesBased2Data } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${RULES_BASED_2}`, null, promptIds, RULES_BASED_2],
    queryFn: fetchRules
  });

  const { data: rulesBased3Data } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${RULES_BASED_3}`, null, promptIds, RULES_BASED_3],
    queryFn: fetchRules
  });

  function handleReorder(sortInfo) {
    const idsInOrder = sortInfo.map(item => item.key)
    updateRuleOrders(idsInOrder).then((response) => {
      queryClient.refetchQueries([`rules-${activityId}-${RULES_BASED_1}`])
      queryClient.refetchQueries([`rules-${activityId}-${RULES_BASED_2}`])
      queryClient.refetchQueries([`rules-${activityId}-${RULES_BASED_3}`])
    });
  }

  function getFormattedRows(rulesData: { rules: RuleInterface[]}) {
    if(!(rulesData && rulesData.rules && rulesData.rules.length)) {
      return [];
    }
    const formattedRows = rulesData && rulesData.rules && rulesData.rules.map((rule: RuleInterface) => {
      const { name, id, regex_rules, suborder, prompt_ids } = rule;
      const ruleLink = (<Link to={`/activities/${activityId}/regex-rules/${id}`}>View</Link>);
      const promptsIcons = getPromptsIcons(activityData, prompt_ids);
      return {
        id,
        priority: typeof suborder === 'string' ? parseInt(suborder) : suborder,
        name,
        incorrect_sequence: renderRegexTags(regex_rules, 'incorrect'),
        required_sequence: renderRegexTags(regex_rules, 'required'),
        because_prompt: promptsIcons[BECAUSE],
        but_prompt: promptsIcons[BUT],
        so_prompt: promptsIcons[SO],
        view: ruleLink
      }
    });
    return formattedRows.sort(firstBy('priority').thenBy('id'));
  }

  function renderRegexTags(regexRules: RegexRuleInterface[], sequenceType: string) {
    const regexRulesByType = regexRules.filter(rule => rule.sequence_type === sequenceType);
    return(
      <div className="regex-text-container">
        {regexRulesByType.map((rule: RegexRuleInterface) => {
          return <div className={`regex-text-object ${sequenceType}`} key={rule.id}>{rule.regex_text}</div>
        })}
      </div>
    );
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
        className="rules-table regex-index-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        isReorderable={true}
        reorderCallback={handleReorder}
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
    { name: "Priority", attribute:"priority", width: "50px" },
    { name: "Rule Name", attribute:"name", width: "300px" },
    { name: "Required Sequence", attribute:"required_sequence", width: "250px" },
    { name: "Incorrect Sequence", attribute:"incorrect_sequence", width: "250px" },
    { name: "Because", attribute:"because_prompt", width: "50px" },
    { name: "But", attribute:"but_prompt", width: "50px" },
    { name: "So", attribute:"so_prompt", width: "50px" },
    { name: "", attribute:"view", width: "50px" },
  ];
  const addRulesBased1Link = <Link to={{ pathname: `/activities/${activityId}/regex-rules/new`, state: { ruleType: RULES_BASED_1 }}}>Add Sentence Structure Regex Rule</Link>;
  const addRulesBased2Link = <Link to={{ pathname: `/activities/${activityId}/regex-rules/new`, state: { ruleType: RULES_BASED_2 }}}>Add Post-Topic Regex Rule</Link>;
  const addRulesBased3Link = <Link to={{ pathname: `/activities/${activityId}/regex-rules/new`, state: { ruleType: RULES_BASED_3 }}}>Add Typo Regex Rule</Link>;
  const rulesBased1Rows = getFormattedRows(rulesBased1Data);
  const rulesBased2Rows = getFormattedRows(rulesBased2Data);
  const rulesBased3Rows = getFormattedRows(rulesBased3Data);

  return(
    <div className="rules-container">
      {renderHeader(activityData, 'Regex Rules')}
      <a className="quill-button fun secondary outlined focus-on-light play-activity-button" href={`/evidence/#/play?uid=${activityId}&skipToPrompts=true`} rel="noopener noreferrer" target="_blank">Play Test Activity</a>
      <section className="rules-based-section">
        <button className="quill-button fun primary contained add-rule-button" type="submit">{addRulesBased1Link}</button>
        {renderTable(rulesBased1Rows, 'Sentence Structure')}
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
