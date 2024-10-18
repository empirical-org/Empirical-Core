# frozen_string_literal: true

module Evidence
  module GenAI
    module LabelFeedback
      class PromptBuilder < Evidence::GenAI::PromptBuilder
        TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/label_feedback/prompts/'
        DEFAULT_TEMPLATE = '2024_09_19_rag_examples.md'

        EXAMPLES_LIMIT = 500
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

        private def rag_example_data = rag_examples.map {|r| [r.entry, r.label_transformed]}

        private def prompt_ids = [prompt.id, Evidence::LabeledEntry::OFFSET_AUTOML_ENTRY + prompt.id]

        private def dataset_prompt_id = Evidence::LabeledEntry::OFFSET_SCRAP_DATA + prompt.id

        def rag_examples
          Evidence::LabeledEntry
            .closest_prompt_texts(prompt_id: prompt.id, entry:, limit: example_limit, dataset_prompt_id:)
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
