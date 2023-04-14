import * as React from "react";
import { useQuery } from 'react-query';
import { withRouter } from 'react-router-dom';

import SemanticLabelForm from './semanticLabelForm';

import { blankRule, DEFAULT_CONCEPT_UIDS } from '../../../../../constants/evidence';
import { Spinner } from '../../../../Shared/index';
import { RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchRule } from '../../../utils/evidence/ruleAPIs';

const SemanticLabelWrapper = ({ activityData, isSemantic, isUniversal, requestErrors, submitRule, match }) => {
  const { params } = match;
  const { activityId, ruleId, promptId, } = params;

  // cache rule data
  const { data: ruleData } = useQuery({
    queryKey: [`rule-${ruleId}`, ruleId],
    queryFn: fetchRule
  });

  const prompt = activityData.prompts.find(p => String(p.id) === promptId)

  let rule: RuleInterface;

  if(!ruleId) {
    const blankSemanticRule = {...blankRule};
    blankSemanticRule.rule_type = 'autoML';
    blankSemanticRule.state = 'inactive';
    blankSemanticRule.concept_uid = DEFAULT_CONCEPT_UIDS[prompt.conjunction]
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
    <SemanticLabelForm
      activityData={activityData}
      activityId={activityId}
      isSemantic={isSemantic}
      isUniversal={isUniversal}
      requestErrors={requestErrors}
      rule={rule}
      submitRule={submitRule}
    />
  );
}

export default withRouter<any, any>(SemanticLabelWrapper)
