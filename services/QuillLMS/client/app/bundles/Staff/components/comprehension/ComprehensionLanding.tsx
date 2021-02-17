import * as React from "react";
import { Redirect, Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import Activities from './activities';
import Activity from './activity';

const ComprehensionLanding = () => (
  <div className="main-admin-container">
    <Switch>
      <Redirect exact from='/' to='/activities' />
      <Route component={Activity} path='/activities/:activityId' />
      <Route component={Activities} path='/activities' />
    </Switch>
  </div>
)

export default withRouter(ComprehensionLanding);
