FactoryBot.define do
  factory :evidence_automl_model, class: 'Evidence::AutomlModel' do
    sequence(:automl_model_id) { |n| "MODEL-ID-#{n}" }
    name { "AutoML-Model-Name" }
    association :prompt, factory: :evidence_prompt
    state { Evidence::AutomlModel::STATE_INACTIVE }
    labels { ["label1"] }
  end
end
