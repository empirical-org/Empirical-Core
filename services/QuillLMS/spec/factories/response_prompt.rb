# frozen_string_literal: true

FactoryBot.define do
  factory :response_prompt, class: 'ResponsePrompt' do
    sequence(:text) { |n| "This a student response prompt #{n}." }
  end
end
