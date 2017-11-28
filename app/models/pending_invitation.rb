class PendingInvitation < ActiveRecord::Base

  belongs_to :inviter, class_name: 'User', foreign_key: 'inviter_id'
  has_many :coteacher_classroom_invitations
  TYPES = {coteacher: 'coteacher', school: 'school'}







end
