import * as React from 'react'

import { requestPost, } from '../../../modules/request'
import { Snackbar, defaultSnackbarTimeout, smallWhiteCheckIcon, indeterminateCheckIcon, Input, } from '../../Shared/index'
import useSnackbarMonitor from '../../Shared/hooks/useSnackbarMonitor'

const ADMIN_REQUEST_MODAL = 'adminRequestModal'
const INVITE_ADMIN_MODAL = 'inviteAdminModal'

const AdminRequestModal = ({ onSuccess, schoolAdmins, closeModal, }) => {
  const [selectedAdminIds, setSelectedAdminIds] = React.useState([])
  const [reason, setReason] = React.useState('')

  function handleChangeReason(e) { setReason(e.target.value) }

  function selectAdmin(id) {
    const newAdminIds = Array.from(new Set(selectedAdminIds.concat([id])))
    setSelectedAdminIds(newAdminIds)
  }

  function unselectAdmin(id) {
    const newAdminIds = selectedAdminIds.filter(k => k !== id)
    setSelectedAdminIds(newAdminIds)
  }

  function renderCheckbox(admin) {
    const {id, name, } = admin

    if (selectedAdminIds.includes(id)) {
      return (
        <button aria-label={`Unselect ${name}`} className="focus-on-light quill-checkbox selected" onClick={() => unselectAdmin(id)} type="button">
          <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
        </button>
      )
    }

    return <button aria-label={`Select ${name}`} className="focus-on-light quill-checkbox unselected" onClick={() => selectAdmin(id)} type="button" />
  }

  function handleClickSendRequest() {
    requestPost(`${process.env.DEFAULT_URL}/admin_access/request_upgrade_to_admin_from_existing_admins`, {
      admin_ids: selectedAdminIds,
      reason
    }, () => {
      onSuccess('Your request has been sent')
    })
  }

  function selectAllAdminIds() { setSelectedAdminIds(schoolAdmins.map(sa => sa.id)) }

  function unselectAllAdminIds() { setSelectedAdminIds([]) }

  function renderTopLevelCheckbox() {
    if (selectedAdminIds.length === 0) {
      return <button aria-label="Select all admins" className="focus-on-light quill-checkbox unselected" onClick={selectAllAdminIds} type="button" />
    } else if (schoolAdmins.length === selectedAdminIds.length) {
      return (
        <button aria-label="Unselect all admins" className="focus-on-light quill-checkbox selected" onClick={unselectAllAdminIds} type="button">
          <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
        </button>
      )
    } else {
      return (
        <button aria-label="Unselect all admins" className="focus-on-light quill-checkbox selected" onClick={unselectAllAdminIds} type="button">
          <img alt={indeterminateCheckIcon.alt} src={indeterminateCheckIcon.src} />
        </button>
      )
    }
  }

  const adminTable = (
    <div className="admin-selection-table">
      <div className="admin-selection-row top-row">
        {renderTopLevelCheckbox()}
        <div>Select all</div>
      </div>
      {schoolAdmins.map(sa => (
        <div className="admin-selection-row" key={sa.id}>
          {renderCheckbox(sa)}
          <div>
            <span className="name">{sa.name}</span>
            <span className="email">{sa.email}</span>
          </div>
        </div>
      ))}
    </div>
  )

  let sendRequestButton = <button className="quill-button medium primary contained focus-on-light" onClick={handleClickSendRequest} type="button">Send request</button>

  if (selectedAdminIds.length === 0) {
    sendRequestButton = <button className="quill-button medium primary contained focus-on-light disabled" disabled type="button">Send request</button>
  }

  return (
    <div className="modal-container admin-request-modal-container">
      <div className="modal-background" />
      <div className="admin-request-modal quill-modal modal-body">
        <h3>Request to become an admin</h3>
        <p>Which admin(s) do you want to send this request to?</p>
        {adminTable}
        <Input
          className="reason"
          handleChange={handleChangeReason}
          label="Why do you want to be an admin?"
          value={reason}
        />
        <div className="button-section">
          <button className="quill-button medium secondary outlined focus-on-light" onClick={closeModal} type="button">Cancel</button>
          {sendRequestButton}
        </div>
      </div>
    </div>
  )
}

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

  function onSuccess(snackbarCopy) {
    setModalToShow(null)
    setSnackbarText(snackbarCopy)
    setShowSnackbar(true)
  }

  function closeModal() {
    setModalToShow(null)
  }

  const learnMoreLink = hasSchoolPremium ? <a href="https://support.quill.org/en/articles/1588988-how-do-i-navigate-the-school-dashboard">Learn more about the Admin Dashboard.</a> : <a href="/premium">Learn more about Quill Premium.</a>
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
          <p key={sa.id}><span>{sa.name}</span><a href={`mailto:${sa.email}`}>Contact</a></p>
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
          <button className={buttonClassName} disabled={!hasVerifiedEmail} type="button">Invite an admin</button>
          <button className={buttonClassName} disabled={!hasVerifiedEmail} type="button">Request to become an admin</button>
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
