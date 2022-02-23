import * as React from "react";

import Locker from './locker';

import { lockerItems } from "../../helpers/locker/lockerItems";
import { TEAMS } from "../../../Shared";

export const LockerIndex = () => {
  const allLockers = [...TEAMS, 'index'];
  function renderLockers() {
    return allLockers.map((lockerKey: string) => (
      <Locker key={lockerKey} lockerContents={lockerItems[lockerKey]} />
    ));
  }

  return(
    <div className="locker-index-container locker-content">
      <h3 className="subheader">Team Lockers</h3>
      <div className="team-lockers-container">
        {renderLockers()}
      </div>
    </div>
  );
}

export default LockerIndex;
