class Milestone < ActiveRecord::Base
  has_many :user_milestones
  has_many :users, through: :user_milestones

  TYPES = {
    refer_an_active_teacher: 'Refer an Active Teacher',
    invite_a_coteacher: 'Invite a Co-Teacher'
  }
end
