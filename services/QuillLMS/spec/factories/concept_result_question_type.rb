# frozen_string_literal: true

FactoryBot.define do
  factory :concept_result_question_type do
    sequence(:text) { |n| "question-type-#{n}." }
  end
end
