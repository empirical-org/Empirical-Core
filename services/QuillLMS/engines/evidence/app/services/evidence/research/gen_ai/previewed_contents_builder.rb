# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class PreviewedContentsBuilder < ApplicationService
        attr_reader :colored_contents, :llm_prompt_template

        def initialize(colored_contents:, llm_prompt_template:)
          @colored_contents = colored_contents
          @llm_prompt_template = llm_prompt_template
        end

        def run
          LLMPromptBuilder.run(
            dataset_id: dataset.id,
            guidelines: dataset.guidelines,
            llm_prompt_template_id: llm_prompt_template.id,
            prompt_examples: dataset.prompt_examples,
            text: colored_contents
          )
        end

        private def dataset
          @dataset ||= Dataset.find(ENV.fetch('PREVIEWED_DATASET_ID', Dataset.first.id))
        end
      end
    end
  end
end
