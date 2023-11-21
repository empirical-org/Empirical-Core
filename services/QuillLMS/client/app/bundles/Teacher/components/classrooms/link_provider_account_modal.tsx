import * as React from 'react';
import { useState } from 'react';
import AuthGoogleAccessForm from '../accounts/AuthGoogleAccessForm';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

interface LinkProviderAccountModalProps {
  close: () => void;
  link?: string;
  provider: string
  user: any;
}

const LinkProviderAccountModal = ({ link, close, provider, user }: LinkProviderAccountModalProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  const toggleCheckbox = () => { setTermsAccepted(!termsAccepted) }

  const renderLinkAccountButton = () => {
    const buttonText = 'Link Account'
    let buttonClass = 'quill-button contained primary medium';

    if (termsAccepted) {
      if (provider === 'Google') { return <AuthGoogleAccessForm buttonClass={buttonClass} offlineAccess={true} text={buttonText} /> }

      return <a className={buttonClass} href={link}>{buttonText}</a>
    } else {
      buttonClass += ' disabled';
      return <button className={buttonClass} type="button">{buttonText}</button>
    }
  }

  const renderCheckbox = () => {
    if (termsAccepted) {
      return (
        <div className="quill-checkbox selected" onClick={toggleCheckbox}>
          <img alt="check" src={smallWhiteCheckSrc} />
        </div>
      )
    } else {
      return <div className="quill-checkbox unselected" onClick={toggleCheckbox} />
    }
  }

  const renderCheckboxes = () => {
    return (
      <div className="checkboxes">
        <div className="checkbox-row">
          {renderCheckbox()}
          <span>
            I understand that I will now log in to Quill via the &ldquo;Log in with {provider}&rdquo; button.
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-container link-provider-account-modal-container">
      <div className="modal-background" />
      <div className="link-provider-account-modal quill-modal modal-body">
        <div>
          <h3 className="title">Link your account to {provider}</h3>
        </div>
        <p>Your email, {user.email}, is not associated with a {provider} account.</p>
        {renderCheckboxes()}
        <div className="form-buttons">
          <button
            className="quill-button outlined secondary medium"
            onClick={close}
            type="button"
          >
            Cancel
          </button>
          {renderLinkAccountButton()}
        </div>
      </div>
    </div>
  )
}

export default LinkProviderAccountModal;
