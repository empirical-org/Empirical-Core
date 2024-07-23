# frozen_string_literal: true

module Evidence
  module GenAI
    class SystemPromptBuilder < ApplicationService
      TEMPLATE_FOLDER = 'app/services/evidence/gen_ai/system_prompts/'
      DEFAULT_TEMPLATE = '2024_07_11_plagiarism_only.md'

      OPTIMAL_SAMPLE_COUNT = 100
      SUBOPTIMAL_SAMPLE_COUNT = 100

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
      private def plagiarism_text = markdown_ul(prompt.plagiarism_texts)
      private def stem = prompt.text
      private def optimal_examples = markdown_ul(optimal_example_list)
      private def suboptimal_examples = markdown_ul(suboptimal_example_list)

      private def optimal_example_list = prompt.optimal_samples(limit: OPTIMAL_SAMPLE_COUNT)
      private def suboptimal_example_list = prompt.suboptimal_samples(limit: SUBOPTIMAL_SAMPLE_COUNT)
      private def markdown_ul(array) = array.map { |i| "- #{i}" }.join("\n")

      # TODO: These are currently unused, but may be used in the future. Remove if not used.
      private def example_one = prompt.first_strong_example
      private def example_two = prompt.second_strong_example
      private def feedback_history = markdown_ul(history.map(&:feedback))
      private def highlight_texts
        prompt
          .distinct_automl_highlight_texts
          .map.with_index { |text,i| "#{i+1}. #{text}" }
          .join("\n")
      end
    end
  end
end
