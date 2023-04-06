import * as React from 'react';

import { requestPost } from '../../../../modules/request/index';

interface CoteacherInvitationProps {
  getClassroomsAndCoteacherInvitations: () => void;
  showSnackbar: (event) => void;
  coteacherInvitation: any;
}

export default class CoteacherInvitation extends React.Component<CoteacherInvitationProps, {}> {
  constructor(props) {
    super(props)

    this.acceptInvitation = this.acceptInvitation.bind(this)
    this.rejectInvitation = this.rejectInvitation.bind(this)
  }

  acceptInvitation() {
    const { getClassroomsAndCoteacherInvitations, coteacherInvitation, showSnackbar, } = this.props
    const dataForInvite = { coteacher_invitation_ids: [coteacherInvitation.id] }
    requestPost('/coteacher_classroom_invitations/accept_pending_coteacher_invitations', dataForInvite, (body) => {
      getClassroomsAndCoteacherInvitations()
      showSnackbar('Invitation accepted')
    })
  }

  rejectInvitation() {
    const { getClassroomsAndCoteacherInvitations, coteacherInvitation, showSnackbar, } = this.props
    const dataForInvite = { coteacher_invitation_ids: [coteacherInvitation.id] }
    requestPost('/coteacher_classroom_invitations/reject_pending_coteacher_invitations', dataForInvite, (body) => {
      getClassroomsAndCoteacherInvitations()
      showSnackbar('Invitation declined')
    })
  }

  render() {
    const { coteacherInvitation } = this.props
    const { classroom_name, inviter_name, inviter_email } = coteacherInvitation
    return (
      <div className="coteacher-invitation">
        <h2>Invitation to co-teach "{classroom_name}"</h2>
        <div className="coteacher-invitation-content">
          <p>{inviter_name} ({inviter_email}) invited you to co-teach.</p>
          <div className="accept-or-decline">
            <span onClick={this.rejectInvitation}>Decline</span>
            <span onClick={this.acceptInvitation}>Accept</span>
          </div>
        </div>
      </div>
    )
  }
}
