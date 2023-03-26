import Picker from 'emoji-picker-react';
import * as React from 'react';


import { closeIcon, Input, Modal } from '../../../Shared';
import { CANCEL, DELETE, DELETE_LOCKER_CONFIRMATION } from '../../helpers/locker/lockerConstants';
import { renderConfirmationModal } from '../../helpers/locker/lockerHelperFunctions';
import { InputEvent } from '../../interfaces/evidenceInterfaces';

export const PersonalLockerTile = ({ handleDeleteLockerForSection, handleSetLockerProperty, locker, lockerKey, sectionKey }) => {
  const [showOrganizeLockerModal, setShowOrganizeLockerModal] = React.useState<boolean>(false);
  const [label, setLabel] = React.useState<any>(locker.label);
  const [url, setUrl] = React.useState<any>(locker.href);
  const [showEmojiSelector, setShowEmojiSelector] = React.useState<boolean>(false);
  const [showDeleteLockerModal, setShowDeleteLockerModal] = React.useState<boolean>(false);
  const [emoji, setEmoji] = React.useState<any>(locker.emoji);

  function toggleShowEmojiSelector() {
    setShowEmojiSelector(!showEmojiSelector);
  }

  function toggleShowDeleteLockerModal() {
    setShowDeleteLockerModal(!showDeleteLockerModal);
  }

  function handleEmojiClick(e: any, emojiObject: { emoji: string, names: string[]}) {
    handleSetLockerProperty({ value: emojiObject, sectionKey, lockerKey, property: 'emoji' });
    setEmoji(emojiObject.emoji);
    toggleShowEmojiSelector();
  };

  function toggleShowOrganizeLockerModal() {
    setShowOrganizeLockerModal(!showOrganizeLockerModal)
  }

  function handleSetLockerLabel(e: InputEvent) {
    const { target } = e;
    const { value } = target;
    handleSetLockerProperty({ value, sectionKey, lockerKey, property: 'label' });
    setLabel(value);
  }

  function handleSetLockerUrl(e: InputEvent) {
    const { target } = e;
    const { value } = target;
    handleSetLockerProperty({ value, sectionKey, lockerKey, property: 'href' });
    setUrl(value);
  }

  function handleDeleteLocker(e: InputEvent) {
    handleDeleteLockerForSection(sectionKey, lockerKey);
    toggleShowDeleteLockerModal();
    toggleShowOrganizeLockerModal();
  }

  function renderOrganizeLockerModal() {
    return(
      <Modal>
        <div className="organize-locker-modal">
          <div className="close-button-container">
            <button className="interactive-wrapper focus-on-light" onClick={toggleShowOrganizeLockerModal}><img alt={closeIcon.alt} src={closeIcon.src} /></button>
          </div>
          <Input
            className="locker-input"
            handleChange={handleSetLockerLabel}
            key={sectionKey}
            label="Locker label"
            value={label}
          />
          <Input
            className="locker-input"
            handleChange={handleSetLockerUrl}
            key={sectionKey}
            label="Locker url"
            value={url}
          />
          <div className="emoji-container">
            <p className="emoji-label">Selected emoji: </p>
            <p className="emoji">{emoji}</p>
          </div>
          {showEmojiSelector && <Picker onEmojiClick={handleEmojiClick} />}
          <button className="interactive-wrapper focus-on-light change-emoji-button" onClick={toggleShowEmojiSelector}>Change emoji</button>
          <div className="buttons-container">
            <button className="quill-button focus-on-light fun primary outlined" onClick={toggleShowOrganizeLockerModal}>Accept changes</button>
            <button className="quill-button focus-on-light fun primary outlined" onClick={toggleShowDeleteLockerModal}>Delete locker</button>
          </div>
        </div>
      </Modal>
    );
  }

  const isEmptyLocker = !locker.label;

  return(
    <React.Fragment>
      {showOrganizeLockerModal && renderOrganizeLockerModal()}
      {showDeleteLockerModal && renderConfirmationModal({ confirmationText: DELETE_LOCKER_CONFIRMATION, leftClickHandler: handleDeleteLocker, rightClickHandler: toggleShowDeleteLockerModal, leftButtonText: DELETE, rightButtonText: CANCEL })}
      <button className="locker-container interactive-wrapper focus-on-light" onClick={toggleShowOrganizeLockerModal}>
        {!isEmptyLocker && <div className="left-side-contents">
          <span aria-label={locker.emojiLabel} className="emoji-image" role="img">{emoji}</span>
          <p className="locker-label">{locker.label}</p>
        </div>}
        {isEmptyLocker && <p className="edit-locker">Click to edit</p>}
      </button>
    </React.Fragment>
  )
}

export default PersonalLockerTile;
