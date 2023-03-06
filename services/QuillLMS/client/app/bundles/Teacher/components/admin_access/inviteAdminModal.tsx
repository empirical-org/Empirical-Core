import * as React from 'react'

import { requestPost, } from '../../../../modules/request'
import { smallWhiteCheckIcon, indeterminateCheckIcon, Input, } from '../../../Shared/index'

const InviteAdminModal = ({ onSuccess, closeModal, }) => {
  const [adminName, setAdminName] = React.useState('')
  const [adminEmail, setAdminEmail] = React.useState('')
  const [note, setNote] = React.useState('')

  function handleChangeAdminName(e) { setAdminName(e.target.value) }
  function handleChangeAdminEmail(e) { setAdminEmail(e.target.value) }
  function handleChangeNote(e) { setNote(e.target.value) }

  function handleClickSendRequest() {
    requestPost(`${process.env.DEFAULT_URL}/admin_access/invite_admin`, {
      admin_name: adminName,
      admin_email: adminEmail,
      note
    }, () => {
      onSuccess('Your request has been sent')
    })
  }

  let sendInviteButton = <button className="quill-button medium primary contained focus-on-light" onClick={handleClickSendRequest} type="button">Send request</button>

  if (adminEmail.length === 0 || adminName.length === 0) {
    sendInviteButton = <button className="quill-button medium primary contained focus-on-light disabled" disabled type="button">Send invite</button>
  }

  return (
    <div className="modal-container invite-admin-modal-container">
      <div className="modal-background" />
      <div className="invite-admin-modal quill-modal modal-body">
        <h3>Invite an admin</h3>
        <p>Which admin do you want to send this request to?</p>
        <Input
          className="name"
          handleChange={handleChangeAdminName}
          label="Admin’s name"
          value={adminName}
        />
        <Input
          className="email"
          handleChange={handleChangeAdminEmail}
          label="Admin’s email"
          value={adminEmail}
        />
        <Input
          className="note"
          handleChange={handleChangeNote}
          label="Note to admin (optional)"
          value={note}
        />
        <div className="button-section">
          <button className="quill-button medium secondary outlined focus-on-light" onClick={closeModal} type="button">Cancel</button>
          {sendInviteButton}
        </div>
      </div>
    </div>
  )
}

export default InviteAdminModal
