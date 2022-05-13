# frozen_string_literal: true

FactoryBot.define do
  factory :student_response_answer_text, class: 'StudentResponseAnswerText' do
    sequence(:text) { |n| "This a student response answer #{n}." }
  end
end
