# frozen_string_literal: true

FactoryBot.define do
  factory :responses_concepts, class: 'ResponsesConcept' do
    concept
    response
  end
end
