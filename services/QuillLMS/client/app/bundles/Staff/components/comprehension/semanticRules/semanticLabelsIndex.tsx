import * as React from "react";
import { useQuery, queryCache } from 'react-query';
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';

import SemanticLabelsOverview from './semanticLabelsOverview'
import SemanticLabelWrapper from './semanticLabelWrapper';
import ModelForm from './modelForm';
import ActivateModelForm from './activateModelForm';
import Model from './model';

import { ALL, BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import { getPromptForComponent } from '../../../helpers/comprehension';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { createRule, updateRule } from '../../../utils/comprehension/ruleAPIs';
import { Error, Spinner } from '../../../../Shared/index';
import { RuleInterface } from '../../../interfaces/comprehensionInterfaces';

const SemanticLabelsIndex = ({ history, match, location }) => {
  const { params } = match;
  const { activityId } = params;

  const [errors, setErrors] = React.useState<string[]>([]);

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
      const { errors, rule } = response;
      if(errors && errors.length) {
        setErrors(errors);
      } else {
        setErrors([]);
        // update rules cache to display newly created rule
        queryCache.refetchQueries(`rules-${activityId}`).then(() => {
          history.push(`/activities/${activityId}/semantic-labels/all`);
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
          history.push(`/activities/${activityId}/semantic-labels/all`);
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
  const tabOptions = [ALL, BECAUSE, BUT, SO];
  const showTabs = tabOptions.some(option => location.pathname.includes(option));

  return(
    <div className="semantic-labels-container">
      <div className="header-container">
        {activityData && renderTitle(activityData)}
      </div>
      {showTabs && <div className="tabs-container">
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/semantic-labels/all`}>
          <div className="tab-option">
            All
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/semantic-labels/because`}>
          <div className="tab-option">
            Because
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/semantic-labels/but`}>
          <div className="tab-option">
            But
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/semantic-labels/so`}>
          <div className="tab-option">
            So
          </div>
        </NavLink>
      </div>}
      <Switch>
        <Redirect exact from='/activities/:activityId/semantic-labels' to='/activities/:activityId/semantic-labels/all' />
        {/* eslint-disable react/jsx-no-bind */}
        <Route component={() => <SemanticLabelsOverview activityId={activityId} prompts={getPromptForComponent(activityData, ALL)} />} path='/activities/:activityId/semantic-labels/all' />
        <Route component={() => <SemanticLabelsOverview activityId={activityId} prompts={getPromptForComponent(activityData, BECAUSE)} />} path='/activities/:activityId/semantic-labels/because' />
        <Route component={() => <SemanticLabelsOverview activityId={activityId} prompts={getPromptForComponent(activityData, BUT)} />} path='/activities/:activityId/semantic-labels/but' />
        <Route component={() => <SemanticLabelsOverview activityId={activityId} prompts={getPromptForComponent(activityData, SO)} />} path='/activities/:activityId/semantic-labels/so' />
        <Route component={ActivateModelForm} path='/activities/:activityId/semantic-labels/:promptId/model/:modelId/activate' />
        <Route component={Model} path='/activities/:activityId/semantic-labels/model/:modelId' />
        <Route component={ModelForm} path='/activities/:activityId/semantic-labels/:promptId/add-model' />
        <Route
          path='/activities/:activityId/semantic-labels/:promptId/new'
          render={() =>
            (<SemanticLabelWrapper
              activityData={activityData && activityData.activity}
              isSemantic={true}
              isUniversal={false}
              requestErrors={errors}
              submitRule={handleCreateRule}
            />)}
        />
        <Route
          path='/activities/:activityId/semantic-labels/:promptId/:ruleId'
          render={() =>
            (<SemanticLabelWrapper
              activityData={activityData && activityData.activity}
              isSemantic={true}
              isUniversal={false}
              requestErrors={errors}
              submitRule={handleUpdateRule}
            />)}
        />
      </Switch>
    </div>
  );
}

export default withRouter(SemanticLabelsIndex)
