import * as React from 'react';

import { lockerItems } from './lockerItems';

import Locker from '../../components/locker/locker';
import { titleCase } from '../../../Shared';

const TEAM = 'team';

export const renderLockerSections = (lockers: any, lockerType: string) => {
  return Object.keys(lockers).map(lockerSection => {
    return(
      <div className="locker-section-container" key={lockerSection}>
        <h4>{titleCase(lockerSection)}</h4>
        <div className="lockers-container">
          {renderIndividualLockers(lockerSection, lockers, lockerType)}
        </div>
      </div>
    );
  });
}

const renderIndividualLockers = (lockerSection: string, lockers: any, lockerType: string) => {
  const lockersForSection = lockers[lockerSection];
  return lockersForSection.map((lockerForSection: any) => {
    const lockerKey = lockerType === TEAM ? lockerForSection : lockerForSection.label;
    const lockerContents = lockerType === TEAM ? lockerItems[lockerForSection] : lockerForSection;
    return <Locker key={lockerKey} lockerContents={lockerContents} />
  });
}
