class Milestone < ActiveRecord::Base
  has_many :user_milestones
  has_many :users, through: :user_milestones

  TYPES = {
    invite_a_coteacher: 'Invite a Co-Teacher'
  }
end
