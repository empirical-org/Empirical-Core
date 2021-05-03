import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-query';
import stripHtml from "string-strip-html";

import { promptsByConjunction } from "../../../helpers/comprehension";
import { ActivityRouteProps, RuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import { fetchRules } from '../../../utils/comprehension/ruleAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { DataTable, Error, Spinner } from '../../../../Shared/index';

const PlagiarismRulesIndex: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId } = params;

  const [rulePrompts, setRulePrompts] = React.useState<object>(null);

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const { data: plagiarismRulesData } = useQuery({
    // cache rules data for updates
    queryKey: [`rules-${activityId}`, activityId, null, 'plagiarism'],
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
    const filteredRule = rulesData.rules.filter(rule => rule.prompt_ids[0] === rulePrompts[conjunction].id)[0];
    if(!filteredRule) {
      return [];
    }
    const { id, plagiarism_text, feedbacks } = filteredRule;
    const linkSection = {
      label: '',
      value: (<Link to={`/activities/${activityId}/plagiarism-rules/${id}`}>View</Link>)
    };
    const feedbacksSection = getFeedbacks(feedbacks);
    let fields: any = [
      {
        label: 'Plagiarism Text',
        value: plagiarism_text.text
      }
    ];
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

  function renderTable(rows: any[], conjunction: string) {
    if(rows && !rows.length) {
      return(
        <section className="no-rules-section">
          <p>{`No ${conjunction} plagiarism rule.`}</p>
        </section>
      );
    }
    return(
      <DataTable
        className="rules-table regex-index-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={rows}
      />
    );
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
    { name: "", attribute:"value", width: "400px" }
  ];
  const addRuleLink = <Link to={{ pathname: `/activities/${activityId}/plagiarism-rules/new`, state: { ruleType: 'plagiarism' }}}>Add Plagiarism Rule</Link>;
  const becausePlagiarismRule = getFormattedRows(plagiarismRulesData, BECAUSE);
  const butPlagiarismRule = getFormattedRows(plagiarismRulesData, BUT);
  const soPlagiarismRule = getFormattedRows(plagiarismRulesData, SO);

  return(
    <div className="rules-container">
      <section className="rules-based-section">
        <button className="quill-button fun primary contained add-rule-button" type="submit">{addRuleLink}</button>
        {renderTable(becausePlagiarismRule, BECAUSE)}
      </section>
      <section className="rules-based-section">
        <button className="quill-button fun primary contained add-rule-button" type="submit">{addRuleLink}</button>
        {renderTable(butPlagiarismRule, BUT)}
      </section>
      <section className="rules-based-section">
        <button className="quill-button fun primary contained add-rule-button" type="submit">{addRuleLink}</button>
        {renderTable(soPlagiarismRule, SO)}
      </section>
    </div>
  );
}

export default PlagiarismRulesIndex
