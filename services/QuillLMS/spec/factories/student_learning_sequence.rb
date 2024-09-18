# frozen_string_literal: true

FactoryBot.define do
  factory :student_learning_sequence do
    association :initial_activity, factory: :pre_diagnostic_activity
    association :initial_classroom_unit, factory: :classroom_unit
    user
  end
end
