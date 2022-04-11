import * as React from 'react';
import Picker from 'emoji-picker-react';


import { Input, Modal, closeIcon } from '../../../Shared';
import { InputEvent } from '../../interfaces/evidenceInterfaces';
import { renderConfirmationModal } from '../../helpers/locker/lockerHelperFunctions';
import { DELETE, CANCEL, DELETE_LOCKER_CONFIRMATION } from '../../helpers/locker/lockerConstants';

export const LockerTile = ({ handleDeleteLockerForSection, handleSetLockerProperty, locker, lockerKey, lockerPreferences, sectionKey }) => {
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

  function handleEmojiClick(event, emojiObject) {
    handleSetLockerProperty({ value: emojiObject.emoji, sectionKey, lockerKey, property: 'emoji' });
    handleSetLockerProperty({ value: emojiObject.names[0], sectionKey, lockerKey, property: 'emojiLabel' });
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

  function handleDeleteLocker(e) {
    handleDeleteLockerForSection(sectionKey, lockerKey);
    toggleShowDeleteLockerModal();
    toggleShowOrganizeLockerModal();
  }

  // function renderDeleteLockerModal() {
  //   return(
  //     <Modal>
  //       <p>Are you sure that you want to delete this locker?</p>
  //       <div className="buttons-container">
  //         <button className="quill-button focus-on-light fun primary outlined" onClick={handleDeleteLocker}>Delete</button>
  //         <button className="quill-button focus-on-light fun primary outlined" onClick={toggleShowDeleteLockerModal}>Cancel</button>
  //       </div>
  //     </Modal>
  //   );
  // }

  function renderOrganizeLockerModal() {
    return(
      <Modal>
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
          <p>Selected emoji: </p>
          <p className="emoji">{emoji}</p>
        </div>
        {showEmojiSelector && <Picker onEmojiClick={handleEmojiClick} />}
        <button className="interactive-wrapper focus-on-light change-emoji-button" onClick={toggleShowEmojiSelector}>Change emoji</button>
        <button className="quill-button focus-on-light fun primary outlined" onClick={toggleShowDeleteLockerModal}>Delete locker</button>
      </Modal>
    );
  }

  return(
    <React.Fragment>
      {showOrganizeLockerModal && renderOrganizeLockerModal()}
      {showDeleteLockerModal && renderConfirmationModal({ confirmationText: DELETE_LOCKER_CONFIRMATION, leftClickHandler: handleDeleteLocker, rightClickHandler: toggleShowDeleteLockerModal, leftButtonText: DELETE, rightButtonText: CANCEL })}
      {/* {showDeleteLockerModal && renderDeleteLockerModal()} */}
      <button className="locker-container interactive-wrapper focus-on-light" onClick={toggleShowOrganizeLockerModal}>
        <div className="left-side-contents">
          <span aria-label={locker.emojiLabel} className="emoji-image" role="img">{emoji}</span>
          <p className="locker-label">{locker.label}</p>
        </div>
      </button>
    </React.Fragment>
  )
}

export default LockerTile;
