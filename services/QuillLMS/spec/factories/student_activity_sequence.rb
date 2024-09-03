# frozen_string_literal: true

FactoryBot.define do
  factory :student_activity_sequence do
    association :classroom
    association :initial_activity, factory: :pre_diagnostic_activity
    association :initial_classroom_unit, factory: :classroom_unit
    association :user
  end
end
