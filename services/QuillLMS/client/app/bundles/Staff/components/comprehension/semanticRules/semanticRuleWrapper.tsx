import * as React from "react";
import { useQuery } from 'react-query';
import { withRouter } from 'react-router-dom';

import SemanticRule from './semanticRule';

import { blankRule } from '../../../../../constants/comprehension';
import { fetchRule } from '../../../utils/comprehension/ruleAPIs';
import { Spinner } from '../../../../Shared/index';

const SemanticRuleWrapper = ({ activityData, isSemantic, isUniversal, submitRule, match }) => {
  const { params } = match;
  const { activityId, ruleId } = params;

  // cache rule data
  const { data: ruleData } = useQuery({
    queryKey: [`rule-${ruleId}`, ruleId],
    queryFn: fetchRule
  });

  let rule;
  if(!ruleId) {
    const blankSemanticRule = {...blankRule};
    blankSemanticRule.rule_type = 'autoML';
    blankSemanticRule.state = 'inactive';
    rule = blankSemanticRule
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
    <SemanticRule
      activityData={activityData}
      activityId={activityId}
      isSemantic={isSemantic}
      isUniversal={isUniversal}
      rule={rule}
      submitRule={submitRule}
    />
  );
}

export default withRouter<any, any>(SemanticRuleWrapper)
