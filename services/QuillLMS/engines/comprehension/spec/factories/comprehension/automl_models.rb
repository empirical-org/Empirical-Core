FactoryBot.define do
  factory :comprehension_automl_model, class: 'Comprehension::AutomlModel' do
    sequence(:automl_model_id) { |n| "MODEL-ID-#{n}" }
    name { "AutoML-Model-Name" }
    association :prompt, factory: :comprehension_prompt
    state { Comprehension::AutomlModel::STATE_INACTIVE }
    labels { ["label1"] }
  end
end
