import * as React from 'react';
import uuid from 'uuid/v4';
import { useQueryClient } from 'react-query';

import ReturnButton from './returnButton';
import LockerTile from './lockerTile';

import { Input } from '../../../Shared';
import { InputEvent } from '../../interfaces/evidenceInterfaces';
import { renderConfirmationModal } from '../../helpers/locker/lockerHelperFunctions';
import { SAVE, REVERT, DELETE, CANCEL, SAVE_CONFIRMATION, REVERT_CONFIRMATION, DELETE_SECTION_CONFIRMATION } from '../../helpers/locker/lockerConstants';

export const OrganizeLocker = ({ history, personalLocker }) => {
  const [errors, setErrors] = React.useState<any>(null);
  const [lockerLabel, setLockerLabel] = React.useState<string>(personalLocker && personalLocker.label);
  const [lockerPreferences, setLockerPreferences] = React.useState(null);
  const [savelLockerModalOpen, setSavelLockerModalOpen] = React.useState<boolean>(false);
  const [revertlLockerModalOpen, setRevertlLockerModalOpen] = React.useState<boolean>(false);
  const [deletelLockerModalOpen, setDeletelLockerModalOpen] = React.useState<boolean>(false);

  const queryClient = useQueryClient()

  React.useEffect(() => {
    if(personalLocker && personalLocker.label && !lockerLabel) {
      setLockerLabel(personalLocker.label);
    }
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

  function handleRevertLockerPreferences() {
    if(personalLocker && personalLocker.user_id) {
      queryClient.refetchQueries('personal-locker');
    } else {
      setLockerLabel('');
      setLockerPreferences(null);
    }
    toggleRevertLockerPreferencesModal();
  }

  function handleAddSection() {
    const updatedLockerPreferences = {...lockerPreferences};
    updatedLockerPreferences[uuid()] = { label: '', lockers: {} };
    setLockerPreferences(updatedLockerPreferences);
  }

  function handleAddLocker(e) {
    const { target } = e;
    const { value } = target;
    const updatedLockerPreferences = {...lockerPreferences};
    updatedLockerPreferences[value].lockers[uuid()] = { emoji: '', emojiLabel: '', href: '', label: '' };
    setLockerPreferences(updatedLockerPreferences);
  }

  function handleDeleteLocker(sectionKey: string, lockerKey: string) {
    const updatedLockerPreferences = {...lockerPreferences};
    delete updatedLockerPreferences[sectionKey].lockers[lockerKey];
    setLockerPreferences(updatedLockerPreferences);
  }

  function toggleSaveLockerPreferencesModal() {
    setSavelLockerModalOpen(!savelLockerModalOpen);
  }

  function toggleRevertLockerPreferencesModal() {
    setRevertlLockerModalOpen(!revertlLockerModalOpen);
  }

  function toggleDeleteLockerSectionModal() {
    setDeletelLockerModalOpen(!deletelLockerModalOpen);
  }

  function handleDeleteLockerSection(e) {
    const { target } = e;
    const { value } = target;
    const updatedLockerPreferences = {...lockerPreferences};
    delete updatedLockerPreferences[value];
    setLockerPreferences(updatedLockerPreferences);
    toggleDeleteLockerSectionModal()
  }

  function renderPersonalLockerSections() {
    return Object.keys(lockerPreferences).map(sectionKey => {
      const { label, lockers } = lockerPreferences[sectionKey];
      return(
        <div className="locker-sections-container" key={sectionKey}>
          {deletelLockerModalOpen && renderConfirmationModal({ confirmationText: DELETE_SECTION_CONFIRMATION, leftClickHandler: handleDeleteLockerSection, rightClickHandler: toggleDeleteLockerSectionModal, leftButtonText: DELETE, rightButtonText: CANCEL, buttonValue: sectionKey })}
          <div className="upper-locker-section-container">
            <Input
              className="section-input"
              handleChange={(e) => handleSetSectionLabel(e, sectionKey)}
              label="Section label"
              value={label}
            />
            <div className="buttons-container">
              <button className="quill-button focus-on-light fun primary outlined" onClick={handleAddLocker} value={sectionKey}>Add locker</button>
              <button className="quill-button focus-on-light fun primary outlined" onClick={toggleDeleteLockerSectionModal} value={sectionKey}>Delete section</button>
            </div>
          </div>
          <div className="lockers-container">
            {Object.keys(lockers).map(lockerKey => (
              <LockerTile
                handleSetLockerProperty={handleSetLockerProperty}
                handleDeleteLockerForSection={handleDeleteLocker}
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
      {savelLockerModalOpen && renderConfirmationModal({ confirmationText: SAVE_CONFIRMATION, leftClickHandler: handleSaveLockerPreferences, rightClickHandler: toggleSaveLockerPreferencesModal, leftButtonText: SAVE, rightButtonText: CANCEL })}
      {revertlLockerModalOpen && renderConfirmationModal({ confirmationText: REVERT_CONFIRMATION, leftClickHandler: handleRevertLockerPreferences, rightClickHandler: toggleRevertLockerPreferencesModal, leftButtonText: REVERT, rightButtonText: CANCEL })}
      <div className="buttons-container">
        <ReturnButton backLink="/personal-locker" buttonLabel="Personal locker" history={history} />
        <button className="button-container interactive-wrapper focus-on-light organize-button" onClick={toggleSaveLockerPreferencesModal}>
          <p>💾</p>
          <p>Save changes</p>
        </button>
        <button className="button-container interactive-wrapper focus-on-light organize-button" onClick={toggleRevertLockerPreferencesModal}>
          <p>♻</p>
          <p>Revert changes</p>
        </button>
      </div>
      <div className="header-container">
        <h4>Organize your locker</h4>
        <i>Note: this is not a live updating form. In order to persist all personal locker updates, please click the save changes button.</i>
      </div>
      <div className="organize-locker-form-contents">
        <Input
          className="locker-label-input"
          handleChange={handleSetPersonalLockerLabel}
          label="Locker label"
          value={lockerLabel}
        />
        {lockerPreferences && renderPersonalLockerSections()}
        <button className="quill-button focus-on-light fun primary outlined" onClick={handleAddSection} >Add Section</button>
      </div>
    </div>
  )
}

export default OrganizeLocker;
