import * as React from "react";
import { useQuery, queryCache } from 'react-query';
import { Route, Switch, withRouter } from 'react-router-dom';

import PlagiarismRulesIndex from './plagiarismRulesIndex';

import RuleViewFormWrapper from '../configureRules/ruleViewFormWrapper';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { createRule, updateRule } from '../../../utils/comprehension/ruleAPIs';
import { Error, Spinner } from '../../../../Shared/index';
import { RuleInterface } from '../../../interfaces/comprehensionInterfaces';

const PlagiarismRulesRouter = ({ history, match }) => {
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
          history.push(`/activities/${activityId}/plagiarism-rules`);
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
