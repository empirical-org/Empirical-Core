# frozen_string_literal: true

module Evidence
  module GenAI
    module LabelFeedback
      class PromptBuilder < Evidence::GenAI::PromptBuilder
        TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/label_feedback/prompts/'
        DEFAULT_TEMPLATE = '2024_09_19_rag_examples.md'

        EXAMPLES_LIMIT = 1000
        DEFAULT_RAG_EXAMPLE_LIMIT = 5
        KEY_LIMIT = :limit

        private def template_variables
          {
            rag_label_examples:,
          }
        end

        private def default_template = DEFAULT_TEMPLATE
        private def template_folder = TEMPLATE_FOLDER

        private def label_examples = markdown_table_rows(label_example_data)
        private def rag_label_examples = markdown_table_rows(rag_example_data)

        private def rag_example_data = rag_examples.map {|r| [r.response_text, r.label_transformed]}

        def rag_examples
          Evidence::PromptResponse
            .closest_prompt_texts(prompt.id, entry, example_limit)
        end

        private def example_limit = options[KEY_LIMIT] || DEFAULT_RAG_EXAMPLE_LIMIT

        private def label_example_data
          DataFetcher.run('train.csv')
            .sample(EXAMPLES_LIMIT, random: Random.new(1))
            .sort_by(&:entry)
            .map {|data| [data.entry, data.label]}
        end
      end
    end
  end
end
