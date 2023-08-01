import * as React from 'react';
const emptyClassSrc = `${process.env.CDN_URL}/images/illustrations/empty-class.svg`

import { providerConfigLookup } from './providerHelpers'

interface NoClassroomsToImportModalProps {
  close: () => void;
  provider: 'Canvas' | 'Clever' | 'Google';
}

const NoClassroomsToImportModal = ({ close, provider }: NoClassroomsToImportModalProps) => {
  const providerTitle = providerConfigLookup[provider].title

  return (
    <div className='modal-container provider-classrooms-empty-modal-container'>
      <div className='modal-background' />
      <div className='provider-classrooms-empty-modal quill-modal modal-body'>
        <div>
          <h3 className="title">Create classrooms in {providerTitle}</h3>
        </div>
        <div className="no-active-classes">
          <img alt="empty class" src={emptyClassSrc} />
          <p>No classes are available to import yet. Go to {providerTitle} and create classes to import them into Quill.</p>
        </div>
        <div className="form-buttons">
          <button className="quill-button contained primary medium" onClick={close} type="button">Close</button>
        </div>
      </div>
    </div>
  )
}

export default NoClassroomsToImportModal
