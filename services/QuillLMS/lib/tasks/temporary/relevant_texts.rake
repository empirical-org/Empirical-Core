# frozen_string_literal: true

namespace :relevant_texts do
  desc 'Backfile relevant text and associated records'
  task backfill_relevant_texts_and_co: :environment do
    Evidence::Research::GenAI::Activity.find_each do |activity|
      %w[because but so].each do |conjunction|
        relevant_text_attr = "#{conjunction}_text"
        text = activity.send(relevant_text_attr)
        activity.stem_vaults.where(conjunction:).each do |stem_vault|
          stem_vault.datasets.each do |dataset|
            relevant_text = Evidence::Research::GenAI::RelevantText.find_or_create_by(text:)
            Evidence::Research::GenAI::DatasetRelevantText.find_or_create_by(dataset:, relevant_text:, default: true)
            dataset.trials.each do |trial|
              Evidence::Research::GenAI::LLMPromptRelevantText.find_or_create_by(llm_prompt: trial.llm_prompt, relevant_text:)
            end
          end
        end
      end
    end
  end
end
