# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMPromptBuilder < ApplicationService
        attr_reader :llm_prompt_template_id, :passage_prompt_id

        def initialize(llm_prompt_template_id:, passage_prompt_id:)
          @llm_prompt_template_id = llm_prompt_template_id
          @passage_prompt_id = passage_prompt_id
        end

        def run
          LLMPrompt.create!(llm_prompt_template_id:, prompt:)
        end

        private def llm_prompt_template = LLMPromptTemplate.find(llm_prompt_template_id)

        # TODO: this is a placeholder for injection
        private def prompt = llm_prompt_template.contents
      end
    end
  end
end
