class Invitation < ActiveRecord::Base

  belongs_to :inviter, class_name: 'User', foreign_key: 'inviter_id'
  has_many :coteacher_classroom_invitations, dependent: :destroy

  before_save :downcase_fields, :validate_invitation_limit

  TYPES = {coteacher: 'coteacher', school: 'school'}
  STATUSES = {pending: 'pending', accepted: 'accepted', rejected: 'rejected'}
  MAX_COTEACHER_INVITATIONS_PER_TIME = 50
  MAX_COTEACHER_INVITATIONS_PER_TIME_LIMIT_RESET_HOURS = 24



  def downcase_fields
    self.invitee_email.downcase!
  end

  def validate_invitation_limit
    # In order to avoid letting people use our platform to spam folks,
    # we want to put some limits on the number of invitations a user can issue.
    # One of those limits is a cap on invitations per user per time period
    recent_invitation_count = Invitation.where(inviter_id: self.inviter_id, invitation_type: TYPES[:coteacher], created_at: MAX_COTEACHER_INVITATIONS_PER_TIME_LIMIT_RESET_HOURS.hours.ago..Time.now).count()
    if recent_invitation_count >= MAX_COTEACHER_INVITATIONS_PER_TIME
      raise StandardError.new("User #{self.inviter_id} has reached the maximum of #{MAX_COTEACHER_INVITATIONS_PER_TIME} coteacher invitations that they can issue in a #{MAX_COTEACHER_INVITATIONS_PER_TIME_LIMIT_RESET_HOURS} hour period")
    end
  end

end
