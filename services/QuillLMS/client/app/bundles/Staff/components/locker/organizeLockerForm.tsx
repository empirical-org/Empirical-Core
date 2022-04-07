import * as React from 'react';
import * as _ from 'lodash';

import ReturnButton from './returnButton';
import { Input, SortableList } from '../../../Shared';
import { InputEvent } from '../../interfaces/evidenceInterfaces';
import { handleSetSectionLabel, handleSetLockerLabel } from '../../helpers/locker/lockerHelperFunctions';

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

  function renderFormForSections() {
    const sections = Object.keys(lockerPreferences);
    return sections.map((section, sectionKey) => {
      const sectionForInput = lockerPreferences[sectionKey];
      const { sectionLabel } = sectionForInput;
      return(
        <div>
          <Input
            className="section-input"
            handleChange={(e) => handleSetSectionLabel({ e, sectionToUpdate: sectionKey, lockerPreferences, setLockerPreferences })}
            key={sectionKey}
            label="Section label"
            value={sectionLabel}
          />
          <SortableList data={renderInputsForIndividualLockers(sectionKey)} />
          {/* {renderInputsForIndividualLockers(sectionKey)} */}
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
            handleChange={(e) => handleSetLockerLabel({ e, sectionToUpdate: sectionKey, lockerToUpdate: lockerKey, lockerPreferences, setLockerPreferences, attribute: 'label' })}
            key={lockerKey}
            label="Locker label"
            value={label}
          />
          <Input
            className="locker-href-input"
            handleChange={(e) => handleSetLockerLabel({ e, sectionToUpdate: sectionKey, lockerToUpdate: lockerKey, lockerPreferences, setLockerPreferences, attribute: 'href' })}
            key={lockerKey}
            label="Locker url"
            value={href}
          />
          <Input
            className="locker-emoji-input"
            handleChange={(e) => handleSetLockerLabel({ e, sectionToUpdate: sectionKey, lockerToUpdate: lockerKey, lockerPreferences, setLockerPreferences, attribute: 'emoji' })}
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
