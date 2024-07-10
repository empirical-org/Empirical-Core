# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_automl_models
#
#  id                   :bigint           not null, primary key
#  labels               :string           default([]), is an Array
#  name                 :string           not null
#  notes                :text             default("")
#  project              :string           not null
#  state                :string           not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  endpoint_external_id :string           not null
#  model_external_id    :string           not null
#  prompt_id            :bigint
#
# Indexes
#
#  index_evidence_automl_models_on_prompt_id  (prompt_id)
#
# Foreign Keys
#
#  fk_rails_...  (prompt_id => comprehension_prompts.id)
#

FactoryBot.define do
  factory :evidence_automl_model, class: 'Evidence::AutomlModel' do
    sequence(:model_external_id) { |n| "MODEL-ID-#{n}" }
    sequence(:endpoint_external_id) { |n| "ENDPOINT-ID-#{n}" }
    name { 'AutoML-Model-Name' }
    association :prompt, factory: :evidence_prompt
    state { Evidence::AutomlModel::STATE_INACTIVE }
    labels { ['label1'] }
    notes { '' }
    project { 'comprehension' }

    trait(:active) { state { Evidence::AutomlModel::STATE_ACTIVE } }
    trait(:inactive) { state { Evidence::AutomlModel::STATE_INACTIVE } }
  end
end
