# frozen_string_literal: true

FactoryBot.define do
  factory :student_learning_sequence_activity do
    activity
    classroom_unit
    student_learning_sequence
  end
end
