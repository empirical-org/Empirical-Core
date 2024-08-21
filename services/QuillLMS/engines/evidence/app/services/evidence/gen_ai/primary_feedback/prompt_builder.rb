# frozen_string_literal: true

module Evidence
  module GenAI
    module PrimaryFeedback
      class PromptBuilder < Evidence::GenAI::PromptBuilder
        TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/primary_feedback/prompts/'
        DEFAULT_TEMPLATE = '2024_08_19_gemini_optimized.md'

        OPTIMAL_SAMPLE_COUNT = 100
        SUBOPTIMAL_SAMPLE_COUNT = 100

        private def template_variables
          {
            passage:,
            plagiarism_text:,
            stem:,
            optimal_examples:,
            suboptimal_examples:
          }
        end

        private def default_template = DEFAULT_TEMPLATE
        private def template_folder = TEMPLATE_FOLDER

        private def optimal_examples = markdown_ul(optimal_example_list)
        private def suboptimal_examples = markdown_ul(suboptimal_example_list)

        private def optimal_example_list = prompt.optimal_samples(limit: OPTIMAL_SAMPLE_COUNT)
        private def suboptimal_example_list = prompt.suboptimal_samples(limit: SUBOPTIMAL_SAMPLE_COUNT)
      end
    end
  end
end
