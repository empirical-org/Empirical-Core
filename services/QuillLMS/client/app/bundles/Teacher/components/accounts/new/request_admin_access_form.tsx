import * as React from 'react';

import SkipForNow from './skip_for_now'

import AdminTable from '../../admin_access/adminTable'
import { Input, } from '../../../../Shared/index'
import { requestPost, } from '../../../../../modules/request/index'

const schoolVerificationSrc = `${process.env.CDN_URL}/images/onboarding/school_verification.svg`

const RequestAdminAccessForm = ({ schoolName, admins, }) => {
  const [selectedAdminIds, setSelectedAdminIds] = React.useState([])
  const [reason, setReason] = React.useState('')

  function handleChangeReason(e) { setReason(e.target.value) }

  function handleClickSubmit() {
    requestPost(`${process.env.DEFAULT_URL}/admin_access/request_upgrade_to_admin_from_existing_admins`, {
      admin_ids: selectedAdminIds,
      new_user: true,
      reason
    }, () => {
      window.location = '/finish_sign_up'
    })
  }

  const submitButtonClassName = "quill-button primary contained medium focus-on-light"
  let submitButton = <button className={`${submitButtonClassName} disabled`} disabled type="button">Submit</button>

  if (selectedAdminIds.length) {
    submitButton = <button className={submitButtonClassName} onClick={handleClickSubmit} type="button">Submit</button>
  }

  return (
    <React.Fragment>
      <img alt="" src={schoolVerificationSrc} />
      <h1><span>Please request permission to become an admin of:</span><span className="school-name">{schoolName}</span></h1>
      <p className="sub-header">Which admin(s) do you want to send the request to?</p>
      <section className="user-account-section admin-access-request-section">
        <AdminTable schoolAdmins={admins} selectedAdminIds={selectedAdminIds} setSelectedAdminIds={setSelectedAdminIds} />
        <Input
          className="reason"
          handleChange={handleChangeReason}
          label="Why do you want to be an admin?"
          value={reason}
        />
      </section>
      <div className="button-wrapper">
        {submitButton}
      </div>
      <SkipForNow />
    </React.Fragment>
  )
}

export default RequestAdminAccessForm
