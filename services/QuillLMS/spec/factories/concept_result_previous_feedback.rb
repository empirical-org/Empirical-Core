# frozen_string_literal: true

FactoryBot.define do
  factory :concept_result_previous_feedback do
    sequence(:text) { |n| "This a student response answer #{n}." }
  end
end
