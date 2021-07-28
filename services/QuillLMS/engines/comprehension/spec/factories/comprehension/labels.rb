FactoryBot.define do
  factory :comprehension_label, class: 'Comprehension::Label' do
    name { "some label name" }
    association :rule, factory: :comprehension_rule
  end
end
