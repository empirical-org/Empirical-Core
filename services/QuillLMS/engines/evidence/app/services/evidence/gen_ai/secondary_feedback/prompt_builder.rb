# frozen_string_literal: true

module Evidence
  module GenAI
    module SecondaryFeedback
      class PromptBuilder < Evidence::GenAI::PromptBuilder
        TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/secondary_feedback/prompts/'
        DEFAULT_TEMPLATE = '2024_09_12_gemini.md'
        EXAMPLE_LIMIT = 20

        private def template_variables
          {
            highlight_texts:,
            primary_secondary_examples:,
            plagiarism_text:
          }
        end

        private def default_template = DEFAULT_TEMPLATE
        private def template_folder = TEMPLATE_FOLDER

        # private def primary_secondary_examples = feedback_data_json.join("\n")
        # private def feedback_data_json = feedback_data.map { |f| {original_feedback: strip_tags(f.primary), secondary_feedback: strip_tags(f.secondary)}.to_json }

        private def primary_secondary_examples = markdown_table_rows(feedback_data_tuples)
        private def feedback_data_tuples = feedback_data.map { |f| [strip_tags(f.primary), strip_tags(f.secondary)] }

        private def conjunctions = [prompt.conjunction]
        private def limit = EXAMPLE_LIMIT

        private def feedback_data
          @feedback_data ||= Evidence::GenAI::SecondaryFeedback::DataFetcher.run(conjunctions:, limit:)
        end
      end
    end
  end
end
