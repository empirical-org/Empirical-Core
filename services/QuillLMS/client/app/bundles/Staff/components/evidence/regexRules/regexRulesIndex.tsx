import * as React from "react";
import { useQuery, useQueryClient } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import { firstBy } from 'thenby';

import { BECAUSE, BUT, RULES_BASED_1, RULES_BASED_2, RULES_BASED_3, SO } from '../../../../../constants/evidence';
import { DataTable, Error, Spinner } from '../../../../Shared/index';
import { getPromptsIcons } from '../../../helpers/evidence/promptHelpers';
import { renderHeader } from '../../../helpers/evidence/renderHelpers';
import { ActivityRouteProps, RegexRuleInterface, RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchRules, updateRuleOrders, } from '../../../utils/evidence/ruleAPIs';

const RegexRulesIndex: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId } = params;
  const [regexOneLoading, setRegexOneLoading] = React.useState<boolean>(false);
  const [regexTwoLoading, setRegexTwoLoading] = React.useState<boolean>(false);
  const [regexThreeLoading, setRegexThreeLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient()

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const { data: rulesBased1Data } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${RULES_BASED_1}`, activityId, null, RULES_BASED_1],
    queryFn: fetchRules
  });

  const { data: rulesBased2Data } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${RULES_BASED_2}`, activityId, null, RULES_BASED_2],
    queryFn: fetchRules
  });

  const { data: rulesBased3Data } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${RULES_BASED_3}`, activityId, null, RULES_BASED_3],
    queryFn: fetchRules
  });

  function setRegexIsLoading(ruleType, isLoading) {
    if (ruleType === RULES_BASED_1) {
      setRegexOneLoading(isLoading)
    } else if (ruleType === RULES_BASED_2) {
      setRegexTwoLoading(isLoading)
    } else {
      setRegexThreeLoading(isLoading)
    }
  }

  function getRegexIsLoading(ruleType) {
    if (ruleType === RULES_BASED_1) {
      return regexOneLoading
    } else if (ruleType === RULES_BASED_2) {
      return regexTwoLoading
    } else {
      return regexThreeLoading
    }
  }

  function handleReorder(sortInfo, ruleType) {
    setRegexIsLoading(ruleType, true)
    const idsInOrder = sortInfo.map(item => item.key)
    updateRuleOrders(idsInOrder).then((response) => {
      queryClient.refetchQueries([`rules-${activityId}-${ruleType}`]).then((response) => {
        setRegexIsLoading(ruleType, false)
      })
    });
  }

  function getFormattedRows(rulesData: { rules: RuleInterface[]}) {
    if(!(rulesData && rulesData.rules && rulesData.rules.length)) {
      return [];
    }
    const formattedRows = rulesData && rulesData.rules && rulesData.rules.map((rule: RuleInterface) => {
      const { name, id, regex_rules, suborder, prompt_ids } = rule;
      const nameLink = (<Link to={`/activities/${activityId}/regex-rules/${id}`}>{name}</Link>);
      const promptsIcons = getPromptsIcons(activityData, prompt_ids);

      // for priority, return a 1-indexed suborder instead of 0-indexed for human readability
      return {
        id,
        priority: typeof suborder === 'string' ? (parseInt(suborder) + 1) : (suborder + 1),
        name: nameLink,
        incorrect_sequence: renderRegexTags(regex_rules, 'incorrect'),
        required_sequence: renderRegexTags(regex_rules, 'required'),
        because_prompt: promptsIcons[BECAUSE],
        but_prompt: promptsIcons[BUT],
        so_prompt: promptsIcons[SO],
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

  function renderTable(rows: any[], ruleTypeHumanReadable: string, ruleTypeForEndpoint: string) {
    if(rows && !rows.length) {
      return(
        <section className="no-rules-section">
          <p>{`No ${ruleTypeHumanReadable} Regex rules.`}</p>
        </section>
      );
    } else if (getRegexIsLoading(ruleTypeForEndpoint)) {
      return(
        <div className="loading-spinner-container">
          <Spinner />
        </div>
      );
    }
    return(
      <DataTable
        className="rules-table regex-index-table"
        defaultSortAttribute="priority"
        headers={dataTableFields}
        isReorderable={true}
        reorderCallback={(sortInfo) => handleReorder(sortInfo, ruleTypeForEndpoint)}
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
      <a className="quill-button-archived fun secondary outlined focus-on-light play-activity-button" href={`/evidence/#/play?uid=${activityId}&skipToPrompts=true`} rel="noopener noreferrer" target="_blank">Play Test Activity</a>
      <section className="rules-based-section">
        <button className="quill-button-archived fun primary contained add-rule-button" type="submit">{addRulesBased1Link}</button>
        {renderTable(rulesBased1Rows, 'Sentence Structure', RULES_BASED_1)}
      </section>
      <section className="rules-based-section">
        <button className="quill-button-archived fun primary contained add-rule-button" type="submit">{addRulesBased2Link}</button>
        {renderTable(rulesBased2Rows, 'Post-Topic', RULES_BASED_2)}
      </section>
      <section className="rules-based-section">
        <button className="quill-button-archived fun primary contained add-rule-button" type="submit">{addRulesBased3Link}</button>
        {renderTable(rulesBased3Rows, 'Typo', RULES_BASED_3)}
      </section>
    </div>
  );
}

export default RegexRulesIndex
