# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class RawTextPreprocessor < ApplicationService
        attr_reader :raw_text

        def initialize(raw_text:)
          @raw_text = raw_text
        end

        def run
          return strip_feedback_preamble if feedback_preamble?
          return strip_triple_backticks_and_json_preamble if json_preamble?

          raw_text
        end

        def feedback_preamble? = raw_text.start_with?('Feedback: ')

        def json_preamble? = raw_text.start_with?("```json\n") && raw_text.end_with?("\n```")

        def strip_feedback_preamble = raw_text.sub(/^Feedback: /, '')

        def strip_triple_backticks_and_json_preamble = raw_text.sub(/^```json\n/, '').sub(/\n```$/, '')
      end
    end
  end
end
