# frozen_string_literal: true

FactoryBot.define do
  factory :student_response_instructions_text, class: 'StudentResponseInstructionsText' do
    sequence(:text) { |n| "This a student response directions #{n}." }
  end
end
