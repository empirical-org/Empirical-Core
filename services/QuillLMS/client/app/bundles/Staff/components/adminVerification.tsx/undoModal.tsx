import * as React from 'react'

import AdminVerificationModal from './adminVerificationModal'

const UndoModal = ({ undo, closeModal, }) => (
  <AdminVerificationModal
    bodyText="This request will be moved to the “Pending” tab. No email will be sent to the user informing them of this change. Please contact the user directly as needed."
    closeModal={closeModal}
    confirmFunction={undo}
    headerText="Undo this decision?"
  />
)

export default UndoModal
