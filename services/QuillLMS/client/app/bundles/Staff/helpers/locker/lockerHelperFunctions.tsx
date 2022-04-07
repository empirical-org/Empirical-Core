import * as React from 'react';

import { lockerItems } from './lockerItems';

import Locker from '../../components/locker/locker';
import { titleCase } from '../../../Shared';
import { InputEvent } from '../../interfaces/evidenceInterfaces';

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

export const handleSetSectionLabel = ({
  e,
  sectionToUpdate,
  lockerPreferences,
  setLockerPreferences
} : {
  e: InputEvent,
  sectionToUpdate: number,
  lockerPreferences: any,
  setLockerPreferences: (preferences: any) => void
}) => {
  const updatedPreferences = {};
  Object.keys(lockerPreferences).map(sectionKey => {
    updatedPreferences[sectionKey] = {...lockerPreferences[sectionKey]}
  })
  updatedPreferences[sectionToUpdate].sectionLabel = e.target.value;
  setLockerPreferences(updatedPreferences);
}

export const handleSetLockerLabel = ({
  e,
  sectionToUpdate,
  lockerToUpdate,
  lockerPreferences,
  setLockerPreferences,
  attribute
} : {
  e: InputEvent,
  sectionToUpdate: number,
  lockerToUpdate: string,
  lockerPreferences: any,
  setLockerPreferences: (preferences: any) => void,
  attribute: string
}) => {
  const updatedPreferences = {};
  Object.keys(lockerPreferences).map(sectionKey => {
    updatedPreferences[sectionKey] = {...lockerPreferences[sectionKey]}
    const section = updatedPreferences[sectionKey];
    Object.keys(section).map(lockerKey => {
      const property = updatedPreferences[sectionKey][lockerKey];
      if(typeof property === 'object') {
        updatedPreferences[sectionKey][lockerKey] = {...lockerPreferences[sectionKey][lockerKey]};
      } else {
        updatedPreferences[sectionKey][lockerKey] = lockerPreferences[sectionKey][lockerKey];
      }
    });
  });
  updatedPreferences[sectionToUpdate][lockerToUpdate][attribute] = e.target.value;
  setLockerPreferences(updatedPreferences);
}
