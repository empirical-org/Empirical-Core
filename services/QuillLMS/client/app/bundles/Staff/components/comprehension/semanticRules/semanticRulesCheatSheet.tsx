import * as React from "react";
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query';

import { fetchRules } from '../../../utils/comprehension/ruleAPIs';
import { DataTable, Spinner } from '../../../../Shared/index';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';

const SemanticRulesCheatSheet = ({ match, }) => {
  const { params } = match;
  const { activityId } = params;
  const { promptId } = params;

  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

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
      const { name, id, feedbacks, note, } = rule;
      const ruleLink = (
        <Link className="quill-button fun contained primary" rel="noopener noreferrer" target="_blank" to={{ pathname: `/activities/${activityId}/semantic-labels/${promptId}/${id}`, state: { rule: rule } }}>Edit Rule</Link>
      );
      return {
        id: id,
        name: <div dangerouslySetInnerHTML={{ __html: name }} />,
        firstLayerFeedback: <div dangerouslySetInnerHTML={{ __html: feedbacks[0].text }} />,
        note: <div dangerouslySetInnerHTML={{ __html: note }} />,
        edit: ruleLink
      }
    });
    return formattedRows
  }

  if(!rulesData || !activityData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Rule Name", attribute:"name", noTooltip: true, width: "200px" },
    { name: "Rule Notes", attribute:"note", noTooltip: true, width: "300px" },
    { name: "Rule Feedback - 1st Layer", attribute:"firstLayerFeedback", noTooltip: true, width: "300px" },
    { name: "", attribute:"edit", width: "70px", noTooltip: true }
  ];

  const prompt = activityData.activity.prompts.find(p => String(p.id) === promptId)

  return(
    <section className="semantic-labels-container">
      <h3>Semantic Rules Cheat Sheet</h3>
      <h4 dangerouslySetInnerHTML={{ __html: `Prompt: ${prompt.text.replace(prompt.conjunction, `<b>${prompt.conjunction}</b>`)}`}} />
      <DataTable
        className="semantic-rules-cheat-sheet"
        headers={dataTableFields}
        rows={getFormattedRows()}
      />
    </section>
  );
}

export default SemanticRulesCheatSheet
