import * as React from "react";
import { DataTable, Error, Modal, Spinner } from 'quill-component-library/dist/componentLibrary';
import { getPromptsIcons } from '../../../../../helpers/comprehension';
import { ActivityRuleSetInterface, RegexRuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { blankRuleSet } from '../../../../../constants/comprehension';
import { fetchRuleSet } from '../../../utils/comprehension/ruleSetAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import RuleSetForm from './ruleSetForm';
import useSWR from 'swr';

const RuleSet = ({ match }) => {
  const { params } = match;
  const { activityId, ruleSetId } = params;
  const [activityRuleSet, setActivityRuleSet] = React.useState<ActivityRuleSetInterface>(blankRuleSet);
  const [showEditRuleSetModal, setShowEditRuleSetModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>(null);

  // get cached activity data 
  const { data } = useSWR(activityId, fetchActivity);

  const handleFetchRuleSet = async () => {
    setLoading(true);
    fetchRuleSet(activityId, ruleSetId).then((response) => {
      const { error, ruleset } = response;
      error && setError(error);
      ruleset && setActivityRuleSet(ruleset);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    handleFetchRuleSet();
  }, []);

  const toggleShowEditRuleSetModal = () => {
    setShowEditRuleSetModal(!showEditRuleSetModal);
  }

  const getRegexRules = (rules: RegexRuleInterface[]) => {
    return rules.map(rule => {
      const { regex_text } = rule;
      return {
        label: 'Regex Rule',
        value: regex_text
      }
    });
  }

  const ruleSetRows = (activityRuleSet: ActivityRuleSetInterface) => {
    // format for DataTable to display labels on left side and values on right
    const { feedback, name, prompts, rules } = activityRuleSet
    const promptsIcons = prompts && getPromptsIcons(prompts);
    const regexRules = rules && getRegexRules(rules);
    let fields = [
      { 
        label: 'Name',
        value: name 
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
    return fields.map((field, i) => {
      const { label, value } = field
      return {
        id: `${label}-${i}`,
        field: label,
        value
      }
    });
  }

  const submitRuleSet = (ruleSet: ActivityRuleSetInterface) => {
    // TODO: hook into RuleSet and RegEx PUT API
    toggleShowEditRuleSetModal();
  }

  const renderRuleSetForm = () => {
    return(
      <Modal>
        <RuleSetForm 
          activityData={data && data.activity}
          activityRuleSet={activityRuleSet} 
          closeModal={toggleShowEditRuleSetModal} 
          submitRuleSet={submitRuleSet} 
        />
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
        <button className="quill-button fun primary contained" id="edit-ruleset-button" onClick={toggleShowEditRuleSetModal} type="button">
          Configure
        </button>
      </div>
    </div>
  );
}

export default RuleSet
