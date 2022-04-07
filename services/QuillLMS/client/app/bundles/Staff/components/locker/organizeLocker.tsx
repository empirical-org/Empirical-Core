import * as React from 'react';
import * as _ from 'lodash';
import uuid from 'uuid/v4';

import ReturnButton from './returnButton';
import LockerTile from './lockerTile';

import { Input, SortableList } from '../../../Shared';
import { InputEvent } from '../../interfaces/evidenceInterfaces';

export const OrganizeLocker = ({ history, personalLocker }) => {
  const [errors, setErrors] = React.useState<any>(null);
  const [lockerLabel, setLockerLabel] = React.useState<string>(personalLocker && personalLocker.label);
  const [lockerPreferences, setLockerPreferences] = React.useState(null);

  React.useEffect(() => {
    if(personalLocker && personalLocker.preferences && !!Object.keys(personalLocker.preferences).length) {
      setLockerPreferences(personalLocker.preferences);
    }
  }, [personalLocker]);

  function handleSetPersonalLockerLabel(e: InputEvent) {
    setLockerLabel(e.target.value)
  }

  function handleSetSectionLabel(e: InputEvent, sectionKey) {
    const { target } = e;
    const { value } = target;
    const updatedLockerPreferences = {...lockerPreferences};
    updatedLockerPreferences[sectionKey].label = value;
    setLockerPreferences(updatedLockerPreferences);
  }

  function handleSetLockerProperty({ value, sectionKey, lockerKey, property }: { value: any, sectionKey: number, lockerKey: string, property: string }) {
    const updatedPreferences = {...lockerPreferences}
    updatedPreferences[sectionKey].lockers[lockerKey][property] = value;
    setLockerPreferences(updatedPreferences);
  }

  function renderPersonalLockerSections() {
    return Object.keys(lockerPreferences).map(sectionKey => {
      const { label, lockers } = lockerPreferences[sectionKey];
      return(
        <div className="locker-sections-container" key={sectionKey}>
          <Input
            className="section-input"
            handleChange={(e) => handleSetSectionLabel(e, sectionKey)}
            label="Section label"
            value={label}
          />
          <div className="lockers-container">
            {Object.keys(lockers).map(lockerKey => (
              <LockerTile
                handleSetLockerProperty={handleSetLockerProperty}
                key={lockerKey}
                locker={lockers[lockerKey]}
                lockerKey={lockerKey}
                lockerPreferences={lockerPreferences}
                sectionKey={sectionKey}
              />
            ))}
          </div>
        </div>
      );
    })
  }

  return(
    <div className="locker-content organize-locker-form-container">
      <ReturnButton backLink="/personal-locker" buttonLabel="Personal locker" history={history} />
      <h4>Organize your locker</h4>
      <div className="organize-locker-form-contents">
        <Input
          className="locker-label-input"
          handleChange={handleSetPersonalLockerLabel}
          label="Locker label"
          value={lockerLabel}
        />
        {lockerPreferences && renderPersonalLockerSections()}
      </div>
    </div>
  )
}

export default OrganizeLocker;
