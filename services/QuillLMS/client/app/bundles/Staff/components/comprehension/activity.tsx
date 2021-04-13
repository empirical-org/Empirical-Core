import * as React from "react";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import Navigation from './navigation'
import ActivitySettings from './configureSettings/activitySettings';
import Rules from './configureRules/rules';
import Rule from './configureRules/rule';
import RulesAnalysis from './rulesAnalysis/rulesAnalysis';
import RuleAnalysis from './rulesAnalysis/ruleAnalysis';
import TurkSessions from './gatherResponses/turkSessions';
import SemanticLabelsIndex from './semanticRules/semanticLabelsIndex';

import { ActivityRouteProps } from '../../interfaces/comprehensionInterfaces';

const Activity: React.FC<RouteComponentProps<ActivityRouteProps>> = ({ match, location, }) => {
  const { params } = match;
  return(<React.Fragment>
    <Navigation location={location} match={match} />
    <div className="activity-container">
      <Switch>
        <Redirect exact from='/activities/:activityId' to='/activities/:activityId/settings' />
        <Route component={ActivitySettings} path='/activities/:activityId/settings' />
        <Route component={Rule} path='/activities/:activityId/rules/:ruleId' />
        <Route component={Rules} path='/activities/:activityId/rules' />
        <Route component={RuleAnalysis} path='/activities/:activityId/rules-analysis/:ruleId' />
        <Route component={RulesAnalysis} path='/activities/:activityId/rules-analysis' />
        <Route component={TurkSessions} path='/activities/:activityId/turk-sessions' />
        <Route component={SemanticLabelsIndex} path='/activities/:activityId/semantic-labels' />
      </Switch>
    </div>
  </React.Fragment>);
}
export default withRouter(Activity)
