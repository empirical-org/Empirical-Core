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
      <Route path='/:personal-locker/organize' render={() => <OrganizeLocker personalLocker={personalLockerData && personalLockerData.locker} {...props} />} />
      <Route path='/:personal-locker' render={() => <PersonalLocker personalLocker={personalLockerData && personalLockerData.locker} {...props} />} />
      <Route path='/:team' render={() => <TeamLocker {...props} />} />
      <Route path='/' render={() => <LockerIndex personalLocker={personalLockerData && personalLockerData.locker} {...props} />} />
    </Switch>
  );
}

export default withRouter(LockerApp);
