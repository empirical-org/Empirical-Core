# frozen_string_literal: true

module Evidence
  class GenAiRecordBuilder < ApplicationService
    attr_reader :activity, :relevant_texts

    def initialize(activity, relevant_texts)
      @activity = activity
      @relevant_texts = relevant_texts
    end

    def run
      return unless activity.gen_ai?

      ActiveRecord::Base.transaction do
        relevant_texts.keys.each do |relevant_text_key|
          prompt = find_prompt(relevant_text_key)

          gen_ai_activity = create_or_update_gen_ai_activity(prompt, relevant_text_key)

          create_or_update_stem_vault(prompt, gen_ai_activity)
        end
      end
    end

    def find_prompt(relevant_text_key)
      conjunction = Evidence::Research::GenAI::StemVault::RELEVANT_TEXTS.key(relevant_text_key.to_sym)
      activity.prompts.find_by(conjunction:)
    end

    def create_or_update_gen_ai_activity(prompt, relevant_text_key)
      gen_ai_activity = prompt.stem_vault&.activity || Evidence::Research::GenAI::Activity.find_or_initialize_by(name: activity.title)
      gen_ai_activity.text = activity.passages.first&.text
      gen_ai_activity[relevant_text_key] = relevant_texts[relevant_text_key]

      gen_ai_activity.save!
      gen_ai_activity
    end

    def create_or_update_stem_vault(prompt, gen_ai_activity)
      stem_vault = Evidence::Research::GenAI::StemVault.find_or_initialize_by(
        prompt: prompt,
        activity: gen_ai_activity,
        conjunction: prompt.conjunction
      )

      stem_vault.stem = prompt.text.rpartition(prompt.conjunction).first.strip
      stem_vault.save!
      stem_vault
    end
  end
end
