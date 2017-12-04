class InvitationEmailWorker
  include Sidekiq::Worker

  def perform(invitation_id)
    invitation = Invitation.find(invitation_id)
    email_vars = invitation.attributes
    email_vars[:inviter_name] = invitation.inviter.name
    email_vars[:classroom_names] = invitation.coteacher_classroom_invitations.map(&:classroom).map(&:name)
    invitee_in_db = User.find_by(email: invitation.invitee_email)
    if invitee_in_db
      email_vars[:invitee_first_name] = invitee_in_db.first_name
      UserMailer.invitation_to_existing_user(email_vars)
    else
      UserMailer.invitation_to_non_existing_user(email_vars)
    end
  end


end
