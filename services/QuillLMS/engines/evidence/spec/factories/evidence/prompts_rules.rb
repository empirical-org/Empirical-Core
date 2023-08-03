# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_prompts_rules
#
#  id         :integer          not null, primary key
#  prompt_id  :integer          not null
#  rule_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :evidence_prompts_rule do
    association :prompt, factory: :evidence_prompt
    association :rule, factory: :evidence_rule
  end
end
