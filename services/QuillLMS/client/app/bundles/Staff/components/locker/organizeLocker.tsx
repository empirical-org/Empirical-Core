import * as React from 'react';
import uuid from 'uuid/v4';
import _ from 'lodash';
import { useQueryClient } from 'react-query';

import ReturnButton from './returnButton';
import PersonalLockerTile from './personalLockerTile';

import { DropdownInput, Input, Modal } from '../../../Shared';
import { DropdownObjectInterface, InputEvent } from '../../interfaces/evidenceInterfaces';
import { renderConfirmationModal, validateLockerForm } from '../../helpers/locker/lockerHelperFunctions';
import { SAVE, REVERT, DELETE, CANCEL, SAVE_CONFIRMATION, REVERT_CONFIRMATION, DELETE_SECTION_CONFIRMATION, lockerItemOptions } from '../../helpers/locker/lockerConstants';
import { lockerItems } from '../../helpers/locker/lockerItems';
import { titleCase } from '../../helpers/evidence/miscHelpers';
import { createLocker, updateLocker } from '../../utils/evidence/lockerAPIs';

export const OrganizeLocker = ({ history, personalLocker, userId }) => {
  const [errors, setErrors] = React.useState<any>(null);
  const [lockerLabel, setLockerLabel] = React.useState<string>(personalLocker && personalLocker.label);
  const [lockerPreferences, setLockerPreferences] = React.useState(null);
  const [savelLockerModalOpen, setSavelLockerModalOpen] = React.useState<boolean>(false);
  const [revertlLockerModalOpen, setRevertlLockerModalOpen] = React.useState<boolean>(false);
  const [deletelLockerModalOpen, setDeletelLockerModalOpen] = React.useState<boolean>(false);
  const [addLockerModalOpen, setAddLockerModalOpen] = React.useState<boolean>(false);
  const [addExistingLockerModalOpen, setAddExistingLockerModalOpen] = React.useState<boolean>(false);
  const [sectionToUpdate, setSectionToUpdate] = React.useState<string>(null);
  const [existingLockerSelection, setExistingLockerSelection] = React.useState<DropdownObjectInterface>(lockerItemOptions[0]);

  const queryClient = useQueryClient();

  React.useEffect(() => {
    if(personalLocker && personalLocker.label && !lockerLabel) {
      setLockerLabel(personalLocker.label);
    }
    if(personalLocker && personalLocker.preferences && !lockerPreferences) {
      setLockerPreferences(personalLocker.preferences);
    }
  }, [personalLocker]);

  function handleSetPersonalLockerLabel(e: InputEvent) {
    const { target } = e;
    const { value } = target;
    setLockerLabel(value)
  }

  function handleSetSectionLabel(e: InputEvent, sectionKey: string) {
    const { target } = e;
    const { value } = target;
    const updatedLockerPreferences = _.cloneDeep(lockerPreferences);
    updatedLockerPreferences[sectionKey].label = value;
    setLockerPreferences(updatedLockerPreferences);
  }

  function handleSetLockerProperty({ value, sectionKey, lockerKey, property }: { value: any, sectionKey: number, lockerKey: string, property: string }) {
    const updatedLockerPreferences = _.cloneDeep(lockerPreferences);
    if(property === 'emoji') {
      const { emoji, names } = value;
      updatedLockerPreferences[sectionKey].lockers[lockerKey].emoji = emoji;
      updatedLockerPreferences[sectionKey].lockers[lockerKey].emojiLabel = names[0];
      setLockerPreferences(updatedLockerPreferences);
    } else {
      updatedLockerPreferences[sectionKey].lockers[lockerKey][property] = value;
      setLockerPreferences(updatedLockerPreferences);
    }
  }

  function handleSaveLockerPreferences() {
    const locker = {
      user_id: userId,
      label: lockerLabel,
      preferences: lockerPreferences || {}
    }
    const errors = validateLockerForm(locker);
    if(Object.keys(errors).length) {
      setErrors(errors)
    } else {
      setErrors(null);
      if(personalLocker && personalLocker.user_id) {
        updateLocker(userId, locker).then((response) => {
          if(response && !response.error) {
            queryClient.refetchQueries('personal-locker');
            history.push('/personal-locker')
          } else {
            const { error } = response;
            errors['submissionError'] = error
            setErrors(errors);;
          }
        });
      } else {
        createLocker(userId, locker).then((response) => {
          if(response && !response.error) {
            queryClient.refetchQueries('personal-locker');
            history.push('/personal-locker')
          } else {
            const { error } = response;
            errors['submissionError'] = error
            setErrors(errors);
          }
        });
      }
    }
    toggleSaveLockerPreferencesModal()
  }

  function handleRevertLockerPreferences() {
    if(personalLocker && personalLocker.user_id) {
      const { label, preferences } = personalLocker
      setLockerLabel(label);
      setLockerPreferences(preferences);
    } else {
      setLockerLabel('');
      setLockerPreferences(null);
    }
    toggleRevertLockerPreferencesModal();
  }

  function handleAddSection() {
    let updatedLockerPreferences = _.cloneDeep(lockerPreferences);
    updatedLockerPreferences[uuid()] = { label: '', lockers: {} };
    setLockerPreferences(updatedLockerPreferences);
  }

  function handleAddLocker(e) {
    const updatedLockerPreferences = _.cloneDeep(lockerPreferences);
    updatedLockerPreferences[sectionToUpdate].lockers[uuid()] = { emoji: '', emojiLabel: '', href: '', label: '' };
    setLockerPreferences(updatedLockerPreferences);
    toggleAddLockerSectionModal(e);
  }

  function handleAddExistingLocker(e) {
    const { value } = existingLockerSelection;
    const existingLocker = {...lockerItems[value]};
    existingLocker.label = titleCase(existingLocker.label);
    const updatedLockerPreferences = _.cloneDeep(lockerPreferences);
    updatedLockerPreferences[sectionToUpdate].lockers[uuid()] = existingLocker;
    setLockerPreferences(updatedLockerPreferences);
    toggleAddExistingLockerSectionModal();
    toggleAddLockerSectionModal(e);
  }

  function handleDeleteLocker(sectionKey: string, lockerKey: string) {
    const updatedLockerPreferences = _.cloneDeep(lockerPreferences);
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

  function toggleAddLockerSectionModal(e) {
    const { target } = e;
    const { value } = target;
    if(!sectionToUpdate) {
      setSectionToUpdate(value);
    }
    if(addLockerModalOpen) {
      // reset on close
      setSectionToUpdate(null);
    }
    setAddLockerModalOpen(!addLockerModalOpen);
  }

  function toggleAddExistingLockerSectionModal() {
    setAddExistingLockerModalOpen(!addExistingLockerModalOpen);
  }

  function handleDeleteLockerSection(e) {
    const { target } = e;
    const { value } = target;
    const updatedLockerPreferences = _.cloneDeep(lockerPreferences);
    delete updatedLockerPreferences[value];
    setLockerPreferences(updatedLockerPreferences);
    toggleDeleteLockerSectionModal()
  }

  function handleExistingLockerSelectionChange(option: DropdownObjectInterface) {
    setExistingLockerSelection(option);
  }

  function renderAddLockerModal() {
    return(
      <Modal>
        <div className="buttons-container">
          <button className="quill-button focus-on-light fun primary outlined" onClick={toggleAddExistingLockerSectionModal}>Select existing locker</button>
          <button className="quill-button focus-on-light fun primary outlined" onClick={handleAddLocker}>Add custom locker</button>
          <button className="quill-button focus-on-light fun primary outlined" onClick={toggleAddLockerSectionModal}>{CANCEL}</button>
        </div>
      </Modal>
    );
  }

  function renderAddExistingLockerModal() {
    return(
      <Modal>
        <div className="existing-locker-selection-container">
          <div className="buttons-container">
            <button className="quill-button focus-on-light fun primary outlined" onClick={handleAddExistingLocker}>Add</button>
            <button className="quill-button focus-on-light fun primary outlined" onClick={toggleAddExistingLockerSectionModal}>{CANCEL}</button>
          </div>
          <DropdownInput
            className="existing-locker-options"
            handleChange={handleExistingLockerSelectionChange}
            isSearchable={true}
            label="Select existing locker"
            options={lockerItemOptions}
            value={existingLockerSelection}
          />
        </div>
      </Modal>
    );
  }

  function renderPersonalLockerSections() {
    return Object.keys(lockerPreferences).map(sectionKey => {
      const { label, lockers } = lockerPreferences[sectionKey];
      return(
        <div className="locker-sections-container" key={sectionKey}>
          {deletelLockerModalOpen && renderConfirmationModal({ confirmationText: DELETE_SECTION_CONFIRMATION, leftClickHandler: handleDeleteLockerSection, rightClickHandler: toggleDeleteLockerSectionModal, leftButtonText: DELETE, rightButtonText: CANCEL, buttonValue: sectionKey })}
          {addLockerModalOpen && renderAddLockerModal()}
          {addExistingLockerModalOpen && renderAddExistingLockerModal()}
          <div className="upper-locker-section-container">
            <Input
              className="section-input"
              error={errors && errors[sectionKey]}
              handleChange={(e) => handleSetSectionLabel(e, sectionKey)}
              label="Section label"
              value={label}
            />
            <div className="buttons-container">
              <button className="quill-button focus-on-light fun primary outlined" onClick={toggleAddLockerSectionModal} value={sectionKey}>Add locker</button>
              <button className="quill-button focus-on-light fun primary outlined" onClick={toggleDeleteLockerSectionModal} value={sectionKey}>Delete section</button>
            </div>
          </div>
          <div className="lockers-container">
            {Object.keys(lockers).map(lockerKey => (
              <PersonalLockerTile
                handleDeleteLockerForSection={handleDeleteLocker}
                handleSetLockerProperty={handleSetLockerProperty}
                key={lockerKey}
                locker={lockers[lockerKey]}
                lockerKey={lockerKey}
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
          <span aria-label="floppy disk" role="img">💾</span>
          <p>Save changes</p>
        </button>
        <button className="button-container interactive-wrapper focus-on-light organize-button" onClick={toggleRevertLockerPreferencesModal}>
          <span aria-label="recycle sign" role="img">♻</span>
          <p>Revert changes</p>
        </button>
      </div>
      <div className="header-container">
        <h4>Organize your lockers</h4>
        <i>Note: this is not a live updating form. In order to persist all personal locker updates, please click the save changes button. Also, be sure to add "https://" to the beginning of locker URLs.</i>
        {errors && errors['submissionError'] && <p className="error-text">{errors['submissionError']}</p>}
      </div>
      <div className="organize-locker-form-contents">
        <Input
          className="locker-label-input"
          error={errors && errors['label']}
          handleChange={handleSetPersonalLockerLabel}
          label="Collection label"
          value={lockerLabel}
        />
        {lockerPreferences && renderPersonalLockerSections()}
        <button className="quill-button focus-on-light fun primary outlined" onClick={handleAddSection} >Add Section</button>
      </div>
    </div>
  )
}

export default OrganizeLocker;
