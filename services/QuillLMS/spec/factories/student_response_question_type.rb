# frozen_string_literal: true

FactoryBot.define do
  factory :student_response_question_type, class: 'StudentResponseQuestionType' do
    sequence(:text) { |n| "question-type-#{n}." }
  end
end
