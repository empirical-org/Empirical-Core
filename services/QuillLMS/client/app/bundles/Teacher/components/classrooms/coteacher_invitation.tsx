import * as React from 'react';

import { requestPost } from '../../../../modules/request/index';
import { Spinner } from '../../../Shared';

interface CoteacherInvitationProps {
  getClassroomsAndCoteacherInvitations: () => void;
  showSnackbar: (event) => void;
  coteacherInvitation: any;
}

const ACCEPT = 'accept'
const REJECT = 'reject'

export const CoteacherInvitation = ({ getClassroomsAndCoteacherInvitations, showSnackbar, coteacherInvitation }: CoteacherInvitationProps) => {

  const [loading, setLoading] = React.useState<boolean>(false);
  const [action, setAction] = React.useState<string>('')

  function acceptInvitation() {
    const dataForInvite = { coteacher_invitation_ids: [coteacherInvitation.id] }
    setAction(ACCEPT)
    setLoading(true)
    requestPost('/coteacher_classroom_invitations/accept_pending_coteacher_invitations', dataForInvite, (body) => {
      getClassroomsAndCoteacherInvitations()
      showSnackbar('Invitation accepted')
      setAction('')
      setLoading(false)
    })
  }

  function rejectInvitation() {
    const dataForInvite = { coteacher_invitation_ids: [coteacherInvitation.id] }
    setAction(REJECT)
    setLoading(true)
    requestPost('/coteacher_classroom_invitations/reject_pending_coteacher_invitations', dataForInvite, (body) => {
      getClassroomsAndCoteacherInvitations()
      showSnackbar('Invitation declined')
      setAction('')
      setLoading(false)
    })
  }

  function renderButtons() {
    if(loading) {
      const isAccepting = action === ACCEPT
      const acceptElement = isAccepting ? <Spinner /> : 'Accept'
      const declineElement = !isAccepting ? <Spinner /> : 'Decline'
      return(
        <div className="accept-or-decline">
          <button className="quill-button secondary outlined small disabled" disabled={true} onClick={rejectInvitation}>{declineElement}</button>
          <button className="quill-button primary contained small disabled" disabled={true} onClick={acceptInvitation}>{acceptElement}</button>
        </div>
      )
    }
    return(
      <div className="accept-or-decline">
        <button className="quill-button secondary outlined small focus-on-light" onClick={rejectInvitation}>Decline</button>
        <button className="quill-button primary contained small focus-on-light" onClick={acceptInvitation}>Accept</button>
      </div>
    )
  }

  return (
    <div className="coteacher-invitation">
      <h2>Invitation to co-teach "{coteacherInvitation.classroom_name}"</h2>
      <div className="coteacher-invitation-content">
        <p>{coteacherInvitation.inviter_name} ({coteacherInvitation.inviter_email}) invited you to co-teach.</p>
        {renderButtons()}
      </div>
    </div>
  )
}

export default CoteacherInvitation
