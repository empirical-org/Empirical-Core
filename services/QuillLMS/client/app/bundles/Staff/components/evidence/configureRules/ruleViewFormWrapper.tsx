import * as React from "react";
import { useQuery } from 'react-query';
import { withRouter } from 'react-router-dom';

import RuleViewForm from './ruleViewForm';

import { blankRule } from '../../../../../constants/evidence';
import { Spinner } from '../../../../Shared/index';
import { RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchRule } from '../../../utils/evidence/ruleAPIs';

const RuleViewFormWrapper = ({ activityData, isSemantic, isUniversal, location, requestErrors, rulePromptsDisabled, ruleTypeDisabled, submitRule, match }) => {
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
    const { ruleType, promptIds, conceptUid, name, } = state || {}
    const ruleToBeCreated = {...blankRule};
    if(ruleType) {
      ruleToBeCreated.rule_type = ruleType;
    }
    if(promptIds) {
      ruleToBeCreated.prompt_ids = promptIds;
    }
    if(conceptUid) {
      ruleToBeCreated.concept_uid = conceptUid
    }
    if(name) {
      ruleToBeCreated.name = name
    }
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
      rulePromptsDisabled={rulePromptsDisabled}
      ruleTypeDisabled={ruleTypeDisabled}
      submitRule={submitRule}
    />
  );
}

export default withRouter<any, any>(RuleViewFormWrapper)
