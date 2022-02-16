import * as React from "react";

import TeamLocker from './teamLocker';

const TEAM_LOCKERS = ['curriculum', 'partnerships', 'product', 'support', 'pathways'];

export const LockerIndex = () => {
  function renderTeamLockers() {
    return TEAM_LOCKERS.map(lockerKey => (
      <TeamLocker lockerKey={lockerKey} />
    ));
  }
  return(
    <div className="locker-main-container">
      <h3>Team Lockers</h3>
      <div className="team-lockers-container">
        {renderTeamLockers()}
      </div>
    </div>
  );
}

export default LockerIndex;
