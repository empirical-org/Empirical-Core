import * as React from "react";
import { useQuery, queryCache } from 'react-query';
import { Route, Switch, withRouter } from 'react-router-dom';

import RegexRulesIndex from './regexRulesIndex';

import RuleViewFormWrapper from '../configureRules/ruleViewFormWrapper';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { createRule, updateRule } from '../../../utils/comprehension/ruleAPIs';
import { Error, Spinner } from '../../../../Shared/index';
import { RuleInterface } from '../../../interfaces/comprehensionInterfaces';

const RegexRulesRouter = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;

  const [errors, setErrors] = React.useState<string[]>([]);

  // get cached activity data to pass to ruleForm
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

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
        // update rules cache to display newly created rule
        queryCache.refetchQueries(`rules-${activityId}`).then(() => {
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
        queryCache.refetchQueries(`rules-${activityId}`).then(() => {
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
      <div className="header-container">
        {activityData && renderActivityName(activityData)}
      </div>
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
