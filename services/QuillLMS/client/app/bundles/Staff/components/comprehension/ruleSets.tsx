import * as React from "react";
import { Link } from 'react-router-dom'
import { DataTable, Error, Spinner } from 'quill-component-library/dist/componentLibrary';
import { promptStems } from '../../../../constants/comprehension'
const quillCheckmark = `https://assets.quill.org/images/icons/check-circle-small.svg`;
// const quillCheckmark = `${process.env.QUILL_CDN_URL}/images/icons/check-circle-small.svg`;
const fetchAllRuleSetsAPI = 'https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/regex_index.json';

const RuleSets = (props) => {
  const { match } = props;
  const { params } = match;
  const { activityId } = params;
  const [ruleSets, setRuleSets] = React.useState([]);
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
    const { regex_entries } = json
    setRuleSets(regex_entries);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const getPromptsIcons = (prompts) => {
    const icons = {};
    prompts.forEach(prompt => {
      const { conjunction } = prompt;
      if(promptStems.includes(conjunction)) {
        icons[conjunction] = (<img alt="quill-circle-checkmark" src={quillCheckmark} />)
      } else {
        icons[conjunction] = (<div />);
      }
    });
    return icons;
  }

  const formattedRows = ruleSets.map((rule, i) => {
    const { description, id, prompts, regex_script } = rule;
    const activityLink = (<Link to={`/activities/${activityId}/rulesets/${id}`}>{description}</Link>);
    const promptsIcons = getPromptsIcons(prompts);
    return {
      description: activityLink,
      because_prompt: promptsIcons['because'],
      but_prompt: promptsIcons['but'],
      so_prompt: promptsIcons['so'],
      rule_count: regex_script.length
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
