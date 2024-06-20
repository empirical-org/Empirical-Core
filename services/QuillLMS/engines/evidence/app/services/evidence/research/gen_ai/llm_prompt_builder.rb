# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMPromptBuilder < ApplicationService
        include ActiveModel::Validations

        # Sample usage of delimiter in an LLMPromptTemplate
        # Insert prompt:
        # ~~~prompt~~~
        #
        # Regexp.last_match(1)&.to_i will be nil in this case

        # Insert prompt examples:
        # ~~~prompt_examples~~~
        #
        # Regexp.last_match(1)&.to_i will be 20 in this case

        DELIMITER = "~~~"
        EXAMPLES_SUBSTITUTION = 'prompt_examples'

        ACTIVITY_SUBSTITUTIONS = {
          "stem" => ->(builder, _) { builder.stem_vault.stem },
          "conjunction" => ->(builder, _) { builder.stem_vault.conjunction },
          "because_text" => ->(builder, _) { builder.stem_vault.because_text },
          "but_text" => ->(builder, _) { builder.stem_vault.but_text },
          "so_text" => ->(builder, _) { builder.stem_vault.so_text },
          "relevant_text" => ->(builder, _) { builder.stem_vault.relevant_text },
          "full_text" => ->(builder, _) { builder.stem_vault.full_text },
          EXAMPLES_SUBSTITUTION => ->(builder, limit) { builder.examples(limit) },
        }.freeze

        GENERAL_SUBSTITUTIONS = PromptTemplateVariable::NAMES.index_with do |name|
          ->(builder, id) { builder.prompt_template_variable(id) }
        end

        SUBSTITUTIONS = ACTIVITY_SUBSTITUTIONS.merge(GENERAL_SUBSTITUTIONS).freeze

        attr_reader :llm_prompt_template_id, :dataset_id

        validates :llm_prompt_template_id, presence: true
        validates :dataset_id, presence: true

        delegate :contents, to: :llm_prompt_template

        def initialize(llm_prompt_template_id:, dataset_id:)
          @llm_prompt_template_id = llm_prompt_template_id
          @dataset_id = dataset_id

          validate!
        end

        def run
          SUBSTITUTIONS.reduce(contents) do |current_contents, (placeholder, replacement_proc)|
            current_contents.gsub(/#{DELIMITER}#{placeholder}#{OPTIONAL_COMMA_AND_DIGIT_REGEX}#{DELIMITER}/) do
              replacement_proc.call(self, Regexp.last_match(1)&.to_i)
            end
          end
        end

        def examples(limit)
          dataset
            .quill_feedbacks
            .prompt_engineering_data
            .limit(limit)
            .map(&:response_and_feedback)
            .join("\n")
        end

        def prompt_template_variable(id) = PromptTemplateVariable.find(id).value

        def stem_vault = @stem_vault ||= StemVault.find(dataset_id)

        def llm_prompt_template = @llm_prompt_template ||= LLMPromptTemplate.find(llm_prompt_template_id)
      end
    end
  end
end
