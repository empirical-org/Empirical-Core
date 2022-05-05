# frozen_string_literal: true

FactoryBot.define do
  factory :student_responses_concepts, class: 'StudentResponsesConcept' do
    concept
    student_response
  end
end
