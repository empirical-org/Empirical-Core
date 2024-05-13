# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompts
#
#  id                     :bigint           not null, primary key
#  prompt                 :text             not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  llm_prompt_template_id :integer          not null
#
module Evidence
  module Research
    module GenAI
      class LLMPrompt < ApplicationRecord
        FEEDBACK_JSON_SCHEMA = { type: 'object', properties: { feedback: { type: 'string' } } }.to_json

        belongs_to :llm_prompt_template, class_name: 'Evidence::Research::GenAI::LLMPromptTemplate'

        has_many :experiments, class_name: 'Evidence::Research::GenAI::Experiment', dependent: :destroy

        validates :prompt, presence: true
        validates :llm_prompt_template_id, presence: true

        attr_readonly :prompt, :llm_prompt_template_id

        delegate :description, to: :llm_prompt_template

        def self.create_from_template!(llm_prompt_template_id:, passage_prompt_id:)
          create!(
            llm_prompt_template_id:,
            prompt: LLMPromptBuilder.run(llm_prompt_template_id:, passage_prompt_id:)
           )
        end

        def feedback_prompt(response)
          "#{prompt}\n\nResponse: #{response}\nProvide feedback in the following format: #{FEEDBACK_JSON_SCHEMA}"
        end

        def evaluation_prompt(response) = "#{prompt}\n\nResponse: #{response}\nParaphrase:"
      end
    end
  end
end
