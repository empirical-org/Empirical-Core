import * as React from 'react'

import { requestPost } from '../../../../modules/request'
import { indeterminateCheckIcon, Input, smallWhiteCheckIcon } from '../../../Shared/index'

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

export default AdminRequestModal
