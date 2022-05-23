# frozen_string_literal: true

FactoryBot.define do
  factory :response_directions, class: 'ResponseDirections' do
    sequence(:text) { |n| "This a student response directions #{n}." }
  end
end
