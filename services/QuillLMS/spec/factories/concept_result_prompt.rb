# frozen_string_literal: true

FactoryBot.define do
  factory :concept_result_prompt do
    sequence(:text) { |n| "This a student response prompt #{n}." }
  end
end
