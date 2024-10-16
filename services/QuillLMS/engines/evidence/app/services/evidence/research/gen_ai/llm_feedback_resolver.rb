# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class LLMFeedbackResolver < ApplicationService
        class ResolverError < StandardError; end
        class NilRawTextError < ResolverError; end
        class BlankRawTextError < ResolverError; end
        class InvalidJSONError < ResolverError; end
        class UnknownJSONStructureError < ResolverError; end

        # The order of these methods is important
        FEEDBACK_METHODS = %i[
          label
          feedback
          properties_feedback
          properties_feedback_value
          properties_feedback_enum
        ]

        attr_reader :raw_text

        def initialize(raw_text:)
          @raw_text = raw_text
        end

        def run
          validate_raw_text

          return raw_text unless data.is_a?(Hash)

          find_feedback || raise(UnknownJSONStructureError)
        end

        private def validate_raw_text
          raise NilRawTextError if raw_text.nil?
          raise BlankRawTextError if raw_text.blank?
        end

        private def preprocessed_text = RawTextPreprocessor.run(raw_text:)

        private def data
          @data ||= JSON.parse(preprocessed_text)
        rescue JSON::ParserError
          raise InvalidJSONError
        end

        private def find_feedback
          FEEDBACK_METHODS.each do |method|
            result = send(method)
            return result if result.is_a?(String)
          end

          nil
        end

        private def label = data['label']
        private def feedback = data['feedback']
        private def properties_feedback = data.dig('properties', 'feedback')
        private def properties_feedback_value = data.dig('properties', 'feedback', 'value')
        private def properties_feedback_enum = data.dig('properties', 'feedback', 'enum')&.join(' ')
      end
    end
  end
end
