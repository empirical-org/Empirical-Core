import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom'
import { queryCache, useQuery } from 'react-query';

import RuleSetForm from './ruleSetForm';

import SubmissionModal from '../shared/submissionModal';
import { buildErrorMessage, getPromptsIcons, getUniversalIcon } from '../../../helpers/comprehension';
import { ActivityRouteProps, RegexRuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { BECAUSE, BUT, SO, blankRuleSet } from '../../../../../constants/comprehension';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { createRule, createRuleSet, fetchRules } from '../../../utils/comprehension/ruleSetAPIs';
import { DataTable, Error, Modal, Spinner } from '../../../../Shared/index';

const Rules: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId } = params;
  const [showAddRuleModal, setShowAddRuleModal] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<object>({});

  // cache ruleSets data for updates
  const { data: rulesData } = useQuery({
    queryKey: [`rules-${activityId}`, activityId],
    queryFn: fetchRules
  });

  // get cached activity data to pass to ruleSetForm
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  function handleGetPromptsIcons(promptIds: number[]) {
    if(activityData && activityData.activity && activityData.activity.prompts) {
      const { activity } = activityData;
      const { prompts } = activity;
      const attachedPrompts = prompts.filter(prompt => promptIds.includes(prompt.id));
      return getPromptsIcons(attachedPrompts);
    }
    return getPromptsIcons(null);
  }

  const formattedRows = rulesData && rulesData.rules && rulesData.rules.map(rule => {
    const { name, id, rule_type, universal, suborder, prompt_ids } = rule;
    const ruleLink = (<Link to={`/activities/${activityId}/rules/${id}`}>{name}</Link>);
    const promptsIcons = handleGetPromptsIcons(prompt_ids);
    return {
      id: `${activityId}-${id}`,
      type: rule_type,
      name: ruleLink,
      because_prompt: promptsIcons[BECAUSE],
      but_prompt: promptsIcons[BUT],
      so_prompt: promptsIcons[SO],
      universal: getUniversalIcon(universal),
      suborder: suborder
    }
  });

  const handleRuleCreation = (rules: RegexRuleInterface[], ruleSetId: string) => {
    rules.map((rule: RegexRuleInterface, i: number) => {
      createRule(rule, ruleSetId).then((response) => {
        const { error } = response;
        if(error) {
          let updatedErrors = errors;
          updatedErrors[`rule-${i}`] = error;
          setErrors(updatedErrors);
        }
      });
    });
  }

  const submitRuleSet = ({ ruleSet }) => {
    createRuleSet(activityId, ruleSet).then((response) => {
      const { error, rules, ruleSetId } = response;
      if(error) {
        let updatedErrors = errors;
        updatedErrors['ruleSetError'] = error;
        setErrors(updatedErrors);
      } else if(rules && rules.length && ruleSetId) {
        handleRuleCreation(rules, ruleSetId);
      }
      // update ruleSets cache to display newly created ruleSet
      queryCache.refetchQueries(`ruleSets-${activityId}`);

      toggleAddRuleModal();
      toggleSubmissionModal();
    });
  }

  const toggleAddRuleModal = () => {
    setShowAddRuleModal(!showAddRuleModal);
  }

  const toggleSubmissionModal = () => {
    setShowSubmissionModal(!showSubmissionModal);
  }

  const renderRuleSetForm = () => {
    return(
      <Modal>
        <RuleSetForm
          activityData={activityData && activityData.activity}
          activityRuleSet={blankRuleSet}
          closeModal={toggleAddRuleModal}
          ruleSetsCount={rulesData && rulesData.rules.length}
          submitRuleSet={submitRuleSet}
        />
      </Modal>
    );
  }

  const renderSubmissionModal = () => {
    let message = 'Rule set successfully created!';
    if(Object.keys(errors).length) {
      message = buildErrorMessage(errors);
    }
    return <SubmissionModal close={toggleSubmissionModal} message={message} />;
  }

  if(!rulesData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(rulesData.error) {
    return(
      <div className="error-container">
        <Error error={`${rulesData.error}`} />
      </div>
    );
  }

  const dataTableFields = [
    { name: "Type", attribute:"type", width: "100px" },
    { name: "Name", attribute:"name", width: "400px" },
    { name: "Because", attribute:"because_prompt", width: "70px" },
    { name: "But", attribute:"but_prompt", width: "70px" },
    { name: "So", attribute:"so_prompt", width: "70px" },
    { name: "Universal?", attribute:"universal", width: "70px" },
    { name: "Sub Order", attribute:"suborder", width: "70px" },
  ];

  return(
    <div className="rules-container">
      {showAddRuleModal && renderRuleSetForm()}
      {showSubmissionModal && renderSubmissionModal()}
      <div className="header-container">
        <p>Rules</p>
      </div>
      <DataTable
        className="rules-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
      <div className="button-container">
        <button className="quill-button fun primary contained" id="add-rule-button" onClick={toggleAddRuleModal} type="submit">
          Add Rule
        </button>
      </div>
    </div>
  );
}

export default Rules
