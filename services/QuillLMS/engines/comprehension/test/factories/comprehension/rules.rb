FactoryBot.define do
  factory :comprehension_rule, class: 'Comprehension::Rule' do
    uid { SecureRandom.uuid }
    name { "Test Rule" }
    description { "This rule is a test" }
    universal { false }
    rule_type { "plagiarism" }
    optimal { false }
    state { Comprehension::Rule::STATE_INACTIVE }
    suborder { 1 }
    concept_uid { "ConceptUID" }
  end
end
