import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom'
import { queryCache, useQuery } from 'react-query';

import RuleSetForm from './ruleSetForm';
import SubmissionModal from '../shared/submissionModal';
import { buildErrorMessage, getPromptsIcons } from '../../../helpers/comprehension';
import { ActivityRouteProps, RegexRuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { BECAUSE, BUT, SO, blankRuleSet } from '../../../../../constants/comprehension';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { createRule, createRuleSet, fetchRuleSets } from '../../../utils/comprehension/ruleSetAPIs';
import { DataTable, Error, Modal, Spinner } from '../../../../Shared/index';

const RuleSets: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match }) => {
  const { params } = match;
  const { activityId } = params;
  const [showAddRuleSetModal, setShowAddRuleSetModal] = React.useState<boolean>(false);
  const [showSubmissionModal, setShowSubmissionModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<object>({});

  // cache ruleSets data for updates
  const { data: ruleSetsData } = useQuery({
    queryKey: [`ruleSets-${activityId}`, activityId],
    queryFn: fetchRuleSets
  });

  // get cached activity data to pass to ruleSetForm
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const formattedRows = ruleSetsData && ruleSetsData.rulesets && ruleSetsData.rulesets.map(rule => {
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

      toggleAddRuleSetModal();
      toggleSubmissionModal();
    });
  }

  const toggleAddRuleSetModal = () => {
    setShowAddRuleSetModal(!showAddRuleSetModal);
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
          closeModal={toggleAddRuleSetModal}
          ruleSetsCount={ruleSetsData && ruleSetsData.rulesets.length}
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

  if(!ruleSetsData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(ruleSetsData.error) {
    return(
      <div className="error-container">
        <Error error={`${ruleSetsData.error}`} />
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
      {showSubmissionModal && renderSubmissionModal()}
      <div className="header-container">
        <p>Rule Sets</p>
      </div>
      <DataTable
        className="rulesets-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
      <div className="button-container">
        <button className="quill-button fun primary contained" id="add-rule-button" onClick={toggleAddRuleSetModal} type="submit">
          Add Rule
        </button>
      </div>
    </div>
  );
}

export default RuleSets
