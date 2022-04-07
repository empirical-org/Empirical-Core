import * as React from 'react';

import { Input, Modal } from '../../../Shared';
import { InputEvent } from '../../interfaces/evidenceInterfaces';

export const LockerTile = ({ handleSetLockerProperty, locker, lockerKey, lockerPreferences, sectionKey }) => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [label, setLabel] = React.useState<any>(locker.label)
  const [url, setUrl] = React.useState<any>(locker.href)
  const [emoji, setEmoji] = React.useState<any>(locker.emoji)

  function handleClick() {
    setModalOpen(!modalOpen)
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

  function renderModalContents() {
    return(
      <div>
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
        <div>
          <button className="quill-button focus-on-light medium primary contained">Save</button>
          <button className="quill-button focus-on-light medium primary contained" onClick={handleClick} >Cancel</button>
        </div>
      </div>
    );
  }

  return(
    <React.Fragment>
      {modalOpen &&
        <Modal>
          {renderModalContents()}
        </Modal>
      }
      <button className="locker-container interactive-wrapper focus-on-light" onClick={handleClick}>
        <div className="left-side-contents">
          <span aria-label={locker.emojiLabel} className="emoji-image" role="img">{emoji}</span>
          <p className="locker-label">{locker.label}</p>
        </div>
      </button>
    </React.Fragment>
  )
}

export default LockerTile;
