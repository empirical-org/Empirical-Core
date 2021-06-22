import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom'
import { queryCache, useQuery } from 'react-query';
import { firstBy } from "thenby";
import stripHtml from "string-strip-html";

import RuleForm from './ruleForm';

import { getConceptName } from '../../../helpers/comprehension/ruleHelpers';
import { getPromptsIcons, renderHeader } from '../../../helpers/comprehension';
import { ActivityRouteProps, RuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { BECAUSE, BUT, SO, blankRule, ruleApiOrder } from '../../../../../constants/comprehension';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { createRule, fetchRules } from '../../../utils/comprehension/ruleAPIs';
import { fetchConcepts, } from '../../../utils/comprehension/conceptAPIs';
import { DataTable, Error, Modal, Spinner } from '../../../../Shared/index';

const Rules: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;
  const [showAddRuleModal, setShowAddRuleModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [sortedRules, setSortedRules] = React.useState<[]>([]);

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  // cache rules data for updates
  const { data: rulesData } = useQuery({
    queryKey: [`rules-${activityId}`, activityId],
    queryFn: fetchRules
  });

  const { data: conceptsData } = useQuery({
    queryKey: ['concepts', activityId],
    queryFn: fetchConcepts
  });

  function sortByRuleApiOrder(ruleOneRuleType: string, ruleTwoRuleType: string) {
    return ruleApiOrder.indexOf(ruleOneRuleType) - ruleApiOrder.indexOf(ruleTwoRuleType);
  }

  if(rulesData && rulesData.rules && !sortedRules.length) {
    const { rules } = rulesData;
    const multiSortRules = rules.sort(
      firstBy("rule_type", { cmp: sortByRuleApiOrder, direction: "asc" })
      .thenBy('prompt_ids')
      .thenBy('suborder')
    );
    setSortedRules(multiSortRules);
  }


  const formattedRows = sortedRules.map((rule: RuleInterface, i: number) => {
    const { name, id, rule_type, prompt_ids, feedbacks, concept_uid } = rule;
    const ruleLink = (<Link to={`/activities/${activityId}/rules/${id}`}>View</Link>);
    const promptsIcons = getPromptsIcons(activityData, prompt_ids);
    const firstFeedback = feedbacks && feedbacks[0] ? <p className="word-wrap">{stripHtml(feedbacks[0].text)}</p> : 'N/A'
    const secondFeedback = feedbacks && feedbacks[1] ? <p className="word-wrap">{stripHtml(feedbacks[1].text)}</p> : 'N/A'
    return {
      id: `${activityId}-${id}`,
      type: rule_type,
      name: <p className="word-wrap">{name}</p>,
      first_feedback: firstFeedback,
      second_feedback: secondFeedback,
      because_prompt: promptsIcons[BECAUSE],
      but_prompt: promptsIcons[BUT],
      so_prompt: promptsIcons[SO],
      concept: <p className="word-wrap">{getConceptName(conceptsData, concept_uid)}</p>,
      order: i + 1,
      view: ruleLink
    }
  });

  const submitRule = ({rule}: {rule: RuleInterface}) => {
    createRule(rule).then((response) => {
      const { errors, rule } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        // update ruleSets cache to display newly created ruleSet
        queryCache.refetchQueries(`rules-${activityId}`);
        history.push(`/activities/${activityId}/rules/${rule.id}`);

        toggleAddRuleModal();
      }
    });
  }

  const toggleAddRuleModal = () => {
    setShowAddRuleModal(!showAddRuleModal);
  }

  const renderRuleForm = () => {
    return(
      <Modal>
        <RuleForm
          activityData={activityData && activityData.activity}
          activityId={activityId}
          closeModal={toggleAddRuleModal}
          isUniversal={false}
          requestErrors={errors}
          rule={blankRule}
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
    // { name: "Rule Order", attribute:"order", width: "60px" },
    { name: "Type", attribute:"type", width: "100px" },
    { name: "Because", attribute:"because_prompt", width: "30px" },
    { name: "But", attribute:"but_prompt", width: "30px" },
    { name: "So", attribute:"so_prompt", width: "30px" },
    { name: "Name", attribute:"name", width: "200px" },
    { name: "First Feedback", attribute:"first_feedback", width: "250px" },
    { name: "Second Feedback", attribute:"second_feedback", width: "250px" },
    { name: "Level 0 Concept", attribute:"concept", width: "200px" },
    { name: "", attribute:"view", width: "40px" },
  ];

  return(
    <div className="rules-container">
      {showAddRuleModal && renderRuleForm()}
      {renderHeader(activityData, 'View All Rules')}
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
