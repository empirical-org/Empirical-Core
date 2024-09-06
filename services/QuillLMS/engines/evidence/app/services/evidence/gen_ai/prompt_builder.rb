# frozen_string_literal: true

module Evidence
  module GenAI
    class PromptBuilder < ApplicationService
      PIPE = '|'

      attr_reader :prompt, :history, :template_file

      def initialize(prompt:, history: [], template_file: nil)
        @prompt = prompt
        @history = history
        @template_file = template_file || default_template
      end

      def run = template % template_variables

      private def template_variables
        raise NotImplementedError, 'Must implement template_variables'
      end

      private def template_folder
        raise NotImplementedError, 'Must implement template_folder'
      end

      private def default_template
        raise NotImplementedError, 'Must implement default_template'
      end

      private def template = File.read(template_file_path)
      private def template_file_path = Evidence::Engine.root.join(template_folder, template_file)

      private def passage = prompt.first_passage&.text
      private def plagiarism_text = markdown_ul(prompt.plagiarism_texts)
      private def stem = prompt.text

      private def markdown_ul(array) = array.map { |i| "- #{i}" }.join("\n")
      private def markdown_ol(array) = array.map.with_index { |text, i| "#{i + 1}. #{text}" }.join("\n")
      private def markdown_table_rows(array_of_arrays)
        array_of_arrays.map { |array| "#{PIPE}#{array.join(PIPE)}#{PIPE}" }.join("\n")
      end

      # TODO: These are currently unused, but may be used in the future. Remove if not used.
      private def example_one = prompt.first_strong_example
      private def example_two = prompt.second_strong_example
      private def feedback_history = markdown_ol(history.map { |h| strip_tags(h) })

      private def strip_tags(entry) = HTMLTagRemover.run(entry&.chomp)

      private def highlight_texts
        prompt
          .distinct_automl_highlight_arrays
          .map.with_index { |text_array, i| "#{i + 1}. #{text_array.join(' ')}" }
          .join("\n")
      end
    end
  end
end
