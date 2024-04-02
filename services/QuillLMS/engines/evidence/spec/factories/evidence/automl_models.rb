# frozen_string_literal: true

FactoryBot.define do
  factory :evidence_automl_model, class: 'Evidence::AutomlModel' do
    sequence(:model_external_id) { |n| "MODEL-ID-#{n}" }
    sequence(:endpoint_external_id) { |n| "ENDPOINT-ID-#{n}" }
    name { "AutoML-Model-Name" }
    association :prompt, factory: :evidence_prompt
    state { Evidence::AutomlModel::STATE_INACTIVE }
    labels { ["label1"] }
    notes { '' }

    trait(:active) { state { Evidence::AutomlModel::STATE_ACTIVE } }
    trait(:inactive) { state { Evidence::AutomlModel::STATE_INACTIVE } }
  end
end
