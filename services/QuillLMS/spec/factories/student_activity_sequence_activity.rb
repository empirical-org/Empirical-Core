# frozen_string_literal: true

FactoryBot.define do
  factory :student_activity_sequence_activity do
    association :activity
    association :classroom_unit
    association :student_activity_sequence
  end
end
