# frozen_string_literal: true

FactoryBot.define do
  factory :response_question_type, class: 'ResponseQuestionType' do
    sequence(:text) { |n| "question-type-#{n}." }
  end
end
