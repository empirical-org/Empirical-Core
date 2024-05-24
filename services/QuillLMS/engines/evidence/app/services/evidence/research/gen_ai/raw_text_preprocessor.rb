# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class RawTextPreprocessor < ApplicationService
        attr_reader :raw_text, :text

        def initialize(raw_text:)
          @raw_text = raw_text
        end

        def run
          @text = remove_newlines_and_leading_and_trailing_spaces

          return strip_feedback_preamble if feedback_preamble?
          return strip_triple_backticks_and_json_preamble if json_preamble?

          text
        end

        private def remove_newlines_and_leading_and_trailing_spaces = raw_text.gsub("\n", '').strip

        private def feedback_preamble? = text.start_with?('Feedback: ')

        private def json_preamble? = text.start_with?("```json") && text.end_with?("```")

        private def strip_feedback_preamble = text.sub(/^Feedback: /, '')

        private def strip_triple_backticks_and_json_preamble = text.sub(/^```json/, '').sub(/```$/, '')
      end
    end
  end
end
