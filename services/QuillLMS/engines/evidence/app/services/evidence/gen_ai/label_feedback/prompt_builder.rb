# frozen_string_literal: true

module Evidence
  module GenAI
    module LabelFeedback
      class PromptBuilder < Evidence::GenAI::PromptBuilder
        TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/label_feedback/prompts/'
        DEFAULT_TEMPLATE = '2024_09_18_initial.md'

        EXAMPLES_LIMIT = 1000

        private def template_variables
          {
            label_examples:,
          }
        end

        private def default_template = DEFAULT_TEMPLATE
        private def template_folder = TEMPLATE_FOLDER

        private def label_examples = markdown_table_rows(label_example_data)

        private def label_example_data
          DataFetcher.run
            .sample(EXAMPLES_LIMIT, random: Random.new(1))
            .map {|data| [data.entry, data.label]}
        end

      end
    end
  end
end
