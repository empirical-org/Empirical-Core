import * as React from "react";
import { Link } from 'react-router-dom';
import { useQueryClient, useQuery } from 'react-query';
import { firstBy } from "thenby";

import RuleViewForm from './ruleViewForm';

import { getConceptName, getPromptIdString } from '../../../helpers/evidence/ruleHelpers';
import { getPromptsIcons } from '../../../helpers/evidence/promptHelpers';
import { RuleInterface, PromptInterface } from '../../../interfaces/evidenceInterfaces';
import { BECAUSE, BUT, SO, blankRule, ruleApiOrder } from '../../../../../constants/evidence';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { createRule, fetchRules, updateRule } from '../../../utils/evidence/ruleAPIs';
import { fetchConcepts, } from '../../../utils/evidence/conceptAPIs';
import { DataTable, Error, Modal, Spinner } from '../../../../Shared/index';

function sortByRuleApiOrder(ruleOneRuleType: string, ruleTwoRuleType: string) {
  return ruleApiOrder.indexOf(ruleOneRuleType) - ruleApiOrder.indexOf(ruleTwoRuleType);
}

interface RulesProps {
  activityId: string,
  history: any,
  prompt: PromptInterface
}

const Rules = ({ activityId, history, prompt }: RulesProps) => {
  const promptIdsForApi = prompt ? getPromptIdString(prompt) : '';
  const [showAddRuleModal, setShowAddRuleModal] = React.useState<boolean>(false);
  const [showEditRuleModal, setShowEditRuleModal] = React.useState<boolean>(false);
  const [ruleToEdit, setRuleToEdit] = React.useState<RuleInterface>(null);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [sortedRules, setSortedRules] = React.useState<[]>(null);

  const queryClient = useQueryClient()

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache rules data for updates
  const { data: rulesData } = useQuery({
    queryKey: [`rules-${activityId}`, activityId, promptIdsForApi],
    queryFn: fetchRules
  });

  const { data: conceptsData } = useQuery({
    queryKey: ['concepts', activityId],
    queryFn: fetchConcepts
  });

  React.useEffect(() => {
    if(rulesData && rulesData.rules) {
      const { rules } = rulesData;
      const multiSortRules = rules.sort(
        firstBy("rule_type", { cmp: sortByRuleApiOrder, direction: "asc" })
          .thenBy('prompt_ids')
          .thenBy('suborder')
      );
      setSortedRules(multiSortRules);
    }
  }, [rulesData]);

  const formattedRows = sortedRules && sortedRules.map((rule: RuleInterface, i: number) => {
    const { name, id, rule_type, prompt_ids, feedbacks, concept_uid, universal } = rule;
    const viewRuleLink = (<Link className="data-link" to={`/activities/${activityId}/rules/${id}`}><p className="word-wrap">{name}</p></Link>);
    /* eslint-disable-next-line react/jsx-no-bind, jsx-a11y/anchor-is-valid */
    const editRuleLink = (<button onClick={() => handleEditRule(rule)} type="button"><a className="data-link">Edit</a></button>);
    const promptsIcons = getPromptsIcons(activityData, prompt_ids);
    const firstFeedback = feedbacks && feedbacks[0] ? <p className="word-wrap" dangerouslySetInnerHTML={{__html: feedbacks[0].text }} /> : 'N/A'
    const secondFeedback = feedbacks && feedbacks[1] ? <p className="word-wrap" dangerouslySetInnerHTML={{__html: feedbacks[1].text }} /> : 'N/A'
    return {
      id: `${activityId}-${id}`,
      type: rule_type,
      name: viewRuleLink,
      first_feedback: firstFeedback,
      second_feedback: secondFeedback,
      because_prompt: promptsIcons[BECAUSE],
      but_prompt: promptsIcons[BUT],
      so_prompt: promptsIcons[SO],
      concept: <p className="word-wrap">{getConceptName(conceptsData, concept_uid)}</p>,
      order: i + 1,
      view: universal ? '' : editRuleLink
    }
  });

  function handleEditRule(rule: RuleInterface) {
    setRuleToEdit(rule);
    toggleEditRuleModal();
  }

  const handleCreateRule = ({rule}: {rule: RuleInterface}) => {
    createRule(rule).then((response) => {
      const { errors, rule } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        // clear rule cache to display newly created rule
        queryClient.clear();
        history.push(`/activities/${activityId}/rules/${rule.id}`);
        toggleAddRuleModal();
      }
    });
  }

  const handleUpdateRule = ({rule}: {rule: RuleInterface}) => {
    const { id } = ruleToEdit;
    updateRule(id, rule).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        // clear rule cache to display newly updated rule
        queryClient.clear();
        toggleEditRuleModal();
      }
    });
  }

  const toggleAddRuleModal = () => {
    setShowAddRuleModal(!showAddRuleModal);
  }

  const toggleEditRuleModal = () => {
    setShowEditRuleModal(!showEditRuleModal);
  }

  const renderRuleForm = (rule: RuleInterface, submitRule: any, toggleModal: any) => {
    return(
      <Modal className="rule-view-form-modal">
        <RuleViewForm
          activityData={activityData && activityData.activity}
          activityId={activityId}
          closeModal={toggleModal}
          isRulesIndex={true}
          isSemantic={rule && rule.rule_type === 'autoML'}
          isUniversal={false}
          requestErrors={errors}
          rule={rule}
          submitRule={submitRule}
        />
      </Modal>
    );
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
    { name: "Order", attribute:"order", width: "30px" },
    { name: "Type", attribute:"type", width: "100px" },
    { name: "Because", attribute:"because_prompt", width: "30px" },
    { name: "But", attribute:"but_prompt", width: "30px" },
    { name: "So", attribute:"so_prompt", width: "30px" },
    { name: "Name", attribute:"name", width: "200px" },
    { name: "First Layer Feedback", attribute:"first_feedback", width: "250px" },
    { name: "Second Layer Feedback", attribute:"second_feedback", width: "250px" },
    { name: "Level 0 Concept", attribute:"concept", width: "200px" },
    { name: "", attribute:"view", width: "40px" },
  ];

  return(
    <div className="rules-container">
      {showAddRuleModal && renderRuleForm(blankRule, handleCreateRule, toggleAddRuleModal)}
      {showEditRuleModal && renderRuleForm(ruleToEdit, handleUpdateRule, toggleEditRuleModal)}
      <button className="quill-button fun primary contained" id="add-rule-button" onClick={toggleAddRuleModal} type="submit">
        Add Rule
      </button>
      <DataTable
        className="rules-table"
        defaultSortAttribute="name"
        headers={dataTableFields}
        rows={formattedRows ? formattedRows : []}
      />
    </div>
  );
}

export default Rules
