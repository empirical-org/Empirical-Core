import * as React from "react";
import { useQuery, useQueryClient } from 'react-query';
import { Route, Switch, withRouter } from 'react-router-dom';

import PlagiarismRulesIndex from './plagiarismRulesIndex';

import { Error, Spinner } from '../../../../Shared/index';
import { getRefetchQueryString } from '../../../helpers/evidence/ruleHelpers';
import { RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { createRule, updateRule } from '../../../utils/evidence/ruleAPIs';
import RuleViewFormWrapper from '../configureRules/ruleViewFormWrapper';

const PlagiarismRulesRouter = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;

  const [errors, setErrors] = React.useState<string[]>([]);

  // get cached activity data to pass to ruleForm
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  const queryClient = useQueryClient()

  function renderActivityName({ activity }) {
    if(!activity) {
      return;
    }
    const { name } = activity;
    return <h2>{name}</h2>
  }

  function handleCreateRule({rule}: {rule: RuleInterface}) {
    createRule(rule).then((response) => {
      const { errors, rule } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        const queryString = getRefetchQueryString(rule, activityId);
        // update rules cache to display newly created rule
        queryClient.refetchQueries(queryString).then(() => {
          history.push(`/activities/${activityId}/plagiarism-rules`);
        });
      }
      return rule;
    });
  }

  function handleUpdateRule({rule}: {rule: RuleInterface}, ruleId: number) {
    updateRule(ruleId, rule).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        // update rules cache to display newly updated rule
        queryClient.refetchQueries(`rule-${ruleId}`).then(() => {
          history.push(`/activities/${activityId}/plagiarism-rules`);
        });
      }
      return rule;
    });
  }

  if(!activityData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(activityData.error) {
    return(
      <div className="error-container">
        <Error error={`${activityData.error}`} />
      </div>
    );
  }

  return(
    <div className="plagiarism-rules-container">
      <div className="header-container">
        {activityData && renderActivityName(activityData)}
      </div>
      <Switch>
        {/* eslint-disable react/jsx-no-bind */}
        <Route
          path='/activities/:activityId/plagiarism-rules/new'
          render={() =>
            (<RuleViewFormWrapper
              activityData={activityData && activityData.activity}
              isSemantic={false}
              isUniversal={false}
              requestErrors={errors}
              rulePromptsDisabled={true}
              ruleTypeDisabled={true}
              submitRule={handleCreateRule}
            />)}
        />
        <Route
          path='/activities/:activityId/plagiarism-rules/:ruleId'
          render={() =>
            (<RuleViewFormWrapper
              activityData={activityData && activityData.activity}
              isSemantic={false}
              isUniversal={false}
              requestErrors={errors}
              rulePromptsDisabled={true}
              ruleTypeDisabled={true}
              submitRule={handleUpdateRule}
            />)}
        />
        <Route component={PlagiarismRulesIndex} path='/activities/:activityId/plagiarism-rules' />
      </Switch>
    </div>
  );
}

export default withRouter(PlagiarismRulesRouter)
