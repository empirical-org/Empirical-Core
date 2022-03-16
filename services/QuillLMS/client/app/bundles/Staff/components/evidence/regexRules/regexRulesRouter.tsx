import * as React from "react";
import { useQuery, useQueryClient, } from 'react-query';
import { Route, Switch, withRouter } from 'react-router-dom';

import RegexRulesIndex from './regexRulesIndex';

import RuleViewFormWrapper from '../configureRules/ruleViewFormWrapper';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';
import { createRule, updateRule } from '../../../utils/evidence/ruleAPIs';
import { Error, Spinner } from '../../../../Shared/index';
import { RuleInterface } from '../../../interfaces/evidenceInterfaces';
import { getRefetchQueryString } from '../../../helpers/evidence/ruleHelpers';

const RegexRulesRouter = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;

  const [errors, setErrors] = React.useState<string[]>([]);

  const queryClient = useQueryClient()

  // get cached activity data to pass to ruleForm
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  function handleCreateRule({rule}: {rule: RuleInterface}) {
    createRule(rule).then((response) => {
      const { errors, rule } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        const queryString = getRefetchQueryString(rule, activityId);
        setErrors([]);
        // update rules cache to display newly created rule
        queryClient.refetchQueries(queryString).then(() => {
          history.push(`/activities/${activityId}/regex-rules`);
        });
      }
      return rule;
    });
  }

  function handleUpdateRule({rule}: {rule: RuleInterface}, ruleId) {
    updateRule(ruleId, rule).then((response) => {
      const { errors } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        // update rules cache to display newly updated rule
        queryClient.refetchQueries(`rule-${ruleId}`).then(() => {
          history.push(`/activities/${activityId}/regex-rules`);
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
    <div className="semantic-labels-container">
      <Switch>
        {/* eslint-disable react/jsx-no-bind */}
        <Route
          path='/activities/:activityId/regex-rules/new'
          render={() =>
            (<RuleViewFormWrapper
              activityData={activityData && activityData.activity}
              isSemantic={false}
              isUniversal={false}
              requestErrors={errors}
              ruleTypeDisabled={true}
              submitRule={handleCreateRule}
            />)}
        />
        <Route
          path='/activities/:activityId/regex-rules/:ruleId'
          render={() =>
            (<RuleViewFormWrapper
              activityData={activityData && activityData.activity}
              isSemantic={false}
              isUniversal={false}
              requestErrors={errors}
              ruleTypeDisabled={true}
              submitRule={handleUpdateRule}
            />)}
        />
        <Route component={RegexRulesIndex} path='/activities/:activityId/regex-rules' />
      </Switch>
    </div>
  );
}

export default withRouter(RegexRulesRouter)
