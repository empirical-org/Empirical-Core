# frozen_string_literal: true

FactoryBot.define do
  factory :evidence_rule_hint, class: 'Evidence::PromptsRule' do
    association :hint, factory: :evidence_hint
    association :rule, factory: :evidence_rule
  end
end
