import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom'
import { DataTable, Error, Modal, Spinner } from 'quill-component-library/dist/componentLibrary';
import RuleSetForm from './ruleSetForm';
import { getPromptsIcons } from '../../../../../helpers/comprehension';
import { ActivityRouteProps, ActivityRuleSetInterface } from '../../../interfaces/comprehensionInterfaces';
import { BECAUSE, BUT, SO, blankRuleSet } from '../../../../../constants/comprehension';
import { fetchRuleSets } from '../../../utils/comprehension/ruleSetAPIs';

const RuleSets: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId } = params;
  const [activityRuleSets, setActivityRuleSets] = React.useState<ActivityRuleSetInterface[]>([]);
  const [showAddRuleSetModal, setShowAddRuleSetModal] = React.useState<Boolean>(false);
  const [loading, setLoading] = React.useState<Boolean>(false);
  const [error, setError] = React.useState<String>(null);
  
  const handleFetchRuleSets = async () => {
    setLoading(true);
    fetchRuleSets(activityId).then((response) => {
      const { error, rulesets } = response;
      error && setError(error);
      rulesets && setActivityRuleSets(rulesets);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    handleFetchRuleSets();
  }, []);

  const formattedRows = activityRuleSets.map(rule => {
    const { name, id, prompts, rules } = rule;
    const ruleSetLink = (<Link to={`/activities/${activityId}/rulesets/${id}`}>{name}</Link>);
    const promptsIcons = getPromptsIcons(prompts);
    return {
      id: `${activityId}-${id}`,
      name: ruleSetLink,
      because_prompt: promptsIcons[BECAUSE],
      but_prompt: promptsIcons[BUT],
      so_prompt: promptsIcons[SO],
      rule_count: rules.length
    }
  });

  const submitRuleSet = () => {
    // TODO: hook into RuleSet and RegEx POST API
    toggleShowAddRuleSetModal();
  }

  const toggleShowAddRuleSetModal = () => {
    setShowAddRuleSetModal(!showAddRuleSetModal);
  }

  const renderRuleSetForm = () => {
    return(
      <Modal>
        <RuleSetForm 
          activityRuleSet={blankRuleSet} 
          closeModal={toggleShowAddRuleSetModal} 
          submitRuleSet={submitRuleSet} 
        />
      </Modal>
    );
  } 

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
    { name: "Name", attribute:"name", width: "400px" }, 
    { name: "Because", attribute:"because_prompt", width: "100px" },
    { name: "But", attribute:"but_prompt", width: "100px" },
    { name: "So", attribute:"so_prompt", width: "100px" },
    { name: "Regex Count", attribute:"rule_count", width: "80px" },
  ];

  return(
    <div className="rulesets-container">
      {showAddRuleSetModal && renderRuleSetForm()}
      <div className="header-container">
        <p>Rule Sets</p>
      </div>
      <DataTable
        className="rulesets-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={formattedRows}
      />
      <div className="button-container">
        <button className="quill-button fun primary contained" id="add-rule-button" onClick={toggleShowAddRuleSetModal} type="submit">
          Add Rule
        </button>
      </div>
    </div>
  );
}

export default RuleSets
