# frozen_string_literal: true

FactoryBot.define do
  factory :evidence_label, class: 'Evidence::Label' do
    name { "some label name" }
    association :rule, factory: :evidence_rule
  end
end
