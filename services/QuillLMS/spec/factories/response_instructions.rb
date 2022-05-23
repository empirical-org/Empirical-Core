# frozen_string_literal: true

FactoryBot.define do
  factory :response_instructions, class: 'ResponseInstructions' do
    sequence(:text) { |n| "This a student response directions #{n}." }
  end
end
