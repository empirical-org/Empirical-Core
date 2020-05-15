import * as React from "react";
import { Link } from 'react-router-dom'
import { DataTable, Error, Spinner } from 'quill-component-library/dist/componentLibrary';
import { getPromptsIcons } from '../../../../../helpers/comprehension'
const fetchAllRuleSetsAPI = 'https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/regex_index.json';

const RuleSets = (props) => {
  const { match } = props;
  const { params } = match;
  const { activityId } = params;
  const [activityRuleSets, setActivityRuleSets] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(fetchAllRuleSetsAPI);
      var json = await response.json();
    } catch (error) {
      setError(error);
      setLoading(false);
    }
    const { rulesets } = json
    setActivityRuleSets(rulesets);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const formattedRows = activityRuleSets.map((rule, i) => {
    const { description, id, prompts, rules } = rule;
    const activityLink = (<Link to={`/activities/${activityId}/rulesets/${id}`}>{description}</Link>);
    const promptsIcons = getPromptsIcons(prompts);
    return {
      description: activityLink,
      because_prompt: promptsIcons['because'],
      but_prompt: promptsIcons['but'],
      so_prompt: promptsIcons['so'],
      rule_count: rules.length
    }
  });

  if(loading) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(error) {
    return(
      <div className="error-container">
        <Error error={`${error}`} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Description", attribute:"description", width: "400px" }, 
    { name: "Because", attribute:"because_prompt", width: "100px" },
    { name: "But", attribute:"but_prompt", width: "100px" },
    { name: "So", attribute:"so_prompt", width: "100px" },
    { name: "Regex Count", attribute:"rule_count", width: "80px" },
  ];

  return(
    <div className="rulesets-container">
      <div className="header-container">
        <p>Rule Sets</p>
      </div>
      <DataTable
        className="rulesets-table"
        defaultSortAttribute="description"
        headers={dataTableFields}
        rows={formattedRows}
      />
      <div className="button-container">
        <button className="quill-button fun primary contained" id="add-rule-button" type="submit">Add Rule</button>
      </div>
    </div>
  );
}

export default RuleSets
