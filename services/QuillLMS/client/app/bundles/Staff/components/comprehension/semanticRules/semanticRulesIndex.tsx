import * as React from "react";
import { useQuery } from 'react-query';
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';

import SemanticRulesOverview from './semanticRulesOverview'

import { BECAUSE, BUT, SO } from '../../../../../constants/comprehension';
import { getPromptForComponent } from '../../../helpers/comprehension';
import { fetchActivity } from '../../../utils/comprehension/activityAPIs';
import { Error, Spinner } from '../../../../Shared/index';

const SemanticRulesIndex = ({ match }) => {
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

  const ruleData = { error: null };

  if(!ruleData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(ruleData.error) {
    return(
      <div className="error-container">
        <Error error={`${ruleData.error}`} />
      </div>
    );
  }

  return(
    <div className="semantic-rules-container">
      <div className="header-container">
        {activityData && renderTitle(activityData)}
      </div>
      <div className="tabs-container">
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
      </div>
      <Switch>
        <Redirect exact from='/activities/:activityId/semantic-rules' to='/activities/:activityId/semantic-rules/all' />
        {/* eslint-disable react/jsx-no-bind */}
        <Route component={() => <SemanticRulesOverview activityId={activityId} prompts={getPromptForComponent(activityData, 'all')} />} path='/activities/:activityId/semantic-rules/all' />
        <Route component={() => <SemanticRulesOverview activityId={activityId} prompts={getPromptForComponent(activityData, BECAUSE)} />} path='/activities/:activityId/semantic-rules/because' />
        <Route component={() => <SemanticRulesOverview activityId={activityId} prompts={getPromptForComponent(activityData, BUT)} />} path='/activities/:activityId/semantic-rules/but' />
        <Route component={() => <SemanticRulesOverview activityId={activityId} prompts={getPromptForComponent(activityData, SO)} />} path='/activities/:activityId/semantic-rules/so' />
      </Switch>
    </div>
  );
}

export default withRouter(SemanticRulesIndex)
