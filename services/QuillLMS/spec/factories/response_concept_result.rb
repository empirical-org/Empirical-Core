# frozen_string_literal: true

FactoryBot.define do
  factory :response_concept_result, class: 'ResponseConceptResult' do
    concept_result
    response
  end
end
