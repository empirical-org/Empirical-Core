import * as React from 'react';
import AuthGoogleAccessForm from '../accounts/AuthGoogleAccessForm';

interface ReauthorizeProviderModalProps {
  close: () => void;
  link: string;
  provider: 'Canvas' | 'Clever' | 'Google';
}

const ReauthorizeModal = ({ close, link, provider }: ReauthorizeProviderModalProps) => {
  function handleReauthorizeClick() {
    if (provider !== 'Google') { window.location.href = link; }
  }

  return (
    <div className='modal-container reauthorize-provider-modal-container'>
      <div className='modal-background' />
      <div className='reauthorize-provider-modal quill-modal modal-body'>
        <div>
          <h3 className='title'>
            Reauthorize {provider}
          </h3>
        </div>
        <p>
          To import a new {provider} classroom, you need to reauthorize {provider} access.
          <br />
          Clicking reauthorize will re-direct you to {provider}.
        </p>
        <div className='form-buttons'>
          <button className='quill-button focus-on-light outlined secondary medium' onClick={close} type='button'>
            Cancel
          </button>
          {provider === 'Google' ?
            <AuthGoogleAccessForm
              buttonClass='quill-button focus-on-light contained primary medium'
              text='Reauthorize'
            />
            :
            <button
              className='quill-button focus-on-light contained primary medium'
              onClick={handleReauthorizeClick}
              type='button'
            >
              Reauthorize
            </button>}
        </div>
      </div>
    </div>
  )
}

export default ReauthorizeModal
