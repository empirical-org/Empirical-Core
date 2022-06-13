# frozen_string_literal: true

class InvitationEmailWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL


  def perform(invitation_id)
    invitation = Invitation.find_by(id: invitation_id)
    return unless invitation&.inviter

    email_vars = invitation.attributes
    email_vars[:inviter_name] = invitation.inviter.name
    email_vars[:inviter_email] = invitation.inviter.email
    email_vars[:classroom_names] = []
    email_vars[:coteacher_classroom_invitation_ids] = []

    invitation.coteacher_classroom_invitations.each do |ctc|
      if ctc.classroom
        email_vars[:classroom_names] << ctc.classroom.name
        email_vars[:coteacher_classroom_invitation_ids] << ctc.id
      end
    end

    return unless email_vars[:classroom_names].length

    invitee_in_db = User.find_by(email: invitation.invitee_email)
    if invitee_in_db
      email_vars[:invitee_first_name] = invitee_in_db.first_name
      invitee_in_db.send_invitation_to_existing_user(email_vars)
    else
      email_vars[:referral_code] = invitation.inviter.referral_code
      invitation.inviter.send_invitation_to_non_existing_user(email_vars)
    end
  end
end
