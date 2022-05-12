# frozen_string_literal: true

FactoryBot.define do
  factory :student_response_previous_feedback_text, class: 'StudentResponsePreviousFeedbackText' do
    sequence(:text) { |n| "This a student response answer #{n}." }
  end
end
