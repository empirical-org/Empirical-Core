import * as React from 'react';
import uuid from 'uuid/v4';

import ReturnButton from './returnButton';
import LockerTile from './lockerTile';

import { Input, Modal } from '../../../Shared';
import { InputEvent } from '../../interfaces/evidenceInterfaces';

export const OrganizeLocker = ({ history, personalLocker }) => {
  const [errors, setErrors] = React.useState<any>(null);
  const [lockerLabel, setLockerLabel] = React.useState<string>(personalLocker && personalLocker.label);
  const [lockerPreferences, setLockerPreferences] = React.useState(null);
  const [savelLockerModalOpen, setSavelLockerModalOpen] = React.useState<boolean>(false);

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

  function handleSaveLockerPreferences() {
    history.push('/personal-locker')
  }

  function handleAddSection() {
    const updatedLockerPreferences = {...lockerPreferences};
    updatedLockerPreferences[uuid()] = { label: '', lockers: {} };
    setLockerPreferences(updatedLockerPreferences);
  }

  function toggleSaveLockerPreferencesModal() {
    setSavelLockerModalOpen(!savelLockerModalOpen);
  }

  function handleDeleteSection(e) {
    const { target } = e;
    const { value } = target;
    const updatedLockerPreferences = {...lockerPreferences};
    delete updatedLockerPreferences[value];
    setLockerPreferences(updatedLockerPreferences);
  }

  function renderSaveLockerPreferencesModal() {
    return(
      <Modal>
        <p>Are you sure that you want to save these changes?</p>
        <div>
          <button className="quill-button focus-on-light fun primary contained" onClick={handleSaveLockerPreferences}>Save</button>
          <button className="quill-button focus-on-light fun primary contained" onClick={toggleSaveLockerPreferencesModal}>Cancel</button>
        </div>
      </Modal>
    );
  }


  function renderPersonalLockerSections() {
    return Object.keys(lockerPreferences).map(sectionKey => {
      const { label, lockers } = lockerPreferences[sectionKey];
      return(
        <div className="locker-sections-container" key={sectionKey}>
          <div className="upper-locker-section-container">
            <Input
              className="section-input"
              handleChange={(e) => handleSetSectionLabel(e, sectionKey)}
              label="Section label"
              value={label}
            />
            <button className="quill-button focus-on-light fun primary contained" onClick={handleDeleteSection} value={sectionKey}>Delete section</button>
          </div>
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
      {savelLockerModalOpen && renderSaveLockerPreferencesModal()}
      <div className="buttons-container">
        <ReturnButton backLink="/personal-locker" buttonLabel="Personal locker" history={history} />
        <button className="button-container interactive-wrapper focus-on-light organize-button" onClick={toggleSaveLockerPreferencesModal}>
          <p>⚙️</p>
          <p>Save changes</p>
        </button>
      </div>
      <div className="header-container">
        <h4>Organize your locker</h4>
        <i>Note: edits will only persist on this page after closing modals for individual lockers. In order to persist all personal locker updates, click the save changes button.</i>
      </div>
      <div className="organize-locker-form-contents">
        <Input
          className="locker-label-input"
          handleChange={handleSetPersonalLockerLabel}
          label="Locker label"
          value={lockerLabel}
        />
        {lockerPreferences && renderPersonalLockerSections()}
        <button className="quill-button focus-on-light fun primary contained" onClick={handleAddSection} >Add Section</button>
      </div>
    </div>
  )
}

export default OrganizeLocker;
