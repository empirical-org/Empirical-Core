import * as React from "react";
import { Route, Switch, withRouter } from 'react-router-dom';
import { useQuery } from 'react-query';

import LockerIndex from './lockerIndex';
import PersonalLocker from "./personalLocker";
import TeamLocker from './teamLocker';
import { fetchLocker } from "../../utils/evidence/lockerAPIs";

export const LockerApp = (props) => {
  const { userId } = props;
  const { data: personalLockerData } = useQuery({
    queryKey: ['personal-locker', userId],
    queryFn: fetchLocker
  });

  return(
    <Switch>
      <Route render={() => <PersonalLocker {...props} personalLocker={personalLockerData} />} path='/:personal-locker' />
      <Route render={() => <TeamLocker {...props} />} path='/:team' />
      <Route render={() => <LockerIndex {...props} personalLocker={personalLockerData} />} path='/' />
    </Switch>
  );
}

export default withRouter(LockerApp);
