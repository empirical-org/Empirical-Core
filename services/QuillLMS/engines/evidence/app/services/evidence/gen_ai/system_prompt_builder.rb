# frozen_string_literal: true

module Evidence
  module GenAI
    class SystemPromptBuilder < ApplicationService
      TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/system_prompts/'
      DEFAULT_TEMPLATE = '2024_06_07_more_examples.md'

      attr_reader :prompt, :history, :template_file

      def initialize(prompt:, history: [], template_file: nil)
        @prompt = prompt
        @history = history
        @template_file = template_file || DEFAULT_TEMPLATE
      end

      def run = template % template_variables

      # Template priority order
      # 1. GEN_AI_SYSTEM_PROMPT env var
      # 2. Passed in template_file
      # 3. Default template_file
      private def template = ENV.fetch('GEN_AI_SYSTEM_PROMPT', template_file_text)
      private def template_file_text = File.read(template_file_path)
      private def template_file_path = Evidence::Engine.root.join(TEMPLATE_FOLDER, template_file)

      private def template_variables
        {
          passage:,
          plagiarism_text:,
          stem:,
          optimal_examples:,
          suboptimal_examples:
        }
      end

      private def passage = prompt.first_passage&.text
      private def plagiarism_text = prompt.plagiarism_text
      private def stem = prompt.text
      private def example_one = prompt.first_strong_example
      private def example_two = prompt.second_strong_example

      private def optimal_examples = optimal_examples_raw.map {|e| "- #{e}"}.join("\n")
      private def optimal_examples_raw
        [
          # example_one,
          # example_two,
          prompt.optimal_samples
        ].flatten.uniq
      end

      private def suboptimal_examples = prompt.suboptimal_samples.map {|e| "- #{e}"}.join("\n")

      # TODO: These are currently unused, but may be used in the future. Remove if not used.
      private def feedback_history = history.map(&:feedback).map {|f| "- #{f}"}.join("\n")
      private def highlight_texts
        prompt
          .distinct_automl_highlight_texts
          .map.with_index {|text,i| "#{i+1}. #{text}" }
          .join("\n")
      end
    end
  end
end
