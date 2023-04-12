import * as React from "react";
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Activities from './activities';
import Activity from './activity';
import HealthDashboards from "./healthDashboards/healthDashboards";
import Hints from './hints';
import UniversalRule from './universalRules/universalRule';
import UniversalRulesIndex from './universalRules/universalRules';

const EvidenceLanding = () => (
  <div className="main-admin-container">
    <Switch>
      <Redirect exact from='/' to='/activities' />
      <Route component={Activity} path='/activities/:activityId' />
      <Route component={HealthDashboards} path='/health-dashboards' />
      <Route component={UniversalRule} path='/universal-rules/:ruleId' />
      <Route component={UniversalRulesIndex} path='/universal-rules' />
      <Route component={Activities} path='/activities' />
      <Route component={Hints} path='/hints/:hintId?' />
    </Switch>
  </div>
)

export default withRouter(EvidenceLanding);
