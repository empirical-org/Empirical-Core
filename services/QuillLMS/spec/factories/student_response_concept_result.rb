# frozen_string_literal: true

FactoryBot.define do
  factory :student_response_concept_result, class: 'StudentResponseConceptResult' do
    concept_result
    student_response
  end
end
