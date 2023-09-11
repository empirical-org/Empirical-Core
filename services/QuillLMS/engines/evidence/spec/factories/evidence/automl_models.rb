# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_automl_models
#
#  id              :integer          not null, primary key
#  automl_model_id :string           not null
#  name            :string           not null
#  labels          :string           default([]), is an Array
#  prompt_id       :integer
#  state           :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  notes           :text             default("")
#
FactoryBot.define do
  factory :evidence_automl_model, class: Evidence::AutomlModel do
    sequence(:external_id) { |n| "MODEL-ID-#{n}" }
    name { "AutoML-Model-Name" }
    association :prompt, factory: :evidence_prompt
    state { Evidence::AutomlModel::STATE_INACTIVE }
    labels { ["label1"] }
  end
end
