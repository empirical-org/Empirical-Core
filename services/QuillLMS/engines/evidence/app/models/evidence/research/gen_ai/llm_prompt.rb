# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompts
#
#  id                          :bigint           not null, primary key
#  locked                      :boolean          not null
#  optimal_examples_count      :integer          not null
#  optimal_guidelines_count    :integer          not null
#  prompt                      :text             not null
#  suboptimal_examples_count   :integer          not null
#  suboptimal_guidelines_count :integer          not null
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  llm_prompt_template_id      :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMPrompt < ApplicationRecord
        FEEDBACK_JSON_SCHEMA = { 'optimal': 'boolean', 'feedback': 'string' }.to_json

        belongs_to :llm_prompt_template
        belongs_to :trial

        validates :prompt, presence: true
        validates :llm_prompt_template_id, presence: true
        validates :optimal_guidelines_count, presence: true
        validates :suboptimal_guidelines_count, presence: true
        validates :optimal_examples_count, presence: true
        validates :suboptimal_examples_count, presence: true

        attr_readonly :prompt,
          :llm_prompt_template_id,
          :optimal_guidelines_count,
          :suboptimal_guidelines_count,
          :optimal_examples_count,
          :suboptimal_examples_count

        delegate :description, to: :llm_prompt_template

        def self.create_from_template!(llm_prompt_template_id:, dataset_id:)
          create!(
            llm_prompt_template_id:,
            prompt: LLMPromptBuilder.run(llm_prompt_template_id:, dataset_id:)
           )
        end

        def feedback_prompt(response)
          "#{prompt}\n\nResponse: #{response}\nProvide feedback in the following JSON format: #{FEEDBACK_JSON_SCHEMA}"
        end
      end
    end
  end
end
