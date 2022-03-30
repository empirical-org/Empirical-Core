import * as React from 'react';
import * as _ from 'lodash';

import ReturnButton from './returnButton';
import { Input } from '../../../Shared';
import { InputEvent } from '../../interfaces/evidenceInterfaces';

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

  function handleSetLockerLabel(e: InputEvent) {
    setLockerLabel(e.target.value)
  }

  function handleSetSectionLabel(e: InputEvent, i: number) {
    const updatedPreferences = {};
    Object.keys(lockerPreferences).map(key => {
      updatedPreferences[key] = {...lockerPreferences[key]}
    })
    updatedPreferences[i].sectionLabel = e.target.value;
    setLockerPreferences(updatedPreferences);
  }

  function renderFormForSections() {
    const sections = Object.keys(lockerPreferences);
    return sections.map((section, i) => {
      const sectionForInput = lockerPreferences[i];
      const { sectionLabel } = sectionForInput;
      return(
        <div>
          <Input
            className="section-input"
            handleChange={(e) => handleSetSectionLabel(e, i)}
            label="Section label"
            value={sectionLabel}
          />
          {renderInputsForIndividualLockers()}
        </div>
      );
    });
  }

  function renderInputsForIndividualLockers() {

  }

  return(
    <div className="locker-content organize-locker-form-container">
      <ReturnButton backLink="/personal-locker" buttonLabel="Personal locker" history={history} />
      <h4>Organize your locker</h4>
      <div>
        <Input
          className="label-input"
          handleChange={handleSetLockerLabel}
          label="Locker label"
          value={lockerLabel}
        />
        {!!lockerPreferences && renderFormForSections()}
      </div>
    </div>
  )
}

export default OrganizeLockerForm;
