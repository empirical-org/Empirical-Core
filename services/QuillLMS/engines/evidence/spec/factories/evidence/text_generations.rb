# frozen_string_literal: true

FactoryBot.define do
  factory :evidence_text_generation, class: 'Evidence::TextGeneration' do
    type  Evidence::TextGeneration::TYPE_ORIGINAL
  end
end
