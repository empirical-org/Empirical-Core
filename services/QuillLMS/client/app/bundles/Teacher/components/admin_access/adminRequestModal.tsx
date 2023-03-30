import * as React from 'react'

import AdminTable from './adminTable'

import { requestPost, } from '../../../../modules/request'
import { Input, } from '../../../Shared/index'

const AdminRequestModal = ({ onSuccess, schoolAdmins, closeModal, }) => {
  const [selectedAdminIds, setSelectedAdminIds] = React.useState([])
  const [reason, setReason] = React.useState('')

  function handleChangeReason(e) { setReason(e.target.value) }

  function handleClickSendRequest() {
    requestPost(`${process.env.DEFAULT_URL}/admin_access/request_upgrade_to_admin_from_existing_admins`, {
      admin_ids: selectedAdminIds,
      new_user: false,
      reason
    }, () => {
      onSuccess('Your request has been sent')
    })
  }

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
        <AdminTable schoolAdmins={schoolAdmins} selectedAdminIds={selectedAdminIds} setSelectedAdminIds={setSelectedAdminIds} />
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

export default AdminRequestModal
