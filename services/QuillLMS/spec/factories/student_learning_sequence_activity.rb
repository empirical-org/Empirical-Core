# frozen_string_literal: true

FactoryBot.define do
  factory :student_learning_sequence_activity do
    association :activity
    association :classroom_unit
    association :student_learning_sequence
  end
end
