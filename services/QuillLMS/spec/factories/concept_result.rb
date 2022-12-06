# frozen_string_literal: true

FactoryBot.define do
  factory :concept_result do
    activity_session
    answer { 'This is a response answer' }
    attempt_number { 1 }
    concept
    concept_result_directions
    concept_result_instructions
    concept_result_previous_feedback
    concept_result_prompt
    concept_result_question_type
    correct { true }
    question_number { 1 }
  end
end
