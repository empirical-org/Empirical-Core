import * as React from "react";
import { useQuery } from 'react-query';
import { Link, RouteComponentProps } from 'react-router-dom';
import stripHtml from "string-strip-html";

import { BECAUSE, BUT, PLAGIARISM, SO } from '../../../../../constants/evidence';
import { DataTable, Error, Spinner } from '../../../../Shared/index';
import { titleCase } from "../../../helpers/evidence/miscHelpers";
import { promptsByConjunction } from "../../../helpers/evidence/promptHelpers";
import { renderHeader } from "../../../helpers/evidence/renderHelpers";
import { getPromptIdString } from '../../../helpers/evidence/ruleHelpers';
import { ActivityRouteProps, RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { fetchRules } from '../../../utils/evidence/ruleAPIs';

const PlagiarismRulesIndex: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
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

  const { data: plagiarismRulesData } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}-${PLAGIARISM}`, null, promptIds, PLAGIARISM],
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

    const { id, plagiarism_texts, feedbacks } = filteredRule;
    const linkSection = {
      label: '',
      value: (<Link className="data-link" to={`/activities/${activityId}/plagiarism-rules/${id}`}>View</Link>)
    };
    const feedbacksSection = getFeedbacks(feedbacks);
    let fields: any = getPlagiarismTexts(plagiarism_texts)
    fields = fields.concat(feedbacksSection);
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

  function getPlagiarismTexts(plagiarismTexts) {
    if (plagiarismTexts.length === 0) {
      return [
        {
          label: 'Plagiarism Text - Text String 1',
          value: ''
        }
      ]
    }

    return plagiarismTexts.map((plagiarismText, i) => {
      const { text } = plagiarismText;
      return {
        label: `Plagiarism Text - Text String ${i + 1}`,
        value: stripHtml(text)
      }
    })
  }

  function renderTable(rows: any[]) {
    if(rows && !rows.length) {
      return(
        <section className="no-rules-section">
          <p>Click the button above to add a plagiarism rule.</p>
        </section>
      );
    }
    return(
      <DataTable
        className="rules-table plagiarism-index-table"
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
    if(!(rulePrompts && plagiarismRulesData && plagiarismRulesData.rules)) {
      return 'disabled';
    }
    const { rules } = plagiarismRulesData;
    const filteredRule = getFilteredRule(rules, rulePrompts, conjunction);
    if(filteredRule) {
      return 'disabled';
    }
    return '';
  }

  function getAddRuleLink(conjunction: string) {
    const props: any = { pathname: `/activities/${activityId}/plagiarism-rules/new`, state: { ruleType: PLAGIARISM }};
    if(!rulePrompts) {
      return <Link to={props}>Add Plagiarism Rule</Link>;
    }
    if(rulePrompts[conjunction]) {
      const { id } = rulePrompts[conjunction];
      props.state.promptIds = [id];
      return <Link to={props}>{`Add ${titleCase(conjunction)} Plagiarism Rule`}</Link>;
    }
    return <Link to={props}>Add Plagiarism Rule</Link>;
  }

  if(!plagiarismRulesData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(plagiarismRulesData.error) {
    return(
      <div className="error-container">
        <Error error={`${plagiarismRulesData.error}`} />
      </div>
    );
  }

  // Header labels are redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "200px" },
    { name: "", attribute:"value", width: "800px" }
  ];
  const becauseRuleLink = getAddRuleLink(BECAUSE);
  const butRuleLink = getAddRuleLink(BUT);
  const soRuleLink = getAddRuleLink(SO);
  const becausePlagiarismRule = getFormattedRows(plagiarismRulesData, BECAUSE);
  const butPlagiarismRule = getFormattedRows(plagiarismRulesData, BUT);
  const soPlagiarismRule = getFormattedRows(plagiarismRulesData, SO);
  const becauseDisabled = getButtonClass(BECAUSE);
  const butDisabled = getButtonClass(BUT);
  const soDisabled = getButtonClass(SO);
  const oneRuleWarning = 'There can only be one plagiarism rule per conjunction. Please click "View" below if you would like to update the plagiarized text.'

  return(
    <div className="rules-container">
      {renderHeader(activityData, 'Plagiarism Rules')}
      <section className="plagiarism-section" id="first-plagiarism-section">
        <button className={`quill-button fun primary contained add-rule-button ${becauseDisabled}`} type="submit">{becauseRuleLink}</button>
        {becauseDisabled && <p className="one-rule-warning">{oneRuleWarning}</p>}
        {renderTable(becausePlagiarismRule)}
      </section>
      <section className="plagiarism-section">
        <button className={`quill-button fun primary contained add-rule-button ${butDisabled}`} type="submit">{butRuleLink}</button>
        {butDisabled && <p className="one-rule-warning">{oneRuleWarning}</p>}
        {renderTable(butPlagiarismRule)}
      </section>
      <section className="plagiarism-section">
        <button className={`quill-button fun primary contained add-rule-button ${soDisabled}`} type="submit">{soRuleLink}</button>
        {soDisabled && <p className="one-rule-warning">{oneRuleWarning}</p>}
        {renderTable(soPlagiarismRule)}
      </section>
    </div>
  );
}

export default PlagiarismRulesIndex
