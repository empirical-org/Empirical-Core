import * as React from "react";
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Activities from './activities';
import Activity from './activity';
import Hints from './hints';
import HealthDashboard from "./healthDashboards/healthDashboard";
import UniversalRulesIndex from './universalRules/universalRules';
import UniversalRule from './universalRules/universalRule';

const EvidenceLanding = () => (
  <div className="main-admin-container">
    <Switch>
      <Redirect exact from='/' to='/activities' />
      <Route component={Activity} path='/activities/:activityId' />
      <Route component={HealthDashboard} path='/health-dashboard' />
      <Route component={UniversalRule} path='/universal-rules/:ruleId' />
      <Route component={UniversalRulesIndex} path='/universal-rules' />
      <Route component={Activities} path='/activities' />
      <Route component={Hints} path='/hints/:hintId?' />
    </Switch>
  </div>
)

export default withRouter(EvidenceLanding);
