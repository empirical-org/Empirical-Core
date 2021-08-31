FactoryBot.define do
  factory :evidence_rule, class: 'Evidence::Rule' do
    uid { SecureRandom.uuid }
    name { "Test Rule" }
    note { "This rule is a test" }
    universal { false }
    rule_type { "rules-based-1" }
    optimal { false }
    state { Evidence::Rule::STATE_INACTIVE }
    suborder { 1 }
    concept_uid { "ConceptUID" }
  end
end
