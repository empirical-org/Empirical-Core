FactoryBot.define do
  factory :comprehension_prompts_rule, class: 'Comprehension::PromptsRule' do
    association :prompt, factory: :comprehension_prompt
    association :rule, factory: :comprehension_rule
  end
end
