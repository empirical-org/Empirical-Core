# frozen_string_literal: true

module Evidence
  module GenAI
    module RepeatedFeedback
      class PromptBuilder < Evidence::GenAI::PromptBuilder
        TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/repeated_feedback/prompts/'
        DEFAULT_TEMPLATE = '2024_08_15_ask_identical.md'

        private def template_variables = { feedback_history: }

        private def default_template = DEFAULT_TEMPLATE
        private def template_folder = TEMPLATE_FOLDER
      end
    end
  end
end
