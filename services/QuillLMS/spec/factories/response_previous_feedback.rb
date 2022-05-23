# frozen_string_literal: true

FactoryBot.define do
  factory :response_previous_feedback, class: 'ResponsePreviousFeedback' do
    sequence(:text) { |n| "This a student response answer #{n}." }
  end
end
