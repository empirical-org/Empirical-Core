import * as React from "react";
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Activities from './activities';
import Activity from './activity';
import UniversalRulesIndex from './universalRules/universalRules';
import UniversalRule from './universalRules/universalRule';
import HealthDashboard from './healthDashboards/healthDashboard'

const EvidenceLanding = () => (
  <div className="main-admin-container">
    <Switch>
      <Redirect exact from='/' to='/activities' />
      <Route component={Activity} path='/activities/:activityId' />
      <Route component={UniversalRule} path='/universal-rules/:ruleId' />
      <Route component={UniversalRulesIndex} path='/universal-rules' />
      <Route component={Activities} path='/activities' />
      <Route component={HealthDashboard} path='/health-dashboard' />
    </Switch>
  </div>
)

export default withRouter(EvidenceLanding);
