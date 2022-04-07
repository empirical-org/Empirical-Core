import * as React from "react";
import { Route, Switch, withRouter } from 'react-router-dom';
import { useQuery } from 'react-query';

import LockerIndex from './lockerIndex';
import PersonalLocker from "./personalLocker";
import TeamLocker from './teamLocker';
import OrganizeLocker from "./organizeLocker";

import { fetchLocker } from "../../utils/evidence/lockerAPIs";

export const LockerApp = (props) => {
  const { userId } = props;
  const { data: personalLockerData } = useQuery({
    queryKey: ['personal-locker', userId],
    queryFn: fetchLocker
  });

  return(
    <Switch>
      <Route render={() => <OrganizeLocker personalLocker={personalLockerData && personalLockerData.locker} {...props} />} path='/:personal-locker/organize' />
      <Route render={() => <PersonalLocker personalLocker={personalLockerData && personalLockerData.locker} {...props} />} path='/:personal-locker' />
      <Route render={() => <TeamLocker {...props} />} path='/:team' />
      <Route render={() => <LockerIndex personalLocker={personalLockerData && personalLockerData.locker} {...props} />} path='/' />
    </Switch>
  );
}

export default withRouter(LockerApp);
