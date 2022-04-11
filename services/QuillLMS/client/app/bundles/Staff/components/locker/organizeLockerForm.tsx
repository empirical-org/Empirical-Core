import * as React from 'react';
import * as _ from 'lodash';

import ReturnButton from './returnButton';
import { Input } from '../../../Shared';
import { InputEvent } from '../../interfaces/evidenceInterfaces';
// import { handleSetSectionLabel, handleSetLockerLabel } from '../../helpers/locker/lockerHelperFunctions';

export const OrganizeLockerForm = ({ history, personalLocker }) => {
  const { label, preferences } = personalLocker;
  const [errors, setErrors] = React.useState<any>(null);
  const [lockerLabel, setLockerLabel] = React.useState<string>(label);
  const [lockerPreferences, setLockerPreferences] = React.useState(null);

  React.useEffect(() => {
    if(!lockerPreferences) {
      const formattedPreferences = {}
      Object.keys(preferences).map((section, i) => {
        formattedPreferences[i] = preferences[section];
        formattedPreferences[i].sectionLabel = section;
      });
      setLockerPreferences(formattedPreferences);
    }
  }, [lockerPreferences]);

  function handleSetPersonalLockerLabel(e: InputEvent) {
    setLockerLabel(e.target.value)
  }

  function handleSetSectionLabel(e: InputEvent, sectionToUpdate: number) {
    const updatedPreferences = {};
    Object.keys(lockerPreferences).map(sectionKey => {
      updatedPreferences[sectionKey] = {...lockerPreferences[sectionKey]}
    })
    updatedPreferences[sectionToUpdate].sectionLabel = e.target.value;
    setLockerPreferences(updatedPreferences);
  }

  function handleSetLockerLabel(e: InputEvent, sectionToUpdate: number, lockerToUpdate: string) {
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
    updatedPreferences[sectionToUpdate][lockerToUpdate].label = e.target.value;
    setLockerPreferences(updatedPreferences);
  }

  function renderFormForSections() {
    const sections = Object.keys(lockerPreferences);
    return sections.map((section, sectionKey) => {
      const sectionForInput = lockerPreferences[sectionKey];
      const { sectionLabel } = sectionForInput;
      return(
        <div>
          <Input
            className="section-input"
            handleChange={(e) => handleSetSectionLabel(e, sectionKey)}
            key={sectionKey}
            label="Section label"
            value={sectionLabel}
          />
          {renderInputsForIndividualLockers(sectionKey)}
        </div>
      );
    });
  }

  function renderInputsForIndividualLockers(sectionKey: number) {
    const sectionLockers = lockerPreferences[sectionKey];
    return Object.keys(sectionLockers).map(lockerKey => {
      if(lockerKey === 'sectionLabel') { return }
      const locker = sectionLockers[lockerKey];
      const { href, emoji, label, emojiLabel } = locker;
      return(
        <div>
          <Input
            className="locker-label-input"
            handleChange={(e) => handleSetLockerLabel({ e, sectionToUpdate: sectionKey, lockerToUpdate: lockerKey, lockerPreferences, setLockerPreferences })}
            key={lockerKey}
            label="Locker label"
            value={label}
          />
          <Input
            className="locker-href-input"
            handleChange={(e) => handleSetLockerLabel({ e, sectionToUpdate: sectionKey, lockerToUpdate: lockerKey, lockerPreferences, setLockerPreferences })}
            key={lockerKey}
            label="Locker url"
            value={href}
          />
          <Input
            className="locker-emoji-input"
            handleChange={(e) => handleSetLockerLabel({ e, sectionToUpdate: sectionKey, lockerToUpdate: lockerKey, lockerPreferences, setLockerPreferences })}
            key={lockerKey}
            label="Locker emoji"
            value={emoji}
          />
        </div>
      );
    })
  }

  return(
    <div className="locker-content organize-locker-form-container">
      <ReturnButton backLink="/personal-locker" buttonLabel="Personal locker" history={history} />
      <h4>Organize your locker</h4>
      <div>
        <Input
          className="label-input"
          handleChange={handleSetPersonalLockerLabel}
          label="Locker label"
          value={lockerLabel}
        />
        {!!lockerPreferences && renderFormForSections()}
      </div>
    </div>
  )
}

export default OrganizeLockerForm;
