import * as React from "react";

import Locker from './locker';

import { TEAMS } from "../../../Shared";
import { lockerItems } from "../../helpers/locker/lockerItems";

export const LockerIndex = ({ personalLocker }) => {
  const allLockers = [...TEAMS, 'index'];

  function renderLockers() {
    return allLockers.map((lockerKey: string) => (
      <Locker key={lockerKey} lockerContents={lockerItems[lockerKey]} />
    ));
  }

  function getContentForPersonalLocker() {
    if(!personalLocker || (personalLocker && personalLocker.no_locker)) {
      return lockerItems['personal locker'];
    } else {
      const { label } = personalLocker;
      return {
        label,
        route: 'personal-locker',
        emoji: '🔆',
        emojiLabel: 'gear',
        overrideTitleCase: true
      }
    }
  }

  return(
    <div className="locker-index-container locker-content">
      <h3 className="subheader">Personal Locker</h3>
      <Locker lockerContents={getContentForPersonalLocker()} />
      <h3 className="subheader">Team lockers</h3>
      <div className="team-lockers-container">
        {renderLockers()}
      </div>
    </div>
  );
}

export default LockerIndex;
