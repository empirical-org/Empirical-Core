import * as React from "react";
import { Link, RouteComponentProps } from 'react-router-dom'
import { queryCache, useQuery } from 'react-query';

import RuleForm from './ruleForm';

import { getPromptsIcons, getCheckIcon, renderHeader } from '../../../helpers/comprehension';
import { ActivityRouteProps, RuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { BECAUSE, BUT, SO, blankRule } from '../../../../../constants/comprehension';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { createRule, fetchRules } from '../../../utils/comprehension/ruleAPIs';
import { DataTable, Error, Modal, Spinner } from '../../../../Shared/index';

const Rules: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;
  const [showAddRuleModal, setShowAddRuleModal] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  // cache rules data for updates
  const { data: rulesData } = useQuery({
    queryKey: [`rules-${activityId}`, activityId],
    queryFn: fetchRules
  });

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const formattedRows = rulesData && rulesData.rules && rulesData.rules.map(rule => {
    const { name, id, rule_type, universal, suborder, prompt_ids } = rule;
    const ruleLink = (<Link to={`/activities/${activityId}/rules/${id}`}>View</Link>);
    const promptsIcons = getPromptsIcons(activityData, prompt_ids);
    return {
      id: `${activityId}-${id}`,
      type: rule_type,
      name,
      because_prompt: promptsIcons[BECAUSE],
      but_prompt: promptsIcons[BUT],
      so_prompt: promptsIcons[SO],
      universal: getCheckIcon(universal),
      suborder,
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
    { name: "Type", attribute:"type", width: "100px" },
    { name: "Name", attribute:"name", width: "400px" },
    { name: "Because", attribute:"because_prompt", width: "70px" },
    { name: "But", attribute:"but_prompt", width: "70px" },
    { name: "So", attribute:"so_prompt", width: "70px" },
    { name: "Universal?", attribute:"universal", width: "70px" },
    { name: "Sub Order", attribute:"suborder", width: "70px" },
    { name: "", attribute:"view", width: "70px" },
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
