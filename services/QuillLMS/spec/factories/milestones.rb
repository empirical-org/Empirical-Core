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
FactoryBot.define do
  factory :milestone do
    sequence(:name) { |n| "Example Milestone #{n}" }

    factory :view_lessons_tutorial_milestone do
      name { 'View Lessons Tutorial' }
    end

    factory :complete_diagnostic_milestone do
      name { 'Complete Diagnostic' }
    end

    factory :publish_customized_lesson_milestone do
      name { 'Publish Customized Lesson' }
    end

    factory :complete_customized_lesson_milestone do
      name { 'Complete Customized Lesson' }
    end

    factory :refer_an_active_teacher do
      name { 'Refer an Active Teacher' }
    end

    factory :invite_a_coteacher do
      name { 'Invite a Co-Teacher' }
    end

    factory :acknowledge_lessons_banner do
      name { 'Acknowledge Lessons Banner' }
    end

    factory :acknowledge_diagnostic_banner do
      name { 'Acknowledge Diagnostic Banner' }
    end

    factory :acknowledge_evidence_banner do
      name { 'Acknowledge Evidence Banner' }
    end

    factory :acknowledge_growth_diagnostic_promotion_card do
      name { 'Acknowledge Growth Diagnostic Promotion Card' }
    end

    factory :dismiss_grade_level_warning do
      name { 'Dismiss Grade Level Warning' }
    end

    factory :dismiss_school_selection_reminder do
      name { 'Dismiss School Selection Reminder' }
    end

    factory :dismiss_teacher_info_modal do
      name { 'Dismiss Teacher Info Modal' }
    end

    factory :dismiss_unassign_warning_modal do
      name { 'Dismiss Unassign Warning Modal' }
    end

    factory :see_welcome_modal do
      name { 'See Welcome Modal' }
    end
  end
end
