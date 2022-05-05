# frozen_string_literal: true

FactoryBot.define do
  factory :student_response, class: 'StudentResponse' do
    attempt_number { 1 }
    correct { true }
    question_number { 1 }
    activity_session
    question
    student_response_answer_text
    student_response_directions_text
    student_response_prompt_text
#    student_response_question_type
  end
end
