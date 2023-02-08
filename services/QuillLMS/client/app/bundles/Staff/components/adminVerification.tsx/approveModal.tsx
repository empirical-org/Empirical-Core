import * as React from 'react'
import AdminVerificationModal from './adminVerificationModal'

const ApproveModal = ({ approve, closeModal, }) => (
  <AdminVerificationModal
    bodyText="The user will be sent an email informing them of the decision. This request will be moved to the “Completed requests” tab."
    closeModal={closeModal}
    confirmFunction={approve}
    headerText="Approve this request?"
  />
)

export default ApproveModal
