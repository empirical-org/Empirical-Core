# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_prompt_text_batches
#
#  id         :bigint           not null, primary key
#  type       :string           not null
#  prompt_id  :integer          not null
#  config     :jsonb
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :evidence_prompt_text_batch, class: 'Evidence::PromptTextBatch' do
    association :prompt, factory: :evidence_prompt

    factory :seed_prompt_text_batch do
      type Evidence::PromptTextBatch::TYPE_SEED
    end

    factory :labeled_prompt_text_batch do
      type Evidence::PromptTextBatch::TYPE_LABELED
    end
  end
end
