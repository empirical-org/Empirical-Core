# frozen_string_literal: true

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
class Milestone < ApplicationRecord
  has_many :user_milestones
  has_many :users, through: :user_milestones

  TYPES = {
    refer_an_active_teacher: 'Refer an Active Teacher',
    invite_a_coteacher: 'Invite a Co-Teacher',
    see_welcome_modal: 'See Welcome Modal',
    acknowledge_diagnostic_banner: 'Acknowledge Diagnostic Banner',
    acknowledge_evidence_banner: 'Acknowledge Evidence Banner',
    acknowledge_lessons_banner: 'Acknowledge Lessons Banner',
    acknowledge_growth_diagnostic_promotion_card: 'Acknowledge Growth Diagnostic Promotion Card',
    dismiss_grade_level_warning: 'Dismiss Grade Level Warning'
  }
end
