import * as React from 'react'
import AdminVerificationModal from './adminVerificationModal'

const DenyModal = ({ deny, closeModal, }) => (
  <AdminVerificationModal
    bodyText="The user will be sent an email informing them of the decision. This request will be moved to the “Completed” tab."
    closeModal={closeModal}
    confirmFunction={deny}
    headerText="Deny this request?"
  />
)

export default DenyModal
