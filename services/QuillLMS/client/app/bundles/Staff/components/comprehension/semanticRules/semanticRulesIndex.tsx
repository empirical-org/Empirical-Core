import * as React from "react";
import { useQuery, queryCache } from 'react-query';
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';

import SemanticRulesOverview from './semanticRulesOverview'
import SemanticRuleWrapper from './semanticRuleWrapper';
import ModelForm from './modelForm';
import ActivateModelForm from './activateModelForm';
import Model from './model';

import { ALL, BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import { getPromptForComponent } from '../../../helpers/comprehension';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { createRule, updateRule } from '../../../utils/comprehension/ruleAPIs';
import { Error, Spinner } from '../../../../Shared/index';
import { RuleInterface } from '../../../interfaces/comprehensionInterfaces';

const SemanticRulesIndex = ({ history, match, location }) => {
  const { params } = match;
  const { activityId } = params;

  // get cached activity data to pass to ruleForm
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  function renderTitle({ activity }) {
    if(!activity) {
      return;
    }
    const { title } = activity;
    return <h2>{title}</h2>
  }

  function handleCreateRule({rule}: {rule: RuleInterface}) {
    createRule(rule).then((response) => {
      const { error, rule } = response;
      if(error) {
        return error;
      }
      // update rules cache to display newly created rule
      queryCache.refetchQueries(`rules-${activityId}`).then(() => {
        history.push(`/activities/${activityId}/semantic-rules/all`);
      });
      return rule;
    });
  }

  function handleUpdateRule({rule}: {rule: RuleInterface}, ruleId) {
    updateRule(ruleId, rule).then((response) => {
      const { error } = response;
      if(error) {
        return error;
      }
      // update rules cache to display newly updated rule
      queryCache.refetchQueries(`rules-${activityId}`).then(() => {
        history.push(`/activities/${activityId}/semantic-rules/all`);
      });
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
  const tabOptions = [ALL, BECAUSE, BUT, SO];
  const showTabs = tabOptions.some(option => location.pathname.includes(option));

  return(
    <div className="semantic-rules-container">
      <div className="header-container">
        {activityData && renderTitle(activityData)}
      </div>
      {showTabs && <div className="tabs-container">
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/semantic-rules/all`}>
          <div className="tab-option">
            All
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/semantic-rules/because`}>
          <div className="tab-option">
            Because
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/semantic-rules/but`}>
          <div className="tab-option">
            But
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/semantic-rules/so`}>
          <div className="tab-option">
            So
          </div>
        </NavLink>
      </div>}
      <Switch>
        <Redirect exact from='/activities/:activityId/semantic-rules' to='/activities/:activityId/semantic-rules/all' />
        {/* eslint-disable react/jsx-no-bind */}
        <Route component={() => <SemanticRulesOverview activityId={activityId} prompts={getPromptForComponent(activityData, ALL)} />} path='/activities/:activityId/semantic-rules/all' />
        <Route component={() => <SemanticRulesOverview activityId={activityId} prompts={getPromptForComponent(activityData, BECAUSE)} />} path='/activities/:activityId/semantic-rules/because' />
        <Route component={() => <SemanticRulesOverview activityId={activityId} prompts={getPromptForComponent(activityData, BUT)} />} path='/activities/:activityId/semantic-rules/but' />
        <Route component={() => <SemanticRulesOverview activityId={activityId} prompts={getPromptForComponent(activityData, SO)} />} path='/activities/:activityId/semantic-rules/so' />
        <Route component={ActivateModelForm} path='/activities/:activityId/semantic-rules/:promptId/model/:modelId/activate' />
        <Route component={Model} path='/activities/:activityId/semantic-rules/model/:modelId' />
        <Route component={ModelForm} path='/activities/:activityId/semantic-rules/:promptId/add-model' />
        <Route
          path='/activities/:activityId/semantic-rules/:promptId/new'
          render={() =>
            (<SemanticRuleWrapper
              activityData={activityData && activityData.activity}
              isSemantic={true}
              isUniversal={false}
              submitRule={handleCreateRule}
            />)}
        />
        <Route
          path='/activities/:activityId/semantic-rules/:promptId/:ruleId'
          render={() =>
            (<SemanticRuleWrapper
              activityData={activityData && activityData.activity}
              isSemantic={true}
              isUniversal={false}
              submitRule={handleUpdateRule}
            />)}
        />
      </Switch>
    </div>
  );
}

export default withRouter(SemanticRulesIndex)
