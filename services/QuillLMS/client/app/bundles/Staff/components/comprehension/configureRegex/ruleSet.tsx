import * as React from "react";
import { DataTable, Error, Modal, Spinner } from 'quill-component-library/dist/componentLibrary';
import { getPromptsIcons } from '../../../../../helpers/comprehension';
import RuleSetForm from './ruleSetForm';
const fetchRuleSetAPI = 'https://comprehension-dummy-data.s3.us-east-2.amazonaws.com/activities/regex-1.json';

const RuleSet = (props) => {
  const [activityRuleSet, setActivityRuleSet] = React.useState({});
  const [showEditRuleSetModal, setShowEditRuleSetModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(fetchRuleSetAPI);
      var ruleSet = await response.json();
    } catch (error) {
      setError(error);
      setLoading(false);
    }
    setActivityRuleSet(ruleSet);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const toggleShowEditRuleSetModal = () => {
    setShowEditRuleSetModal(!showEditRuleSetModal);
  }


  const getRegexRules = (rules) => {
    return rules.map(rule => {
      const { regex_text } = rule;
      return {
        label: 'Regex Rule',
        value: regex_text
      }
    });
  }

  const ruleSetRows = (activityRuleSet) => {
    // format for DataTable to display labels on left side and values on right
    const { description, feedback, prompts, rules } = activityRuleSet
    const promptsIcons = prompts && getPromptsIcons(prompts);
    const regexRules = rules && getRegexRules(rules);
    let fields = [
      { 
        label: 'Description',
        value: description 
      },
      {
        label: 'Feedback',
        value: feedback
      },
      {
        label: "Because",
        value: promptsIcons ? promptsIcons['because'] : null
      },
      {
        label: "But",
        value: promptsIcons ? promptsIcons['but'] : null
      },
      {
        label: "So",
        value: promptsIcons ? promptsIcons['so'] : null
      },
    ];
    if(regexRules) {
      fields = fields.concat(regexRules);
    }
    return fields.map(field => {
      const { label, value } = field
      return {
        field: label,
        value
      }
    });
  }

  const submitRuleSet = () => {
    // TODO: hook into RuleSet PUT API
    toggleShowEditRuleSetModal();
  }

  const renderRuleSetForm = () => {
    return(
      <Modal>
        <RuleSetForm activityRuleSet={activityRuleSet} closeModal={toggleShowEditRuleSetModal} submitRuleSet={submitRuleSet} />
      </Modal>
    );
  } 

  // The header labels felt redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "180px" }, 
    { name: "", attribute:"value", width: "600px" }
  ];

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

  return(
    <div className="ruleset-container">
      {showEditRuleSetModal && renderRuleSetForm()}
      <div className="header-container">
        <p>Rule Set</p>
      </div>
      <DataTable
        className="ruleset-table"
        headers={dataTableFields}
        rows={ruleSetRows(activityRuleSet)}
      />
      <div className="button-container">
        <button className="quill-button fun primary contained" id="edit-ruleset-button" onClick={toggleShowEditRuleSetModal} type="submit">
          Configure
        </button>
      </div>
    </div>
  );
}

export default RuleSet
