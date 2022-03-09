import * as React from "react";
import { Route, Switch, withRouter } from 'react-router-dom';

import LockerIndex from './lockerIndex';
import TeamLocker from './teamLocker';

export const LockerApp = () => {
  return(
    <Switch>
      <Route component={TeamLocker} path='/:team' />
      <Route component={LockerIndex} path='/' />
    </Switch>
  );
}

export default withRouter(LockerApp);
