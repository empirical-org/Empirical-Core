import * as React from 'react';

import { lockerItems } from './lockerItems';

import Locker from '../../components/locker/locker';
import { titleCase, Modal } from '../../../Shared';

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

interface RenderConfirmationModalProps {
  confirmationText: string,
  leftClickHandler: (e: any) => void,
  rightClickHandler: (e: any) => void,
  leftButtonText: string,
  rightButtonText: string,
  buttonValue?: string
}

export function renderConfirmationModal({ confirmationText, leftClickHandler, rightClickHandler, leftButtonText, rightButtonText, buttonValue }: RenderConfirmationModalProps) {
  return(
    <Modal>
      <p>{confirmationText}</p>
      <div className="buttons-container">
        <button className="quill-button focus-on-light fun primary outlined" onClick={leftClickHandler} value={buttonValue}>{leftButtonText}</button>
        <button className="quill-button focus-on-light fun primary outlined" onClick={rightClickHandler}>{rightButtonText}</button>
      </div>
    </Modal>
  );
}

export function validateLockerForm(locker) {
  const errors = {};
  const { label, preferences } = locker;
  if(!label) {
    errors['label'] = 'Locker label cannot be blank';
  }
  Object.keys(preferences).map(sectionKey => {
    const section = preferences[sectionKey];
    const { label } = section
    if(!label) {
      errors[sectionKey] = 'Section label cannot be blank';
    }
  })
  return errors;
}
