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

        # Insert optimal examples:
        # ~~~optimal_examples~~~
        #
        # Regexp.last_match(1)&.to_i will be 20 in this case

        DELIMITER = '~~~'
        OPTIONAL_COMMA_AND_DIGIT_REGEX = '(?:,(\\d+))?'

        ACTIVITY_SUBSTITUTIONS = {
          'stem' => ->(builder, _) { builder.stem_vault.stem },
          'conjunction' => ->(builder, _) { builder.stem_vault.conjunction },
          'because_text' => ->(builder, _) { builder.stem_vault.because_text },
          'but_text' => ->(builder, _) { builder.stem_vault.but_text },
          'so_text' => ->(builder, _) { builder.stem_vault.so_text },
          'relevant_text' => ->(builder, _) { builder.stem_vault.relevant_text },
          'full_text' => ->(builder, _) { builder.stem_vault.full_text },
          'optimal_examples' => ->(builder, _) { builder.optimal_examples },
          'suboptimal_examples' => ->(builder, _) { builder.suboptimal_examples },
          'optimal_guidelines' => ->(builder, _) { builder.optimal_guidelines },
          'suboptimal_guidelines' => ->(builder, _) { builder.suboptimal_guidelines }
        }.freeze

        GENERAL_SUBSTITUTIONS = PromptTemplateVariable::NAMES.index_with do |_name|
          ->(builder, id) { builder.prompt_template_variable(id) }
        end

        SUBSTITUTIONS = ACTIVITY_SUBSTITUTIONS.merge(GENERAL_SUBSTITUTIONS).freeze

        attr_reader :dataset_id, :guidelines, :llm_prompt_template_id, :prompt_examples, :text

        validates :dataset_id, presence: true
        validates :guidelines, presence: true, allow_blank: true
        validates :llm_prompt_template_id, presence: true
        validates :prompt_examples, presence: true, allow_blank: true

        def self.activity_substitutions = ACTIVITY_SUBSTITUTIONS.keys.map { |key| "#{DELIMITER}#{key}#{DELIMITER}" }

        def initialize(dataset_id:, guidelines:, llm_prompt_template_id:, prompt_examples:, text: nil)
          @dataset_id = dataset_id
          @guidelines = guidelines
          @llm_prompt_template_id = llm_prompt_template_id
          @prompt_examples = prompt_examples
          @text = text

          validate!
        end

        def run
          SUBSTITUTIONS.reduce(contents) do |current_contents, (placeholder, replacement_proc)|
            current_contents.gsub(/#{DELIMITER}#{placeholder}#{OPTIONAL_COMMA_AND_DIGIT_REGEX}#{DELIMITER}/) do
              replacement_proc.call(self, Regexp.last_match(1)&.to_i)
            end
          end
        end

        def contents = text || llm_prompt_template.contents

        def optimal_examples = prompt_examples.optimal.map(&:response_feedback_status).join("\n")
        def suboptimal_examples = prompt_examples.suboptimal.map(&:response_feedback_status).join("\n")

        def optimal_guidelines = guidelines.optimal.map(&:text).join("\n")
        def suboptimal_guidelines = guidelines.suboptimal.map(&:text).join("\n")

        def prompt_template_variable(id) = PromptTemplateVariable.find(id).value

        def stem_vault = @stem_vault ||= Dataset.find(dataset_id).stem_vault

        def llm_prompt_template = @llm_prompt_template ||= LLMPromptTemplate.find(llm_prompt_template_id)
      end
    end
  end
end
