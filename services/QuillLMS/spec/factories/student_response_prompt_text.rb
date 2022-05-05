# frozen_string_literal: true

FactoryBot.define do
  factory :student_response_prompt_text, class: 'StudentResponsePromptText' do
    sequence(:text) { |n| "This a student response prompt #{n}." }
  end
end
