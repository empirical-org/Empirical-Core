# frozen_string_literal: true

FactoryBot.define do
  factory :response_answer, class: 'ResponseAnswer' do
    sequence(:json) { |n| "This a student response answer #{n}." }
  end
end
