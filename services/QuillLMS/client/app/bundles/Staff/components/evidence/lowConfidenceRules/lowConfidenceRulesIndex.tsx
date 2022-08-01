import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-query';
import stripHtml from "string-strip-html";

import { titleCase } from "../../../helpers/evidence/miscHelpers";
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { promptsByConjunction } from "../../../helpers/evidence/promptHelpers";
import { getPromptIdString } from '../../../helpers/evidence/ruleHelpers';
import { ActivityRouteProps, RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { BECAUSE, BUT, SO, LOW_CONFIDENCE, DEFAULT_CONCEPT_UIDS, } from '../../../../../constants/evidence';
import { fetchRules } from '../../../utils/evidence/ruleAPIs';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { DataTable, Error, Spinner } from '../../../../Shared/index';

const LowConfidenceRulesIndex: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  const [rulePrompts, setRulePrompts] = React.useState<object>(null);
  const [promptIds, setPromptIds] = React.useState<string>(null);

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

  const { data: lowConfidenceRulesData } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${LOW_CONFIDENCE}`, null, promptIds, LOW_CONFIDENCE],
    queryFn: fetchRules
  });

  React.useEffect(() => {
    if(!rulePrompts && activityData && activityData.activity) {
      const { prompts } = activityData.activity;
      const formattedPrompts = promptsByConjunction(prompts);
      setRulePrompts(formattedPrompts);
    }
  }, [activityData]);

  function getFormattedRows(rulesData: { rules: RuleInterface[]}, conjunction) {
    if(!(rulePrompts && rulesData && rulesData.rules && rulesData.rules.length)) {
      return [];
    }
    const { rules } = rulesData;
    const filteredRule = getFilteredRule(rules, rulePrompts, conjunction);
    if(!filteredRule) {
      return [];
    }

    const { id, feedbacks } = filteredRule;
    const linkSection = {
      label: '',
      value: (<Link className="data-link" to={`/activities/${activityId}/low-confidence-rules/${id}`}>View</Link>)
    };
    const feedbacksSection = getFeedbacks(feedbacks);
    let fields: any = feedbacksSection
    fields.push(linkSection);
    return fields.map((field, i) => {
      const { label, value } = field
      return {
        id: `${i}`,
        field: label,
        value
      }
    });
  }

  function getFeedbacks(feedbacks) {
    return feedbacks.map((feedback, i) => {
      const { text } = feedback;
      return {
        label: `Feedback ${i + 1}`,
        value: stripHtml(text)
      }
    })
  }

  function renderTable(rows: any[]) {
    if(rows && !rows.length) {
      return(
        <section className="no-rules-section">
          <p>Click the button above to add a low confidence rule.</p>
        </section>
      );
    }
    return(
      <DataTable
        className="rules-table low-confidence-index-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={rows}
      />
    );
  }

  function getFilteredRule(rules: RuleInterface[], rulePrompts: any, conjunction: string) {
    return rules.filter(rule => rule.prompt_ids[0] === rulePrompts[conjunction].id)[0];
  }

  function getButtonClass(conjunction: string) {
    if(!(rulePrompts && lowConfidenceRulesData && lowConfidenceRulesData.rules)) {
      return 'disabled';
    }
    const { rules } = lowConfidenceRulesData;
    const filteredRule = getFilteredRule(rules, rulePrompts, conjunction);
    if(filteredRule) {
      return 'disabled';
    }
    return '';
  }

  function getAddRuleLink(conjunction: string, className: string) {
    const props: any = { pathname: `/activities/${activityId}/low-confidence-rules/new`, state: { ruleType: LOW_CONFIDENCE }};
    if(!rulePrompts) {
      return <Link className={className} to={props}>Add Low Confidence Rule</Link>;
    }
    if(rulePrompts[conjunction]) {
      const { id } = rulePrompts[conjunction];
      props.state.promptIds = [id];
      props.state.conceptUid = DEFAULT_CONCEPT_UIDS[conjunction]
      props.state.name = `Low Confidence Evidence - ${titleCase(conjunction)}`
      return <Link className={className} to={props}>{`Add ${titleCase(conjunction)} Low Confidence Rule`}</Link>;
    }
    return <Link className={className} to={props}>Add Low Confidence Rule</Link>;
  }

  if(!lowConfidenceRulesData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(lowConfidenceRulesData.error) {
    return(
      <div className="error-container">
        <Error error={`${lowConfidenceRulesData.error}`} />
      </div>
    );
  }

  // Header labels are redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" },
    { name: "", attribute:"value", width: "800px" }
  ];
  const becauseLowConfidenceRule = getFormattedRows(lowConfidenceRulesData, BECAUSE);
  const butLowConfidenceRule = getFormattedRows(lowConfidenceRulesData, BUT);
  const soLowConfidenceRule = getFormattedRows(lowConfidenceRulesData, SO);
  const becauseDisabled = getButtonClass(BECAUSE);
  const butDisabled = getButtonClass(BUT);
  const soDisabled = getButtonClass(SO);
  const becauseRuleLink = getAddRuleLink(BECAUSE, `quill-button fun primary contained add-rule-button ${becauseDisabled}`);
  const butRuleLink = getAddRuleLink(BUT, `quill-button fun primary contained add-rule-button ${butDisabled}`);
  const soRuleLink = getAddRuleLink(SO, `quill-button fun primary contained add-rule-button ${soDisabled}`);
  const oneRuleWarning = 'There can only be one low confidence rule per conjunction. Please click "View" below if you would like to update the feedback.'

  return(
    <div className="rules-container">
      {renderHeader(activityData, 'Low Confidence Rules')}
      <section className="low-confidence-section" id="first-low-confidence-section">
        {becauseRuleLink}
        {becauseDisabled && <p className="one-rule-warning">{oneRuleWarning}</p>}
        {renderTable(becauseLowConfidenceRule)}
      </section>
      <section className="low-confidence-section">
        {butRuleLink}
        {butDisabled && <p className="one-rule-warning">{oneRuleWarning}</p>}
        {renderTable(butLowConfidenceRule)}
      </section>
      <section className="low-confidence-section">
        {soRuleLink}
        {soDisabled && <p className="one-rule-warning">{oneRuleWarning}</p>}
        {renderTable(soLowConfidenceRule)}
      </section>
    </div>
  );
}

export default LowConfidenceRulesIndex
