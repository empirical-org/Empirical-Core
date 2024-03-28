# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_prompt_templates
#
#  id          :bigint           not null, primary key
#  coda        :string           default("feedback"), not null
#  contents    :text             not null
#  description :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class LLMPromptTemplate < ApplicationRecord
        CODAS = [
          FEEDBACK_CODA = 'feedback',
          CHAIN_OF_THOUGHT_CODA = 'chain_of_thought',
          EVALUATION_CODA = 'evaluation'
        ].freeze

        DISPLAY_CODA = {
          CHAIN_OF_THOUGHT_CODA => 'Chain-of-Thought',
          EVALUATION_CODA => 'Evaluation',
          FEEDBACK_CODA => 'Feedback'
        }.freeze

        validates :coda, presence: true, inclusion: { in: CODAS }
        validates :contents, presence: true
        validates :description, presence: true

        attr_readonly :coda, :contents, :description

        has_many :llm_prompts,
          class_name: 'Evidence::Research::GenAI::LLMPrompt',
          dependent: :destroy

        def display_coda = DISPLAY_CODA[coda]

        def to_s = description
      end
    end
  end
end
