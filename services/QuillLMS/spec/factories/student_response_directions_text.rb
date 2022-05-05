# frozen_string_literal: true

FactoryBot.define do
  factory :student_response_directions_text, class: 'StudentResponseDirectionsText' do
    sequence(:text) { |n| "This a student response directions #{n}." }
  end
end
