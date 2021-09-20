FactoryBot.define do
  factory :evidence_prompts_rule, class: 'Evidence::PromptsRule' do
    association :prompt, factory: :evidence_prompt
    association :rule, factory: :evidence_rule
  end
end
