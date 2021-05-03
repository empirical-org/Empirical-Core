# == Schema Information
#
# Table name: milestones
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime
#  updated_at :datetime
#
# Indexes
#
#  index_milestones_on_name  (name)
#
class Milestone < ActiveRecord::Base
  has_many :user_milestones
  has_many :users, through: :user_milestones

  TYPES = {
    refer_an_active_teacher: 'Refer an Active Teacher',
    invite_a_coteacher: 'Invite a Co-Teacher',
    see_welcome_modal: 'See Welcome Modal',
    acknowledge_diagnostic_banner: 'Acknowledge Diagnostic Banner',
    acknowledge_lessons_banner: 'Acknowledge Lessons Banner'
  }
end
