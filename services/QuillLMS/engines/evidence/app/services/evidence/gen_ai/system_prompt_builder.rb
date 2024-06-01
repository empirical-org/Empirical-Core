# frozen_string_literal: true

module Evidence
  module GenAI
    class SystemPromptBuilder < ApplicationService
      TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/system_prompts/'
      DEFAULT_TEMPLATE = '2024_05_24_initial.md'

      attr_reader :prompt, :history, :template_file

      def initialize(prompt:, history: [], template_file: DEFAULT_TEMPLATE)
        @prompt = prompt
        @history = history
        @template_file = template_file
      end

      def run = template % template_variables

      # Template priority order
      # 1. GEN_AI_SYSTEM_PROMPT env var
      # 2. Passed in template_file (has a default)
      private def template = ENV.fetch('GEN_AI_SYSTEM_PROMPT', template_file_text)
      private def template_file_text = File.read(template_file_path)
      private def template_file_path = Evidence::Engine.root.join(TEMPLATE_FOLDER, template_file)

      private def template_variables
        {
          passage:,
          plagiarism_text:,
          stem:,
          example_one:,
          example_two:,
          highlight_texts:,
          feedback_history:,
          percent_similar:
        }
      end

      private def passage = prompt.first_passage&.text
      private def plagiarism_text = prompt.plagiarism_text
      private def stem = prompt.text
      private def example_one = prompt.first_strong_example
      private def example_two = prompt.second_strong_example
      private def highlight_texts
        prompt.distinct_highlight_texts.map.with_index {|text,i| "#{i+1}. #{text}" }.join("\n")
      end

      private def feedback_history = history.map(&:feedback).map {|f| "- #{f}"}.join("\n")

      # Using a % in the template gave errors, so making this a variable
      private def percent_similar = '90%'
    end
  end
end
