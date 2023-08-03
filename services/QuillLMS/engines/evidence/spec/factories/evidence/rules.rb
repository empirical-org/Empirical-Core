# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_rules
#
#  id          :integer          not null, primary key
#  uid         :string           not null
#  name        :string           not null
#  note        :string
#  universal   :boolean          not null
#  rule_type   :string           not null
#  optimal     :boolean          not null
#  suborder    :integer
#  concept_uid :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  state       :string           not null
#  hint_id     :bigint
#
FactoryBot.define do
  factory :evidence_rule do
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
