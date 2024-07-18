# frozen_string_literal: true

module Evidence
  module GenAI
    class SecondaryFeedbackPromptBuilder < PromptBuilder
      TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/secondary_feedback_prompts/'
      DEFAULT_TEMPLATE = '2024_07_17_initial.md'

      OPTIMAL_SAMPLE_COUNT = 100
      SUBOPTIMAL_SAMPLE_COUNT = 100

      private def template_variables
        {
          plagiarism_text:
        }
      end

      private def default_template = DEFAULT_TEMPLATE
      private def template_folder = TEMPLATE_FOLDER
    end
  end
end
