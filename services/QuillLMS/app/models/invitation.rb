class Invitation < ActiveRecord::Base

  belongs_to :inviter, class_name: 'User', foreign_key: 'inviter_id'
  has_many :coteacher_classroom_invitations, dependent: :destroy

  before_save :downcase_fields

  TYPES = {coteacher: 'coteacher', school: 'school'}
  STATUSES = {pending: 'pending', accepted: 'accepted', rejected: 'rejected'}


  def downcase_fields
    self.invitee_email.downcase!
  end


end
