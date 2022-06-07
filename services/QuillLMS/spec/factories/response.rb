# frozen_string_literal: true

FactoryBot.define do
  factory :response, class: 'Response' do
    attempt_number { 1 }
    correct { true }
    question_number { 1 }
    activity_session
    answer { 'This is a response answer' }
    response_directions
    response_instructions
    response_previous_feedback
    response_prompt
    response_question_type
  end
end
