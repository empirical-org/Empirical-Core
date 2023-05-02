# frozen_string_literal: true

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
