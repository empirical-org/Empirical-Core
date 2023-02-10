import * as React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { Snackbar, defaultSnackbarTimeout, } from '../../../../Shared/index'
import useSnackbarMonitor from '../../../../Shared/hooks/useSnackbarMonitor'
import { requestPut, requestGet, } from '../../../../../modules/request/index'

const emailVerificationSrc = `${process.env.CDN_URL}/images/onboarding/email_verification.svg`

const VerifySchool = ({ user, }) => {
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  function resendVerification() {
    // TODO: actually resend verification
    setShowSnackbar(true)
  }

  return (
    <div>
      <AssignActivityPackBanner />
      <Snackbar text={`We sent another verification email to ${user.email}`} visible={showSnackbar} />
      <div className="container account-form add-admin-info email-verification">
        <img alt="" src={emailVerificationSrc} />
        <h1>Thanks {user.name.split(' ')[0]}, you&#39;re almost done!</h1>
        <p className="sub-header">We sent an email to {user.email}.<br />Please verify your email to activate your Quill account.</p>
        <p className="body">Didn’t receive an email? <button className="interactive-wrapper" onClick={resendVerification} type="button">Resend verification</button></p>
        <p className="body">Need help? <a href="mailto:hello@quill.org?subject=Help with email verification">Contact support</a></p>
      </div>
    </div>
  )
}

export default VerifySchool
