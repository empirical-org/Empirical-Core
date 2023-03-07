import * as React from 'react'

import AdminRequestModal from '../components/admin_access/adminRequestModal'
import InviteAdminModal from '../components/admin_access/inviteAdminModal'
import { requestPost, } from '../../../modules/request'
import { Snackbar, defaultSnackbarTimeout, Input, } from '../../Shared/index'
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor'

const ADMIN_REQUEST_MODAL = 'adminRequestModal'
const INVITE_ADMIN_MODAL = 'inviteAdminModal'

const AdminAccess = ({ school, hasVerifiedEmail, schoolAdmins, hasSchoolPremium, }) => {
  const [modalToShow, setModalToShow] = React.useState(null)
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState('');

  useSnackbarMonitor(showSnackbar, setShowSnackbar, defaultSnackbarTimeout)

  function handleEmailVerificationClick() {
    requestPost(`${process.env.DEFAULT_URL}/verify_emails/require_email_verification`, {}, () => {
      window.location.href = '/sign-up/verify-email'
    })
  }

  function handleClickRequestToBecomeAdmin() {
    if (schoolAdmins.length) {
      setModalToShow(ADMIN_REQUEST_MODAL)
    } else {
      requestPost(`${process.env.DEFAULT_URL}/admin_access/upgrade_to_admin`, {}, () => {
        window.location.href = '/sign-up/verify-school'
      })
    }
  }

  function handleClickInviteAnAdmin() { setModalToShow(INVITE_ADMIN_MODAL) }

  function onSuccess(snackbarCopy) {
    setModalToShow(null)
    setSnackbarText(snackbarCopy)
    setShowSnackbar(true)
  }

  function closeModal() {
    setModalToShow(null)
  }

  const learnMoreLink = hasSchoolPremium ? <a href="https://support.quill.org/en/articles/1588988-how-do-i-navigate-the-school-dashboard" rel="noopener noreferrer" target="_blank">Learn more about the Admin Dashboard</a> : <a href="/premium" rel="noopener noreferrer" target="_blank">Learn more about Quill Premium</a>
  const adminParagraph = <p>Admins {hasSchoolPremium ? '' : 'at schools with Quill Premium'} can manage teacher accounts, access teacher reports, and view school-wide student data.</p>
  const emailVerificationParagraph = hasVerifiedEmail ? '' : (
    <p className="email-verification-paragraph">
      <i className="fas fa-exclamation-triangle" />
      &nbsp;You must verify your email to use these features.&nbsp;
      <button className="interactive-wrapper focus-on-light" onClick={handleEmailVerificationClick} type="button">Verify your email.</button>
    </p>
  )

  let buttonClassName = "quill-button focus-on-light outlined secondary medium"

  buttonClassName += hasVerifiedEmail ? '' : ' disabled'

  const requestToBecomeAdminButton = <button className={buttonClassName} disabled={!hasVerifiedEmail} onClick={handleClickRequestToBecomeAdmin} type="button">Request to become an admin</button>

  let content

  if (schoolAdmins.length) {
    const adminTable = (
      <div className="admin-table">
        <h2>{school.name} admins</h2>
        {schoolAdmins.map(sa => (
          <p key={sa.id}><span>{sa.name}</span><a href={`mailto:${sa.email}`} rel="noopener noreferrer" target="_blank">Contact</a></p>
        ))}
      </div>
    )
    content = (
      <React.Fragment>
        <div className="text">
          {adminParagraph}
          {learnMoreLink}
        </div>
        {adminTable}
        <div className="buttons">
          {requestToBecomeAdminButton}
        </div>
      </React.Fragment>
    )
  } else {
    content = (
      <React.Fragment>
        <div className="text">
          <p><span>{school.name}</span> currently has no admins.</p>
          {adminParagraph}
          {learnMoreLink}
        </div>
        <div className="buttons">
          <button className={buttonClassName} disabled={!hasVerifiedEmail} onClick={handleClickInviteAnAdmin} type="button">Invite an admin</button>
          {requestToBecomeAdminButton}
        </div>
      </React.Fragment>
    )
  }

  return (
    <div className="admin-access-container">
      {modalToShow === ADMIN_REQUEST_MODAL && (
        <AdminRequestModal
          closeModal={closeModal}
          onSuccess={onSuccess}
          schoolAdmins={schoolAdmins}
        />
      )}
      {modalToShow === INVITE_ADMIN_MODAL && (
        <InviteAdminModal
          closeModal={closeModal}
          onSuccess={onSuccess}
        />
      )}
      <Snackbar text={snackbarText} visible={showSnackbar} />
      <section className="admin-access">
        <h1>Admin access</h1>
        {content}
        {emailVerificationParagraph}
      </section>
    </div>
  )
}

export default AdminAccess
