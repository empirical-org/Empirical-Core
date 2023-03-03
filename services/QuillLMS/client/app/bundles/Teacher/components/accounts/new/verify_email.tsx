import * as React from 'react';
import qs from 'qs'

import AssignActivityPackBanner from '../assignActivityPackBanner'
import { Snackbar, defaultSnackbarTimeout, Spinner, ADMIN, TEACHER, } from '../../../../Shared/index'
import useSnackbarMonitor from '../../../../Shared/hooks/useSnackbarMonitor'
import { requestPut, requestPost, } from '../../../../../modules/request/index'

const emailVerificationSrc = `${process.env.CDN_URL}/images/onboarding/email_verification.svg`

const VerifyEmail = ({ user, location, }) => {
  const token = qs.parse(location.search.replace('?', '')).token

  const [showSnackbar, setShowSnackbar] = React.useState(false)
  const [snackbarText, setSnackbarText] = React.useState('')
  const [loading, setLoading] = React.useState(!!token)

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  React.useEffect(() => {
    if (token) {
      verifyToken()
    }
  }, [])

  function redirectToLogin() {
    requestPost(
      '/session/set_post_auth_redirect',
      { post_auth_redirect: window.location.href },
      () => window.location.href = '/session/new'
    );
  }

  function resendVerification() {
    requestPut(`${process.env.DEFAULT_URL}/verify_emails/resend_verification_email`, {}, () => {
      setSnackbarText(`We sent another verification email to ${user.email}`)
      setShowSnackbar(true)
    })
  }

  function verifyToken() {
    requestPut(`${process.env.DEFAULT_URL}/verify_emails/verify_by_token`, { token, },
      () => {
        window.location.href = user.role === ADMIN ? '/sign-up/select-sub-role' : '/profile'
      },
      (body) => {
        if (user) {
          setLoading(false)
          setSnackbarText(body.error)
          setShowSnackbar(true)
        } else {
          redirectToLogin()
        }
      }
    )
  }

  if (loading) {
    return (
      <Spinner />
    )
  }

  return (
    <div>
      <AssignActivityPackBanner />
      <Snackbar text={snackbarText} visible={showSnackbar} />
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

export default VerifyEmail
