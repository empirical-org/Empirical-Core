import * as React from "react";
import { DataTable, Error, Modal, Spinner } from 'quill-component-library/dist/componentLibrary';
import { getPromptsIcons } from '../../../../../helpers/comprehension';
import { ActivityRuleSetInterface, RegexRuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { blankRuleSet } from '../../../../../constants/comprehension';
import { deleteRuleSet, fetchRuleSet } from '../../../utils/comprehension/ruleSetAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import RuleSetForm from './ruleSetForm';
import { queryCache, useQuery } from 'react-query'

const RuleSet = ({ history, match }) => {
  const { params } = match;
  const { activityId, ruleSetId } = params;
  const [showDeleteRuleSetModal, setShowDeleteRuleSetModal] = React.useState<boolean>(false);
  const [showEditRuleSetModal, setShowEditRuleSetModal] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  // get cached activity data to pass to ruleSetForm 
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache ruleSet data 
  const { data: ruleSetData } = useQuery({
    queryKey: [`ruleSet-${activityId}`, activityId, ruleSetId],
    queryFn: fetchRuleSet
  });

  const toggleShowEditRuleSetModal = () => {
    setShowEditRuleSetModal(!showEditRuleSetModal);
  }

  const toggleShowDeleteRuleSetModal = () => {
    setShowDeleteRuleSetModal(!showDeleteRuleSetModal);
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

  const ruleSetRows = (ruleSetData) => {
    if(ruleSetData && ruleSetData.ruleset) {
      // format for DataTable to display labels on left side and values on right
      const { feedback, name, prompts, rules } = ruleSetData.ruleset;
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
    } else {
      return [];
    }
  }

  const submitRuleSet = (ruleSet: ActivityRuleSetInterface) => {
    // TODO: hook into RuleSet and RegEx PUT API
    toggleShowEditRuleSetModal();
  }

  const handleDeleteRuleSet = () => {
    deleteRuleSet(activityId, ruleSetId).then((response) => {
      const { error } = response;
      error && setError(error);
      toggleShowDeleteRuleSetModal();

      // update ruleSets cache to remove delete ruleSet
      queryCache.refetchQueries(`ruleSets-${activityId}`);
      history.push(`/activities/${activityId}/rulesets`);
    });
  }

  const renderRuleSetForm = () => {
    return(
      <Modal>
        <RuleSetForm 
          activityData={activityData && activityData.activity}
          activityRuleSet={ruleSetData && ruleSetData.ruleset} 
          closeModal={toggleShowEditRuleSetModal} 
          submitRuleSet={submitRuleSet} 
        />
      </Modal>
    );
  } 

  const renderDeleteRuleSetModal = () => {
    return(
      <Modal>
        <div className="delete-ruleset-container">
          <p className="delete-ruleset-text">Are you sure that you want to delete this ruleset?</p>
          <div className="delete-ruleset-button-container">
            <button className="quill-button fun primary contained" id="delete-ruleset-button" onClick={handleDeleteRuleSet} type="button">
              Delete
            </button>
            <button className="quill-button fun primary contained" id="close-ruleset-modal-button" onClick={toggleShowDeleteRuleSetModal} type="button">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  // The header labels felt redundant so passing empty strings and hiding header display
  const dataTableFields = [
    { name: "", attribute:"field", width: "180px" }, 
    { name: "", attribute:"value", width: "600px" }
  ];

  if(!ruleSetData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(ruleSetData && ruleSetData.error) {
    return(
      <div className="error-container">
        <Error error={`${ruleSetData.error}`} />
      </div>
    );
  }

  return(
    <div className="ruleset-container">
      {showDeleteRuleSetModal && renderDeleteRuleSetModal()}
      {showEditRuleSetModal && renderRuleSetForm()}
      <div className="header-container">
        <p>Rule Set</p>
      </div>
      <DataTable
        className="ruleset-table"
        headers={dataTableFields}
        rows={ruleSetRows(ruleSetData)}
      />
      <div className="button-container">
        <button className="quill-button fun primary contained" id="edit-ruleset-button" onClick={toggleShowEditRuleSetModal} type="button">
          Configure
        </button>
        <button className="quill-button fun primary contained" id="delete-ruleset-button" onClick={toggleShowDeleteRuleSetModal} type="button">
          Delete
        </button>
      </div>
    </div>
  );
}

export default RuleSet
