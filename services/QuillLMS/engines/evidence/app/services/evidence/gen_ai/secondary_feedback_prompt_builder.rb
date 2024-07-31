# frozen_string_literal: true

module Evidence
  module GenAI
    class SecondaryFeedbackPromptBuilder < PromptBuilder
      TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/secondary_feedback_prompts/'
      DEFAULT_TEMPLATE = '2024_07_17_with_highlight.md'
      EXAMPLE_LIMIT = 100

      private def template_variables
        {
          highlight_texts:,
          primary_secondary_examples:,
          plagiarism_text:
        }
      end

      private def default_template = DEFAULT_TEMPLATE
      private def template_folder = TEMPLATE_FOLDER

      private def primary_secondary_examples = markdown_table_rows(feedback_data_tuples)
      private def feedback_data_tuples = feedback_data.map { |f| [f.primary, f.secondary] }

      private def conjunctions = [prompt.conjunction]
      private def limit = EXAMPLE_LIMIT

      private def feedback_data
        @feedback_data ||= Evidence::GenAI::SecondaryFeedbackDataFetcher.run(conjunctions:, limit:)
      end
    end
  end
end
