# frozen_string_literal: true

FactoryBot.define do
  factory :concept_result do
    attempt_number { 1 }
    correct { true }
    question_number { 1 }
    activity_session
    answer { 'This is a response answer' }
    concept_result_directions
    concept_result_instructions
    concept_result_previous_feedback
    concept_result_prompt
    concept_result_question_type
  end
end
