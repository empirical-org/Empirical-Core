# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMPromptBuilder < ApplicationService
        class InvalidLLMPromptTemplateIdError < StandardError; end
        class InvalidPassagePromptIdError < StandardError; end

        DELIMITER = "~~~"
        OPTIONAL_COMMA_AND_DIGIT_REGEX = "(?:,(\\d+))?"

        SUBSTITUTIONS = {
          "prompt" => ->(builder, _) { builder.passage_prompt.prompt },
          "instructions" => ->(builder, _) { builder.passage_prompt.instructions },
          "examples" => ->(builder, limit) { builder.examples(limit) },
        }.freeze

        attr_reader :llm_prompt_template_id, :passage_prompt_id

        delegate :contents, to: :llm_prompt_template

        def initialize(llm_prompt_template_id:, passage_prompt_id:)
          @llm_prompt_template_id = llm_prompt_template_id
          @passage_prompt_id = passage_prompt_id
        end

        def run
          raise InvalidLLMPromptTemplateIdError unless llm_prompt_template_id
          raise InvalidPassagePromptIdError unless passage_prompt_id

          prompt
        end

        def examples(limit)
          passage_prompt
            .example_prompt_response_feedbacks
            .limit(limit)
            .map(&:response_and_feedback)
            .join("\n")
        end

        def passage_prompt = @passage_prompt ||= PassagePrompt.find(passage_prompt_id)

        def llm_prompt_template = @llm_prompt_template ||= LLMPromptTemplate.find(llm_prompt_template_id)

        private def prompt
          SUBSTITUTIONS.reduce(contents) do |current_contents, (placeholder, replacement_proc)|
            current_contents.gsub(/#{DELIMITER}#{placeholder}#{OPTIONAL_COMMA_AND_DIGIT_REGEX}#{DELIMITER}/) do
              replacement_proc.call(self, Regexp.last_match(1)&.to_i)
            end
          end
        end
      end
    end
  end
end
