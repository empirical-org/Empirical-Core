import * as React from "react";
import { useQuery } from 'react-query';
import { withRouter } from 'react-router-dom';

import RuleViewForm from './ruleViewForm';

import { RuleInterface } from '../../../interfaces/comprehensionInterfaces';
import { blankRule } from '../../../../../constants/comprehension';
import { fetchRule } from '../../../utils/comprehension/ruleAPIs';
import { Spinner } from '../../../../Shared/index';

const RuleViewFormWrapper = ({ activityData, isSemantic, isUniversal, location, requestErrors, ruleTypeDisabled, submitRule, match }) => {
  const { state } = location;
  const { params } = match;
  const { activityId, ruleId } = params;

  // cache rule data
  const { data: ruleData } = useQuery({
    queryKey: [`rule-${ruleId}`, ruleId],
    queryFn: fetchRule
  });

  let rule: RuleInterface;

  if(!ruleId) {
    const ruleType = state && state.ruleType;
    const ruleToBeCreated = {...blankRule};
    ruleToBeCreated.rule_type = ruleType;
    rule = ruleToBeCreated
  } else {
    rule = ruleData && ruleData.rule;
  }

  if(!rule) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  return(
    <RuleViewForm
      activityData={activityData}
      activityId={activityId}
      isSemantic={isSemantic}
      isUniversal={isUniversal}
      requestErrors={requestErrors}
      rule={rule}
      ruleTypeDisabled={ruleTypeDisabled}
      submitRule={submitRule}
    />
  );
}

export default withRouter<any, any>(RuleViewFormWrapper)
