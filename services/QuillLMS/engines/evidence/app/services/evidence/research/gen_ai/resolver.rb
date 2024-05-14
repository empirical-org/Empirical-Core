# frozen_string_literal: true

module Evidence
  module Research
    module GenAI
      class Resolver < ApplicationService
        attr_reader :raw_text

        class ResolverError < StandardError; end
        class NilFeedbackError < ResolverError; end
        class EmptyFeedbackError < ResolverError; end
        class BlankTextError < ResolverError; end
        class InvalidJSONError < StandardError; end
        class UnknownFeedbackStructureError < ResolverError; end

        def initialize(raw_text:)
          @raw_text = raw_text
        end

        def run
          raise NilFeedbackError if raw_text.nil?
          raise EmptyFeedbackError if raw_text.empty?

          return raw_text unless data.is_a?(Hash)

          simple_feedback || enumerated_feedback || raise(UnknownFeedbackStructureError, "Unknown structure: '#{data}'")
        end

        private def data
          @data ||= JSON.parse(raw_text)
        rescue JSON::ParserError
          raise InvalidJSONError, "Invalid JSON provided: '#{raw_text}'"
        end

        private def simple_feedback = data['feedback']

        private def enumerated_feedback = data.dig('properties', 'feedback', 'enum')&.join(' ')
      end
    end
  end
end
