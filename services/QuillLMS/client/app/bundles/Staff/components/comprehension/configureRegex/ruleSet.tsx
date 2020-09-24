import * as React from "react";
import { queryCache, useQuery } from 'react-query'

import { buildErrorMessage, getPromptsIcons } from '../../../helpers/comprehension';
import { BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import { RegexRuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { deleteRuleSet, fetchRuleSet, fetchRuleSets, updateRuleSet, createRule, updateRule, deleteRule } from '../../../utils/comprehension/ruleSetAPIs';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import RuleSetForm from './ruleSetForm';
import SubmissionModal from '../shared/submissionModal';
import { DataTable, Error, Modal, Spinner } from '../../../../Shared/index';

const RuleSet = ({ history, match }) => {
  const { params } = match;
  const { activityId, ruleSetId } = params;
  const [showDeleteRuleSetModal, setShowDeleteRuleSetModal] = React.useState<boolean>(false);
  const [showEditRuleSetModal, setShowEditRuleSetModal] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<object>({});

  // get cached activity data to pass to ruleSetForm
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // get cached ruleSets data to pass ruleSets count to ruleSetForm
  const { data: ruleSetsData } = useQuery({
    queryKey: [`ruleSets-${activityId}`, activityId],
    queryFn: fetchRuleSets
  });

  // cache ruleSet data
  const { data: ruleSetData } = useQuery({
    queryKey: [`ruleSet-${ruleSetId}`, activityId, ruleSetId],
    queryFn: fetchRuleSet
  });

  const toggleShowEditRuleSetModal = () => {
    setShowEditRuleSetModal(!showEditRuleSetModal);
  }

  const toggleShowDeleteRuleSetModal = () => {
    setShowDeleteRuleSetModal(!showDeleteRuleSetModal);
  }

  const toggleSubmissionModal = () => {
    setShowSubmissionModal(!showSubmissionModal);
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

  const ruleSetRows = ({ ruleset }) => {
    if(!ruleset) {
      return [];
    } else {
      // format for DataTable to display labels on left side and values on right
      const { feedback, name, prompts, rules } = ruleset;
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
          value: promptsIcons ? promptsIcons[BECAUSE] : null
        },
        {
          label: "But",
          value: promptsIcons ? promptsIcons[BUT] : null
        },
        {
          label: "So",
          value: promptsIcons ? promptsIcons[SO] : null
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
  }

  const handleCreateOrUpdateRules = (rules: RegexRuleInterface[], rulesToDelete: object, rulesToUpdate: object) => {
    rules.map((rule: RegexRuleInterface, i: number) => {
      const { id } = rule;
      if(id && rulesToDelete[id]) {
        deleteRule(ruleSetId, id).then((response) => {
          const { error } = response;
          if(error) {
            let updatedErrors = errors;
            updatedErrors[`delete rule-${i} error`] = error;
            setErrors(updatedErrors);
          }
          // update ruleSet cache to remove deleted rule
          queryCache.refetchQueries(`ruleSet-${ruleSetId}`);
        });
      } else if(id && rulesToUpdate[id]) {
        updateRule(rule, ruleSetId, id).then((response) => {
          const { error } = response;
          if(error) {
            let updatedErrors = errors;
            updatedErrors[`update rule-${i} error`] = error;
            setErrors(updatedErrors);
          }
          // update ruleSet cache to display newly updated rule
          queryCache.refetchQueries(`ruleSet-${ruleSetId}`);
        });
      } else {
        createRule(rule, ruleSetId).then((response) => {
          const { error } = response;
          if(error) {
            let updatedErrors = errors;
            updatedErrors[`create rule-${i} error`] = error;
            setErrors(updatedErrors);
          }
          // update ruleSet cache to display newly created rule
          queryCache.refetchQueries(`ruleSet-${ruleSetId}`);
        });
      }
    });
  }

  const submitRuleSet = ({ ruleSet, rules, rulesToDelete, rulesToUpdate }) => {
    updateRuleSet(activityId, ruleSetId, ruleSet).then((response) => {
      const { error } = response;
      if(error) {
        let updatedErrors = errors;
        updatedErrors['update error'] = error;
        setErrors(updatedErrors);
      } else if(rules) {
        handleCreateOrUpdateRules(rules, rulesToDelete, rulesToUpdate);
      }
      // update ruleSet cache to display newly updated ruleSet
      queryCache.refetchQueries(`ruleSet-${ruleSetId}`);
    });

    toggleShowEditRuleSetModal();
    toggleSubmissionModal();
  }

  const handleDeleteRuleSet = () => {
    deleteRuleSet(activityId, ruleSetId).then((response) => {
      const { error } = response;
      if(error) {
        let updatedErrors = errors;
        updatedErrors['delete error'] = error;
        setErrors(updatedErrors);
      }
      toggleShowDeleteRuleSetModal();

      if(Object.keys(errors).length) {
        toggleSubmissionModal();
      } else {
        // update ruleSets cache to remove delete ruleSet
        queryCache.refetchQueries(`ruleSets-${activityId}`);
        history.push(`/activities/${activityId}/rulesets`);
      }
    });
  }

  const renderRuleSetForm = () => {
    return(
      <Modal>
        <RuleSetForm
          activityData={activityData && activityData.activity}
          activityRuleSet={ruleSetData && ruleSetData.ruleset}
          closeModal={toggleShowEditRuleSetModal}
          ruleSetsCount={ruleSetsData && ruleSetsData.rulesets.length}
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

  const renderSubmissionModal = () => {
    let message = 'Rule set successfully updated!';
    if(Object.keys(errors).length) {
      message = buildErrorMessage(errors);
    }
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
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

  if(ruleSetData.error) {
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
      {showSubmissionModal && renderSubmissionModal()}
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
